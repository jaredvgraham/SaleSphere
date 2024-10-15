import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import User, { IUser } from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { Document } from "mongoose";
import { connectDB } from "@/lib/db";
import { createRecurringPrice } from "@/utils/reacuringPrice";
interface IUserDocument extends IUser, Document {}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.split("/api")[0];

async function getOrCreateCustomerId(user: IUserDocument) {
  const customerId = user.customerId;
  if (!customerId) {
    console.log("Creating customer");

    const customer = await stripe.customers.create({
      email: user.email,
    });

    return customer.id;
  }

  return customerId;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    await connectDB();
    const user = (await User.findOne({ clerkId: userId })) as IUserDocument;

    const { plan } = await req.json();
    console.log("Plan", plan);

    if (user.plan === plan) {
      return NextResponse.json(
        { message: "User already subscribed to this plan" },
        { status: 400 }
      );
    }

    const recurringPrice = await createRecurringPrice(plan);
    if (recurringPrice === 0) {
      return NextResponse.json({ message: "Invalid plan" }, { status: 400 });
    }

    const recurringStripePrice = await stripe.prices.create({
      unit_amount: recurringPrice,
      currency: "usd",
      recurring: {
        interval: "month",
      },
      metadata: {
        type: "indefinite",
      },
      product_data: {
        name: plan,
      },
    });

    // get or create customer Id
    const customerId = await getOrCreateCustomerId(user);
    console.log("Customer ID", customerId);

    user.customerId = customerId;

    await user.save();

    console.log("user.customerId", user.customerId);

    // Create a checkout session for the purchase
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [
        {
          price: recurringStripePrice.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${BASE_URL}/dashboard`,
      cancel_url: `${BASE_URL}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = auth();
    await connectDB();
    const user = (await User.findOne({ clerkId: userId })) as IUserDocument;

    const { newPlan } = await req.json();
    console.log("New Plan", newPlan);

    if (user.plan === newPlan) {
      return NextResponse.json(
        { message: "User already subscribed to this plan" },
        { status: 400 }
      );
    }

    const recurringPrice = await createRecurringPrice(newPlan);

    if (recurringPrice === 0) {
      return NextResponse.json({ message: "Invalid plan" }, { status: 400 });
    }

    const recurringStripePrice = await stripe.prices.create({
      unit_amount: recurringPrice,
      currency: "usd",
      recurring: {
        interval: "month",
      },
      metadata: {
        type: "indefinite",
      },
      product_data: {
        name: newPlan,
      },
    });

    // get or create customer Id
    const customerId = await getOrCreateCustomerId(user);
    console.log("Customer ID", customerId);

    // Create a checkout session for the purchase

    const subscription = await stripe.subscriptions.retrieve(
      user.subscriptionId as string
    );
    console.log("Subscription", subscription);

    const updatedSubscription = await stripe.subscriptions.update(
      user.subscriptionId as string,
      {
        cancel_at_period_end: false,
        items: [
          {
            id: subscription.items.data[0].id,
            price: recurringStripePrice.id,
          },
        ],
        proration_behavior: "create_prorations",
      }
    );

    console.log("Updated Subscription", updatedSubscription);

    user.plan = newPlan;
    await user.save();

    return NextResponse.json({ status: 200, message: "Subscription updated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
