import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["follow", "like", "comment"],
    },
    message:{
        type:String,
        required:true,
    }
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;