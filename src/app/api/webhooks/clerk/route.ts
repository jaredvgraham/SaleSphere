import { clerkClient } from "@clerk/nextjs/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { NextResponse } from "next/server";
import { createUser } from "@/actions/user.actions";
import { log } from "console";

export async function POST(req: Request) {
  //   const event = await clerkClient.webhooks.readEvent(req);
  //   if (event.eventType === WebhookEvent.UserCreated) {
  //     const user = event.data.user;
  //     await createUser(user);
  //   }
  //   return new Response("OK", { status: 200 });
  // }

  log("at webhook");
}
