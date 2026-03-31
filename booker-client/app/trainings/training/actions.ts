"use server";
import { getUserProfile } from "@/lib/user-cache";
import { revalidatePath } from "next/cache";

export const getTrainings = async (training_id: number) => {
    const response = await fetch(
        `http://localhost:3000/trainings/api/get-group-trainings`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                training_id,
            }),
            cache: "no-store",
        },
    );

    const data = await response.json();

    return data;
};

export async function acceptJoinTrainingRequest(
    student_id: number | undefined,
    training_id: number | undefined,
) {
    if (!student_id || !training_id) {
        return null;
    }

    const response = await fetch(
        "http://localhost:3000/trainings/api/join-training-request",
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: student_id,
                training_id,
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

export async function deleteJoinTrainingRequest(
    user_uuid: string | undefined,
    training_id: number | undefined,
) {
    if (!user_uuid || !training_id) {
        return null;
    }

    const userProfile = await getUserProfile(user_uuid);

    if (!userProfile) {
        throw new Error("User profile not found");
    }
    const response = await fetch(
        "http://localhost:3000/groups/api/join-training-request",
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: userProfile.id,
                training_id,
            }),
        },
    );
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function leaveMyTraining(
    user_id: string | undefined,
    training_id: number | undefined,
) {
    if (!user_id || !training_id) {
        return null;
    }

    const userProfile = await getUserProfile(user_id);

    if (!userProfile) {
        throw new Error("User profile not found");
    }
    const response = await fetch(
        "http://localhost:3000/groups/api/update-training-user",
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: userProfile.id,
                training_id,
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
