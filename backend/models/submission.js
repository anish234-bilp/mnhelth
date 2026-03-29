const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    query: {
      type: String,
      required: [true, "Query is required"],
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);
const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;
