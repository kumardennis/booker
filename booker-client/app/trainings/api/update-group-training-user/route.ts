import { headers } from "next/headers";
import { type NextRequest } from "next/server";

type BodyType = {
    user_id: number | undefined;
    training_id: number | undefined;
    is_active: boolean | undefined;
};

export async function PUT(request: NextRequest) {
    const requestData = request.body ? await request.json() : {};

    const {
        user_id,
        training_id,
        is_active,
    } = requestData;

    const headersList = await headers();
    const auth = headersList.get("Authorization");

    const body: BodyType = {
        user_id: undefined,
        training_id: undefined,
        is_active: undefined,
    };

    body.user_id = user_id;
    body.training_id = training_id;
    body.is_active = is_active;

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/trainings/update-training-user`,
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
