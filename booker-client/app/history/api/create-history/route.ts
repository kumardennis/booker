import { EventType } from "@/app/types";
import { headers } from "next/headers";
import { type NextRequest } from "next/server";

type BodyType = {
    training_id: string | undefined;
    group_id: string | undefined;
    from_id: string | undefined;
    to_id: string | undefined;
    event: string;
    event_type: EventType;
};

export async function POST(request: NextRequest) {
    const requestData = request.body ? await request.json() : {};

    const {
        group_id,
        training_id,
        from_id,
        to_id,
        event,
        event_type,
    } = requestData;

    const headersList = await headers();
    const auth = headersList.get("Authorization");

    const body: BodyType = {
        training_id: undefined,
        group_id: undefined,
        from_id: undefined,
        to_id: undefined,
        event: event ?? "",
        event_type: event_type ?? "",
    };

    body.training_id = training_id;
    body.group_id = group_id;
    body.from_id = from_id;
    body.to_id = to_id;
    body.event = event;
    body.event_type = event_type;
    if (!body.event || !body.event_type) {
        return Response.json({
            isRequestSuccessfull: false,
            error: "Event and event_type are required",
        });
    }

    const response = await fetch(
        "http://127.0.0.1:54321/functions/v1/history/create-history",
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
