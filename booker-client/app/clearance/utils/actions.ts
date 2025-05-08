import {
    CRUDType,
    EventType,
    EventTypePermission,
    GroupEventType,
    User,
} from "@/app/types";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { type NextRequest } from "next/server";

type BodyType = {
    group_id: string | undefined;
    event_types: EventType[];
};

// export const fetchCache = "force-no-store";
// export const revalidate = 0;

export async function getClearance(requestData: BodyType) {
    const supabase = await createClient();

    const {
        group_id,
        event_types,
    } = requestData;

    if (!group_id || !event_types) {
        return Response.json({
            error: "Missing required fields",
        }, {
            status: 400,
        });
    }

    const { data: authData } = await supabase.auth.getUser();
    const { data: userData, error: userError } = await supabase
        .from("users").select(
            "id, user_id, is_trainer, is_club_admin",
        ).eq("user_id", authData?.user?.id).single();

    const { data: groupData, error } = await supabase
        .from("club_groups")
        .select(
            `id, users:${
                userData?.is_trainer ? "trainers_groups" : "users_groups"
            }!inner(id, users!inner(user_id, is_trainer, is_club_admin))`,
        )
        .eq("id", group_id);

    if (error || !groupData) {
        return Response.json({
            error: "FUCKKKK",
            groupData,
            authData,
        }, {
            status: 500,
        });
    }

    const responseToSend: {
        eventsPermissions: EventTypePermission[];
    } = {
        eventsPermissions: [],
    };

    const user = groupData[0]?.users[0]?.users as unknown as {
        user_id: any;
        is_trainer: any;
        is_club_admin: any;
    };

    for (const eventType of event_types) {
        if (user?.is_club_admin) {
            responseToSend.eventsPermissions.push({
                event_type: eventType,
                crudAllowed: [
                    CRUDType.CREATE,
                    CRUDType.READ,
                    CRUDType.UPDATE,
                    CRUDType.DELETE,
                ],
            });
        }

        if (user?.is_trainer && !user?.is_club_admin) {
            responseToSend.eventsPermissions.push({
                event_type: eventType,
                crudAllowed: [CRUDType.READ, CRUDType.UPDATE],
            });
        }

        if (!user?.is_trainer && !user?.is_club_admin) {
            responseToSend.eventsPermissions.push({
                event_type: eventType,
                crudAllowed: [
                    CRUDType.READ,
                    ...(eventType === GroupEventType.GROUP_USER_LEAVE
                        ? [CRUDType.UPDATE]
                        : []),
                ],
            });
        }
    }
    return Response.json({
        eventsPermissions: responseToSend.eventsPermissions,
        groupData,
        userData,
        user: groupData[0]?.users[0]?.users,
        error,
    });
}
