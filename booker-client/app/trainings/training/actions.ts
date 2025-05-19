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
