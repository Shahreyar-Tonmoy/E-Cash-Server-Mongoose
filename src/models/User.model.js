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

const savingsTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["deposit", "withdraw"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const SavingsTransaction = mongoose.model(
  "SavingsTransaction",
  savingsTransactionSchema
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    dateOfBirth: {
      type: String,
      unique: false,
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
    savings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

const depositSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    depositAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Deposit = mongoose.model("Deposit", depositSchema);

const mainBalanceSchema = new mongoose.Schema(
  {
    mainBalance: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: "e-cash",
    },
    role: {
      type: String,
      default: "main",
    },
  },
  { timestamps: true }
);

const MainBalance = mongoose.model("MainBalance", mainBalanceSchema);

const profitSchema = new mongoose.Schema(
  {
    amounts: {
      type: Number,
      required: true,
    },
    updateType: {
      type: String,
      required: true,
      enum: ['increment', 'decrement'], // Add more types as needed
    },
    mainBalance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainBalance", 
    },
  },
  { timestamps: true }
);

const Profit = mongoose.model("Profit", profitSchema);

export { User, Transaction, SavingsTransaction, Deposit, MainBalance,Profit };
