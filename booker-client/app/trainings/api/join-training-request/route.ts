import { headers } from "next/headers";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const requestData = request.body ? await request.json() : {};

    const { user_id, training_id } = requestData;

    const headersList = await headers();
    const auth = headersList.get("Authorization");

    const body = {
        ...(user_id && { user_id }),
        ...(training_id && { training_id }),
    };

    const response = await fetch(
        "http://127.0.0.1:54321/functions/v1/trainings/create-join-training-request",
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

export async function DELETE(request: NextRequest) {
    const requestData = request.body ? await request.json() : {};

    const { user_id, training_id } = requestData;

    const headersList = await headers();
    const auth = headersList.get("Authorization");

    const body = {
        ...(user_id && { user_id }),
        ...(training_id && { training_id }),
    };

    const response = await fetch(
        "http://127.0.0.1:54321/functions/v1/groups/delete-join-training-request",
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

export async function PUT(request: NextRequest) {
    const requestData = request.body ? await request.json() : {};

    const { user_id, training_id, is_accepted, is_rejected } = requestData;

    const headersList = await headers();
    const auth = headersList.get("Authorization");

    const body = {
        ...(user_id && { user_id }),
        ...(training_id && { training_id }),
        ...(is_accepted && { is_accepted }),
        ...(is_rejected && { is_rejected }),
    };

    const response = await fetch(
        "http://127.0.0.1:54321/functions/v1/trainings/update-join-training-request",
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
