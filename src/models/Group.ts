import mongoose, { Schema } from "mongoose";
import { IGroup } from "../types/Group.types";

const GroupSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

export default mongoose.model<IGroup>("Group", GroupSchema);
