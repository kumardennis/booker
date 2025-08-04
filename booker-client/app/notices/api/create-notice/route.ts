import { EventType } from "@/app/types";
import { headers } from "next/headers";
import { type NextRequest } from "next/server";

type BodyType = {
    training_id: string | undefined;
    group_id: string | undefined;
    user_id: string | undefined;
    notice: string;
};

export async function POST(request: NextRequest) {
    const requestData = request.body ? await request.json() : {};

    const {
        group_id,
        training_id,
        from_id,
        user_id,
        notice,
    } = requestData;

    const headersList = await headers();
    const auth = headersList.get("Authorization");

    const body: BodyType = {
        training_id: undefined,
        group_id: undefined,
        user_id: undefined,
        notice: notice ?? "",
    };

    body.training_id = training_id;
    body.group_id = group_id;
    body.user_id = user_id;
    body.notice = notice;

    if (!body.notice) {
        return Response.json({
            isRequestSuccessfull: false,
            error: "Notice are required",
        });
    }

    const response = await fetch(
        "http://127.0.0.1:54321/functions/v1/notices/create-notice",
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
