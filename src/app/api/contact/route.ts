import { connectDB } from "@/lib/db";
import Company from "@/models/companyModel";
import Contact from "@/models/contactModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { newContact, companyId } = await req.json();
  const { firstName, lastName, phone, email, linkedIn } = newContact;
  if (!newContact) {
    return NextResponse.json(
      { error: "error parsing request body" },
      { status: 400 }
    );
  }
  try {
    await connectDB();
    const company = await Company.findOne({ _id: companyId });
    if (!company) {
      return NextResponse.json(
        { error: "Company not found in DB" },
        { status: 404 }
      );
    }
    const contact = new Contact({
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      linkedIn: linkedIn,
    });
    await contact.save();
    company.contacts.push(contact._id);
    await company.save();
    return NextResponse.json(
      { message: "Contact saved successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Something went wron" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { companyId: string } }
) {
  const { companyId } = params;
  if (!companyId) {
    return NextResponse.json(
      { error: "Missing companyId parameter" },
      { status: 400 }
    );
  }
  try {
    await connectDB();
    const company = await Company.findOne({ _id: companyId });
    if (!company) {
      return NextResponse.json(
        { error: "No company with ID found in database" },
        { status: 404 }
      );
    }
    const contacts = await Contact.find({ _id: { $_in: company.contacts } });
    if (contacts.length === 0) {
      return NextResponse.json({ error: "No contacts found" }, { status: 404 });
    }
    return NextResponse.json({ contacts }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: `Something went wrong, ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { companyId, contactId } = await req.json();
  if (!companyId) {
    return NextResponse.json(
      { error: "Bad request, no companyId" },
      { status: 400 }
    );
  }
  try {
    await connectDB();
    const company = await Company.findOne({ _id: companyId });
    if (!company) {
      return NextResponse.json(
        { error: "No company found for ID" },
        { status: 404 }
      );
    }
    company.contacts = company.contacts.filter(
      (contact: string) => contact.toString() !== contactId
    );
    await company.save();

    const deletedContact = await Contact.findByIdAndDelete(contactId);
    if (!deletedContact) {
      return NextResponse.json(
        { error: "No contact found with ID" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Contact deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: `Something went wrong, ${error.message}` },
      { status: 500 }
    );
  }
}
