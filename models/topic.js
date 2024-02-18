import mongoose, { Schema } from "mongoose";

const topicSchema = new Schema(
  {
    name: String,
    canvasFile: String,
  },
  {
    timestamps: true,
  }
);

const Topic = mongoose.models.Topic || mongoose.model("Topic", topicSchema);

export default Topic;
