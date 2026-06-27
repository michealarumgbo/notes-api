import mongoose, { Schema } from "mongoose";

const refreshTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
export default RefreshToken;
