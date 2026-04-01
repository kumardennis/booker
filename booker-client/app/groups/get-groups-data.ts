import "server-only";

import { ClubGroup } from "../types";

type GetGroupsDataOptions = {
    clubId?: string;
    day?: string;
    groupId?: string;
    userId?: string;
    authorization?: string | null;
};

type GroupsFunctionResponse = {
    isRequestSuccessfull?: boolean;
    isRequestSuccessful?: boolean;
    data?: ClubGroup[];
    error?: unknown;
};

export const getGroupsData = async ({
    clubId,
    day,
    groupId,
    userId,
    authorization,
}: GetGroupsDataOptions = {}): Promise<GroupsFunctionResponse> => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
        return {
            isRequestSuccessfull: false,
            data: [],
            error: { message: "Missing NEXT_PUBLIC_SUPABASE_URL" },
        };
    }

    const body: {
        club_id?: string;
        day?: string;
        group_id?: string;
        user_id?: string;
    } = {};

    if (clubId) body.club_id = clubId;
    if (day) body.day = day;
    if (groupId) body.group_id = groupId;
    if (userId) body.user_id = userId;

    const authHeader = authorization && authorization.trim().length > 0
        ? authorization
        : anonKey
        ? `Bearer ${anonKey}`
        : "";

    const response = await fetch(
        `${supabaseUrl}/functions/v1/groups/get-club-groups`,
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
            error: { message: "Empty response from groups function" },
        };
    }

    return JSON.parse(text) as GroupsFunctionResponse;
};
