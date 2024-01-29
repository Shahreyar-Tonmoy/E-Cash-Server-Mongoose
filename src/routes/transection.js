// routes/transaction.js
import express from "express";
import { Transaction } from "./../medels/User.model.js";

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



export default transaction;
