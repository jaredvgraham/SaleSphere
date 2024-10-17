import mongoose, { Schema, model, models, Types } from "mongoose";

export interface IContact {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  linkedIn?: string;
}

const contactSchema = new Schema<IContact>({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  phone: { type: String, required: false },
  email: { type: String, required: false },
  linkedIn: { type: String, required: false },
});

const Contact = models.Contact || model<IContact>("Contact", contactSchema);

export default Contact;
