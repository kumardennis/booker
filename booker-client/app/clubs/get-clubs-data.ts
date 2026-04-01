import "server-only";

import { Club } from "../types";

type GetClubsDataOptions = {
    clubId?: string;
    authorization?: string | null;
};

type ClubsFunctionResponse = {
    isRequestSuccessfull?: boolean;
    isRequestSuccessful?: boolean;
    data?: Club[];
    error?: unknown;
};

export const getClubsData = async ({
    clubId,
    authorization,
}: GetClubsDataOptions = {}): Promise<ClubsFunctionResponse> => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
        return {
            isRequestSuccessfull: false,
            data: [],
            error: { message: "Missing NEXT_PUBLIC_SUPABASE_URL" },
        };
    }

    const body: { club_id?: string } = {};

    if (clubId) {
        body.club_id = clubId;
    }

    const authHeader = authorization && authorization.trim().length > 0
        ? authorization
        : anonKey
        ? `Bearer ${anonKey}`
        : "";

    const response = await fetch(
        `${supabaseUrl}/functions/v1/clubs/get-clubs`,
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
            error: { message: "Empty response from clubs function" },
        };
    }

    return JSON.parse(text) as ClubsFunctionResponse;
};
