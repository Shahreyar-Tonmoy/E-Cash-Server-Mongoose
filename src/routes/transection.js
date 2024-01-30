// routes/transaction.js
import express from "express";
import { Transaction } from "./../medels/User.model.js";
import { startOfWeek, addWeeks } from 'date-fns';
const transaction = express.Router();

transaction.post("/transaction", async (req, res) => {
  try {
    const transaction = req.body;

    const newTransaction = new Transaction(transaction);
    // Save the new transaction to the database
    const result = await newTransaction.save();

    res.send(result);
  } catch (error) {
    console.error("Error adding transaction", error);
    res.status(500).send("Internal server error");
  }
});

transaction.get("/get/transaction", async (req, res) => {
  try {
    // Logic to retrieve all users
    const users = await Transaction.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

transaction.get("/get/agent/transaction/:from", async (req, res) => {
  try {
    const from = req.params.from;
    const transaction = await Transaction.find({
      from: from,
    }).populate("to");

    if (!transaction) {
      return res.status(404).send("Transaction not found");
    }

    res.send(transaction);
  } catch (error) {
    console.error("Error getting Transaction");
    res.status(500).send("Internal server error");
  }
});

transaction.get("/get/users/transaction/:from", async (req, res) => {
  try {
    const to = req.params.from;
    const transaction = await Transaction.find({
      to: to,
    }).populate("from");

    if (!transaction) {
      return res.status(404).send("Transaction not found");
    }

    res.send(transaction);
  } catch (error) {
    console.error("Error getting Transaction");
    res.status(500).send("Internal server error");
  }
});

// get total amount transaction

transaction.get("/get/total/transaction", async (req, res) => {
  try {
    // Logic to retrieve all transactions
    const transactions = await Transaction.find();

    // Calculate the total amount
    const totalAmount = transactions.reduce((total, transaction) => {
      return total + transaction.amounts;
    }, 0);

    res.status(200).json({
      totalAmount: totalAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get transaction by month

transaction.get("/get/month/transaction", async (req, res) => {
  try {
    // Logic to retrieve total amount by month
    const result = await Transaction.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" }, // Assuming you have a createdAt field in your schema
          totalAmount: { $sum: "$amounts" },
        },
      },
      {
        $project: {
          month: "$_id",
          totalAmount: 1,
          _id: 0,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get transaction by weak


transaction.get("/get/weak/transaction", async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Calculate the start of the current week
    const startOfCurrentWeek = startOfWeek(currentDate);

    // Logic to retrieve total amount for the current week
    const result = await Transaction.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfCurrentWeek,
            $lt: addWeeks(startOfCurrentWeek, 1),
          }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amounts" },
        },
      },
      {
        $project: {
          totalAmount: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(result[0]); // Assuming you want to return a single object instead of an array
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// get previous month and now month amount deference of percentage


transaction.get("/get/percentage/transaction", async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Calculate the date for the first day of the current month
    const firstDayOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // Calculate the date for the first day of the previous month
    const firstDayOfPreviousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );

    // Logic to retrieve total amount for the current month
    const currentMonthResult = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: firstDayOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amounts" },
        },
      },
    ]);

    // Logic to retrieve total amount for the previous month
    const previousMonthResult = await Transaction.aggregate([
      {
        $match: {
          createdAt: {
            $gte: firstDayOfPreviousMonth,
            $lt: firstDayOfCurrentMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amounts" },
        },
      },
    ]);

    // Calculate percentage difference
    let percentageDifference = 0;
    if (currentMonthResult.length > 0 && previousMonthResult.length > 0) {
      const currentMonthTotal = currentMonthResult[0].totalAmount;
      const previousMonthTotal = previousMonthResult[0].totalAmount;

      percentageDifference =
        ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
    }

    res.status(200).json({ percentageDifference: percentageDifference });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default transaction;
