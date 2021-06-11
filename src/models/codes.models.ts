import mongoose, { Schema, model } from 'mongoose';

export interface CodesInterface extends mongoose.Document {
  email: string;
  code: string;
  created: number;
  expiration: number;
}

const CodesSchema = new Schema(
  {
    email: { type: String, required: true },
    code: { type: String, required: true },
    created: { type: Number, required: true },
    expiration: { type: Number, required: true },
  },
  { versionKey: false }
);

export default model<CodesInterface>('codes', CodesSchema);
