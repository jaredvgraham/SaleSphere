import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    console.log("userId from post", userId);

    const { company: companyName } = await req.json();
    if (!companyName) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }
    // Placeholder for fetching/scraping company data for similarities to other companies
    return NextResponse.json({ companyName }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, message: error });
  }
}

// export async function GET(req: NextRequest) {
//   const { userId } = auth();
//   console.log("userId", userId);
//   return NextResponse.json({ userId }, { status: 200 });
// }
