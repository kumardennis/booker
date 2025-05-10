import {
  ConnInfo,
  Handler,
  serve,
} from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

import { handler as get_club_groups } from "./get-club-groups/handler.ts";
import { handler as update_club_groups_user } from "./update-club-groups-user/handler.ts";
import { handler as create_join_group_request } from "./create-join-group-request/handler.ts";

console.log("Setting up localdev");

const handlers = {
  "get-club-groups": get_club_groups,
  "update-club-groups-user": update_club_groups_user,
  "create-join-group-request": create_join_group_request,
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
