import { headers } from "next/headers";
import { type NextRequest } from "next/server";

import { getTrainingsData } from "../../get-trainings-data";

export async function POST(request: NextRequest) {
    const requestData = request.body ? await request.json() : {};

    const {
        club_id,
        day,
        date,
        month,
        year,
        group_id,
        till_date,
        from_date,
        training_id,
        user_id,
        is_active,
    } = requestData;

    const headersList = await headers();
    const auth = headersList.get("Authorization");

    const data = await getTrainingsData({
        clubId: club_id,
        day,
        date,
        month,
        year,
        groupId: group_id,
        tillDate: till_date,
        fromDate: from_date,
        trainingId: training_id ? training_id.toString() : undefined,
        userId: user_id ? user_id.toString() : undefined,
        authorization: auth,
        isActive: is_active,
    });

    return Response.json(data);
}
