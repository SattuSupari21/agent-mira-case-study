import mongoose, { Schema, models } from "mongoose";

const UserPropertiesSchema = new Schema(
  {
    sessionId: { type: String, required: true },
    budget: Number,
    locations: [String],
    numberOfBedrooms: Number,
    numberOfBathrooms: Number,
    size_sqft: Number,
    amenities: [String],
  },
  { timestamps: true }
);

const UserProperties =
  models.UserProperties || mongoose.model("UserProperties", UserPropertiesSchema);

export default UserProperties;