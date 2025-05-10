"use server";
import { getUserProfile } from "@/lib/user-cache";

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
    return data;
}
