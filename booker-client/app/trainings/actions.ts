import { GroupTraining } from "../types";
import { getTrainingsData } from "./get-trainings-data";

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
    const data = await getTrainingsData({
        clubId: club_id,
        day,
        groupId: group_id,
        date,
        month,
        year,
        userId: user_id,
    });

    const trainings: GroupTraining[] = data.data ?? [];

    return trainings;
};
