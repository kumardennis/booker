import { headers } from "next/headers";
import { type NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
    const requestData = request.body ? await request.json() : {};

    const { user_id, is_active, group_id } = requestData;

    const headersList = await headers();
    const auth = headersList.get("Authorization");

    const body = {
        ...(user_id && { user_id }),
        ...(is_active && { is_active }),
        ...(group_id && { group_id }),
    };

    const response = await fetch(
        "http://127.0.0.1:54321/functions/v1/groups/update-club-groups-user",
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
