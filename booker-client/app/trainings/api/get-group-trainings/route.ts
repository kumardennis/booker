import { headers } from "next/headers";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const requestData = request.body ? await request.json() : {};

    const { club_id, day, from_date, till_date, training_id } = requestData;

    const headersList = await headers();
    const auth = headersList.get("Authorization");

    const body = {
        club_id: undefined,
        day: undefined,
        training_id: undefined,
        till_date: undefined,
        from_date: undefined,
    };

    body.club_id = club_id;
    body.day = day;
    body.training_id = training_id;
    body.from_date = from_date;
    body.till_date = till_date;

    const response = await fetch(
        "http://127.0.0.1:54321/functions/v1/groups/get-club-groups",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth ?? "",
            },
            body: JSON.stringify(body),
        },
    );

    const data = await response.json();

    return Response.json(data);
}
