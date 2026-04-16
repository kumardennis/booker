"use server";
import { getUserProfile } from "@/lib/user-cache";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") {
        return error;
    }

    if (error && typeof error === "object") {
        const maybeError = error as {
            message?: string;
            details?: string;
            hint?: string;
            code?: string;
        };

        if (maybeError.message) {
            return maybeError.message;
        }

        if (maybeError.details) {
            return maybeError.details;
        }

        if (maybeError.hint) {
            return maybeError.hint;
        }

        if (maybeError.code) {
            return `Request failed (${maybeError.code})`;
        }

        return JSON.stringify(error);
    }

    return "Request failed";
};

export async function leaveMyGroup(
    user_id: string | undefined,
    group_id: number | undefined,
) {
    if (!user_id || !group_id) {
        return null;
    }

    const userProfile = await getUserProfile(user_id);

    if (!userProfile) {
        throw new Error("User profile not found");
    }
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/groups/api/update-club-groups-user`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: userProfile.id,
                group_id,
                is_active: "false",
            }),
        },
    );
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    revalidatePath("/", "layout");
    return data;
}

export async function deleteJoinGroupRequest(
    user_uuid: string | undefined,
    group_id: number | undefined,
) {
    if (!user_uuid || !group_id) {
        return null;
    }

    const userProfile = await getUserProfile(user_uuid);

    if (!userProfile) {
        throw new Error("User profile not found");
    }
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/groups/api/join-group-request`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: userProfile.id,
                group_id,
            }),
        },
    );
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function acceptJoinGroupRequest(
    student_id: number | undefined,
    group_id: number | undefined,
) {
    if (!student_id || !group_id) {
        return null;
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/groups/api/join-group-request`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: student_id,
                group_id,
                is_accepted: true,
            }),
        },
    );
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function rejectJoinGroupRequest(
    student_id: number | undefined,
    group_id: number | undefined,
) {
    if (!student_id || !group_id) {
        return null;
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/groups/api/join-group-request`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: student_id,
                group_id,
                is_rejected: true,
            }),
        },
    );
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function getClubGroups(
    queryString: string = "",
) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/groups/api/get-club-groups?${queryString}`,
    );
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function updateGroupTrainer(
    trainer_id: number | undefined,
    group_id: number | undefined,
) {
    if (!trainer_id || !group_id) {
        return null;
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/groups/api/update-club-group-trainer`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                trainer_id,
                group_id,
            }),
        },
    );

    const data = await response.json();

    if (data.error) {
        throw new Error(getErrorMessage(data.error));
    }

    revalidatePath("/", "layout");

    return data;
}

export async function syncUserReplacementToTrainings(
    group_id: number | undefined,
    old_user_id: number | undefined,
    new_user_id?: number | null,
) {
    if (!group_id || !old_user_id) {
        return null;
    }

    const supabase = await createClient();

    const { data, error } = await supabase.rpc(
        "sync_user_replacement_to_trainings",
        {
            _group_id: group_id,
            _old_user_id: old_user_id,
            _new_user_id: new_user_id ?? null,
        },
    );

    if (error) {
        throw new Error(getErrorMessage(error));
    }

    revalidatePath("/", "layout");

    return data;
}

export async function syncGroupChangesToTrainings(
    group_id: number | undefined,
) {
    if (!group_id) {
        return null;
    }

    const supabase = await createClient();

    const { data, error } = await supabase.rpc(
        "sync_group_changes_to_trainings",
        {
            _group_id: group_id,
        },
    );

    if (error) {
        throw new Error(getErrorMessage(error));
    }

    revalidatePath("/", "layout");

    return data;
}

export async function setGroupUpcomingUsersTrainingsActive(
    group_id: number | undefined,
    is_active: boolean | undefined,
) {
    if (!group_id || typeof is_active !== "boolean") {
        return null;
    }

    const supabase = await createClient();

    const { data, error } = await supabase.rpc(
        "set_group_upcoming_users_trainings_active",
        {
            _group_id: group_id,
            _is_active: is_active,
        },
    );

    if (error) {
        throw new Error(getErrorMessage(error));
    }

    revalidatePath("/", "layout");

    return data;
}
