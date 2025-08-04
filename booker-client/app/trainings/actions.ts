import { GroupTraining } from "../types";

export const getGroupTrainings = async ({
    club_id,
    day,
    group_id,
    date,
    month,
    year,
    user_id,
}: {
    club_id?: string;
    day?: string;
    group_id?: string;
    date?: string;
    month?: string;
    year?: string;
    user_id?: string;
}) => {
    const response = await fetch(
        `http://localhost:3000/trainings/api/get-group-trainings`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                club_id,
                day,
                group_id,
                date,
                month,
                year,
                user_id,
            }),
            cache: "no-store",
        },
    );

    const data = await response.json();

    const trainings: GroupTraining[] = data.data;

    console.log("getGroupTrainings response:", data);

    return trainings;
};
