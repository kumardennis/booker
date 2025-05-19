import {
  ConnInfo,
  Handler,
  serve,
} from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

import { handler as get_group_trainings } from "./get-group-trainings/handler.ts";
import { handler as update_training_user } from "./update-training-user/handler.ts";
import { handler as create_training_request } from "./create-join-training-request/handler.ts";
import { handler as delete_training_request } from "./delete-join-training-request/handler.ts";
import { handler as update_training_request } from "./update-join-training-request/handler.ts";

console.log("Setting up localdev");

const handlers = {
  "get-group-trainings": get_group_trainings,
  "update-training-user": update_training_user,
  "create-join-training-request": create_training_request,
  "delete-join-training-request": delete_training_request,
  "update-join-training-request": update_training_request,
} as unknown as Record<string, Handler>;

function localdevHandler(req: Request, connInfo: ConnInfo) {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("OK", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const urlParts = url.pathname.split("/");
  const handlerName = urlParts[urlParts.length - 1];
  const handler = handlers[handlerName];

  console.log(`${handlerName} ${req.url}`);
  try {
    return handler(req, connInfo);
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  }
}

serve(localdevHandler);
