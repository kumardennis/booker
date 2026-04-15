import { headers } from "next/headers";
import { type NextRequest } from "next/server";
import type { Database } from "../../../../../database.types";

type BodyType = Partial<
    Pick<
        Database["public"]["Tables"]["club_groups"]["Insert"],
        | "club_id"
        | "address_id"
        | "max_occupancy"
        | "once_in_number_of_weeks"
        | "day"
        | "start_time"
        | "end_time"
    >
>;

export async function POST(request: NextRequest) {
    const requestData = request.body ? await request.json() : {};

    const {
        club_id,
        address_id,
        max_occupancy,
        once_in_number_of_weeks,
        day,
        start_time,
        end_time,
    } = requestData;

    const headersList = await headers();
    const auth = headersList.get("Authorization");

    const body: BodyType = {
        club_id,
        address_id,
        max_occupancy,
        once_in_number_of_weeks,
        day,
        start_time,
        end_time,
    };

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/groups/create-club-group`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth ?? "",
            },
            body: JSON.stringify(Object.keys(requestData).length ? body : {}),
        },
    );

    const data = await response.json();

    return Response.json(data);
}
