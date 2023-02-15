import mongoose from "mongoose";

const QuestionSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
const Question = mongoose.model("Question", QuestionSchema);

export default Question;
