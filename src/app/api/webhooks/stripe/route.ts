import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import User from "@/models/userModel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  await connectDB();
  const payload = await req.text();
  const sig = req.headers.get("Stripe-Signature") as string;

  try {
    const event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Fetch line items for the session
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        {
          limit: 100,
        }
      );

      let productName = "";
      let amount = 0;
      for (const item of lineItems.data) {
        if (!item.price) return;

        const price = item.price as Stripe.Price;
        if (price.product && typeof price.product === "string") {
          const product = await stripe.products.retrieve(price.product);
          productName = product.name;
        }

        const quantity = item.quantity;
        amount = item.amount_total;

        console.log("Product Name", productName);
        console.log("Quantity", quantity);
        console.log("Amount", amount);
      }

      const email = session.customer_details?.email;

      console.log("Customer email: ", email);

      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({
          status: "error",
          message: "User not found",
        });
      }

      user.plan = productName;

      await user.save();
    }
    return NextResponse.json({ status: "success", event: event.type });

    //
  } catch (err: any) {
    console.log("Webhook Error", err.message);
    return NextResponse.json({ status: "error", message: err.message });
  }
}
//
