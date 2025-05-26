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
