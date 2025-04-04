import { headers } from "next/headers";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const requestData = request.body ? await request.json() : {};

    const { club_id } = requestData;

    const headersList = await headers();
    const auth = headersList.get("Authorization");

    const body = { club_id: undefined };

    if (club_id) {
        body.club_id = club_id;
    }

    const response = await fetch(
        "http://127.0.0.1:54321/functions/v1/clubs/get-clubs",
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
