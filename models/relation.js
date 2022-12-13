import mongoose, { Schema } from "mongoose";

const relationSchema = new mongoose.Schema({
  ids: {
    type: Array,
    dafault: [],
  },
  dates: {
    type: Array,
    default: [],
  },
  c_time: { type: Date, default: Date.now },
  u_time: { type: Date, default: Date.now },
});

const RelationModel =
  mongoose.models.Relation || mongoose.model("Relation", relationSchema);
export default RelationModel;
