import mongoose, { Schema, model } from 'mongoose';
import moment from 'moment';

export interface HistoryInterface extends mongoose.Document {
  email: string;
  log: string;
  created: number;
}

const HistorySchema = new Schema(
  {
    email: { type: String, required: true },
    log: { type: String, required: true },
    created: { type: Number, default: moment() }, // default epoch
  },
  { versionKey: false }
);

export default model<HistoryInterface>('history', HistorySchema);
