"use server";
import { getUserProfile } from "@/lib/user-cache";
import { revalidatePath } from "next/cache";
import { getTrainingsData } from "../get-trainings-data";

const parseResponseJsonSafe = async (response: Response) => {
    const responseText = await response.text();

    if (!responseText) {
        return {} as Record<string, unknown>;
    }

    try {
        return JSON.parse(responseText) as Record<string, unknown>;
    } catch {
        throw new Error("Unexpected non-JSON response from server");
    }
};

export const getTrainings = async (training_id: number) => {
    return getTrainingsData({ trainingId: training_id.toString() });
};

export async function acceptJoinTrainingRequest(
    student_id: number | undefined,
    training_id: number | undefined,
) {
    if (!student_id || !training_id) {
        return null;
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/trainings/api/join-training-request`,
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
        `${process.env.NEXT_PUBLIC_SITE_URL}/trainings/api/join-training-request`,
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
    const data = await parseResponseJsonSafe(response);

    if (!response.ok) {
        throw new Error(
            (data.error as string) || "Failed to delete join request",
        );
    }

    if (data.error) {
        throw new Error((data.error as string).toString());
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
        `${process.env.NEXT_PUBLIC_SITE_URL}/trainings/api/update-group-training-user`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: userProfile.id,
                training_id,
                is_active: false,
            }),
        },
    );
    const data = await parseResponseJsonSafe(response);

    if (!response.ok) {
        throw new Error(
            (data.error as string) || "Failed to update training user",
        );
    }

    if (data.error) {
        throw new Error(data.error.toString());
    }
    revalidatePath("/", "layout");
    return data;
}
