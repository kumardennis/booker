import { headers } from "next/headers";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const club_id = searchParams.get("club_id");
    const day = searchParams.get("day");
    const group_id = searchParams.get("group_id");
    const user_id = searchParams.get("user_id");

    const headersList = await headers();
    const auth = headersList.get("Authorization");

    const body = {
        ...(club_id && { club_id }),
        ...(day && { day }),
        ...(group_id && { group_id }),
        ...(user_id && { user_id }),
    };

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/groups/get-club-groups`,
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
