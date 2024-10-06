import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Company from "@/models/companyModel";
import { addFavorite } from "@/services/mongo/addFavorite";
import { removeFavorite } from "@/services/mongo/removeFavorite";

export async function POST(req: NextRequest) {
  // try {
  //   const { companyId } = await req.json();
  //   await connectDB();
  //   if (!companyId) {
  //     return NextResponse.json(
  //       { error: "Company ID is required" },
  //       { status: 400 }
  //     );
  //   }
  //   const company = await Company.findOne({ _id: companyId });
  //   if (!company) {
  //     return NextResponse.json({ error: "Company not found" }, { status: 404 });
  //   }
  //   company.favorite = true;
  //   company.markModified("favorite");
  //   await company.save();
  //   return NextResponse.json({ message: "Favorite added" }, { status: 200 });
  // } catch (error: any) {
  //   console.error(error);
  //   return NextResponse.json(
  //     { error: "Failed to add favorite" },
  //     { status: 500 }
  //   );
  // }
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
  // const { companyId } = await req.json();

  // try {
  //   await connectDB();
  //   if (!companyId) {
  //     return NextResponse.json(
  //       { error: "Company ID is required" },
  //       { status: 400 }
  //     );
  //   }
  //   const company = await Company.findOne({ _id: companyId });
  //   if (!company) {
  //     return NextResponse.json({ error: "Company not found" }, { status: 404 });
  //   }
  //   company.favorite = false;
  //   await company.save();
  //   return NextResponse.json({ message: "Favorite removed" }, { status: 200 });
  // } catch (error: any) {
  //   console.error(error);
  //   return NextResponse.json(
  //     { error: "Failed to remove favorite" },
  //     { status: 500 }
  //   );
  // }
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
