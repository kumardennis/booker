"use server";
import { getUserProfile } from "@/lib/user-cache";
import { revalidatePath } from "next/cache";

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
        "http://localhost:3000/groups/api/update-club-groups-user",
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
        "http://localhost:3000/groups/api/join-group-request",
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
        "http://localhost:3000/groups/api/join-group-request",
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
        "http://localhost:3000/groups/api/join-group-request",
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
        `http://localhost:3000/groups/api/get-club-groups?${queryString}`,
    );
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}
