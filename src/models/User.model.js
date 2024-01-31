import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    // Define fields for the main transaction data
    amounts: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
    },

    fromRole: {
      type: String,
    },

    from: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    to: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    transactionId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phoneNumber: {
      type: String,
    },
    dateOfBirth: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "agent"],
      default: "user",
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export { User, Transaction };
