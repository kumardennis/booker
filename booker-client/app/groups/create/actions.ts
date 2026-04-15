"use server";

import { encodedRedirect } from "@/utils/utils";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Database } from "../../../../database.types";

type CreateClubGroupPayload = Pick<
    Database["public"]["Tables"]["club_groups"]["Insert"],
    | "club_id"
    | "address_id"
    | "max_occupancy"
    | "once_in_number_of_weeks"
    | "day"
    | "start_time"
    | "end_time"
>;

const toNumber = (value: FormDataEntryValue | null) => {
    if (typeof value !== "string") return NaN;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : NaN;
};

export const createGroupAction = async (formData: FormData) => {
    const clubId = toNumber(formData.get("club_id"));
    const addressId = toNumber(formData.get("address_id"));
    const maxOccupancy = toNumber(formData.get("max_occupancy"));
    const onceInNumberOfWeeks = toNumber(
        formData.get("once_in_number_of_weeks"),
    );

    const day = formData.get("day")?.toString().trim();
    const startTime = formData.get("start_time")?.toString().trim();
    const endTime = formData.get("end_time")?.toString().trim();

    if (!day || !startTime || !endTime) {
        return encodedRedirect(
            "error",
            "/groups/create",
            "Day, start time and end time are required.",
        );
    }

    if (!Number.isInteger(clubId) || !Number.isInteger(addressId)) {
        return encodedRedirect(
            "error",
            "/groups/create",
            "Please select a valid club and address.",
        );
    }

    if (!Number.isInteger(maxOccupancy) || maxOccupancy <= 0) {
        return encodedRedirect(
            "error",
            "/groups/create",
            "Max occupancy must be a positive number.",
        );
    }

    if (!Number.isInteger(onceInNumberOfWeeks) || onceInNumberOfWeeks <= 0) {
        return encodedRedirect(
            "error",
            "/groups/create",
            "Repeat interval must be at least 1 week.",
        );
    }

    if (startTime >= endTime) {
        return encodedRedirect(
            "error",
            "/groups/create",
            "End time must be later than start time.",
        );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const authorization = (await headers()).get("Authorization");

    if (!supabaseUrl) {
        return encodedRedirect(
            "error",
            "/groups/create",
            "Missing NEXT_PUBLIC_SUPABASE_URL.",
        );
    }

    const authHeader = authorization && authorization.trim().length > 0
        ? authorization
        : anonKey
        ? `Bearer ${anonKey}`
        : "";

    const payload: CreateClubGroupPayload = {
        club_id: clubId,
        address_id: addressId,
        max_occupancy: maxOccupancy,
        once_in_number_of_weeks: onceInNumberOfWeeks,
        day,
        start_time: `${startTime}:00`,
        end_time: `${endTime}:00`,
    };

    const response = await fetch(
        `${supabaseUrl}/functions/v1/groups/create-club-group`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(anonKey ? { apikey: anonKey } : {}),
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: JSON.stringify(payload),
        },
    );

    const data = await response.json();

    if (!data?.isRequestSuccessfull) {
        return encodedRedirect(
            "error",
            "/groups/create",
            data?.error?.message || data?.error || "Could not create group.",
        );
    }

    revalidatePath("/groups");
    redirect("/groups");
};
