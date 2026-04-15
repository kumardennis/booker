import "server-only";

import { Address } from "../types";

type GetAddressesDataOptions = {
    clubId?: string;
    authorization?: string | null;
};

type AddressesFunctionResponse = {
    isRequestSuccessfull?: boolean;
    isRequestSuccessful?: boolean;
    data?: Address[];
    error?: unknown;
};

export const getAddressesData = async ({
    clubId,
    authorization,
}: GetAddressesDataOptions = {}): Promise<AddressesFunctionResponse> => {
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
        `${supabaseUrl}/functions/v1/clubs/get-club-addresses`,
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
            error: { message: "Empty response from addresses function" },
        };
    }

    return JSON.parse(text) as AddressesFunctionResponse;
};