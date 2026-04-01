import "server-only";

import { GroupTraining } from "../types";

type GetTrainingsDataOptions = {
    clubId?: string;
    day?: string;
    trainingId?: string;
    groupId?: string;
    tillDate?: string;
    fromDate?: string;
    date?: string;
    month?: string;
    year?: string;
    userId?: string;
    authorization?: string | null;
};

type TrainingsFunctionResponse = {
    isRequestSuccessfull?: boolean;
    isRequestSuccessful?: boolean;
    data?: GroupTraining[];
    error?: unknown;
};

export const getTrainingsData = async ({
    clubId,
    day,
    trainingId,
    groupId,
    tillDate,
    fromDate,
    date,
    month,
    year,
    userId,
    authorization,
}: GetTrainingsDataOptions = {}): Promise<TrainingsFunctionResponse> => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
        return {
            isRequestSuccessfull: false,
            data: [],
            error: { message: "Missing NEXT_PUBLIC_SUPABASE_URL" },
        };
    }

    const dateForQuery = year && month && date
        ? `${year}-${month.toString().padStart(2, "0")}-${
            date
                .toString()
                .padStart(2, "0")
        }`
        : undefined;

    const body: {
        club_id?: string;
        day?: string;
        training_id?: string;
        group_id?: string;
        till_date?: string;
        from_date?: string;
        user_id?: string;
    } = {};

    if (clubId) body.club_id = clubId;
    if (day && !date) body.day = day;
    if (trainingId) body.training_id = trainingId;
    if (groupId) body.group_id = groupId;
    if (tillDate) body.till_date = tillDate;
    if (fromDate || dateForQuery) body.from_date = fromDate ?? dateForQuery;
    if (userId) body.user_id = userId;

    const authHeader = authorization && authorization.trim().length > 0
        ? authorization
        : anonKey
        ? `Bearer ${anonKey}`
        : "";

    const response = await fetch(
        `${supabaseUrl}/functions/v1/trainings/get-group-trainings`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(anonKey ? { apikey: anonKey } : {}),
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: JSON.stringify(body),
            cache: "no-store",
        },
    );

    const text = await response.text();

    if (!text) {
        return {
            isRequestSuccessfull: false,
            data: [],
            error: { message: "Empty response from trainings function" },
        };
    }

    return JSON.parse(text) as TrainingsFunctionResponse;
};
