import mongoose from "mongoose";

export const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company is required."],
      trim: true,
      maxlength: [100, "Company must be 100 characters or fewer."],
    },
    role: {
      type: String,
      required: [true, "Role is required."],
      trim: true,
      maxlength: [100, "Role must be 100 characters or fewer."],
    },
    status: {
      type: String,
      enum: {
        values: STATUSES,
        message: "Status must be Applied, Interview, Offer or Rejected.",
      },
      default: "Applied",
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    jobUrl: {
      type: String,
      trim: true,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes must be 1000 characters or fewer."],
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;