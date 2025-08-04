export async function getHistory(
    group_id?: number,
    training_id?: number,
) {
    const response = await fetch(
        `http://localhost:3000/history/api/get-history`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...(group_id && { group_id }),
                ...(training_id && { training_id }),
            }),
            cache: "no-store",
        },
    );

    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}
