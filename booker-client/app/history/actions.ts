export async function getHistory(
    group_id?: number,
    training_id?: number,
) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/history/api/get-history`,
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
