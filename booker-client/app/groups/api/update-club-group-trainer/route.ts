import { headers } from "next/headers";
import { type NextRequest } from "next/server";

const handleRequest = async (request: NextRequest) => {
    const requestData = request.body ? await request.json() : {};

    const { trainer_id, group_id } = requestData;

    const headersList = await headers();
    const auth = headersList.get("Authorization");

    const body = {
        ...(trainer_id && { trainer_id }),
        ...(group_id && { group_id }),
    };

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/groups/update-club-group-trainer`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth ?? "",
            },
            body: JSON.stringify(body),
        },
    );

    const text = await response.text();
    const data = text ? JSON.parse(text) : {
        isRequestSuccessfull: false,
        data: null,
        error: "Empty response from update-club-group-trainer",
    };

    return Response.json(data);
};

export const POST = handleRequest;
export const PUT = handleRequest;
