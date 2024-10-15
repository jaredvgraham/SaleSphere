import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Company from "@/models/companyModel";
import { addFavorite } from "@/services/mongo/addFavorite";
import { removeFavorite } from "@/services/mongo/removeFavorite";

export async function POST(req: NextRequest) {
  try {
    const { companyId } = await req.json();
    const resp = addFavorite(companyId);
    if (!resp) {
      return NextResponse.json(
        { error: "error adding favorite" },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "Added favorite" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "unable to add favorite" });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { companyId } = await req.json();
    const resp = await removeFavorite(companyId);
    if (!resp) {
      return NextResponse.json(
        { error: "Unable to remove favorite" },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "Favorite removed" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Unable to remove favorite" },
      { status: 500 }
    );
  }
}
