import express from "express";
import { MainBalance, Profit } from "../../models/User.model.js";

const mainBalance = express.Router();

// mainBalance.post("/api/mainBalance", async (req, res) => {
//     try {
//       const mainBalance = req.body;
  
//       const newMainBalance = new MainBalance(mainBalance);
//       // Save the new transaction to the database
//       const result = await newMainBalance.save();
  
//       res.send(result);
//     } catch (error) {
//       console.error("Error adding transaction", error);
//       res.status(500).send("Internal server error");
//     }
//   });


  mainBalance.get("/get/mainBalance", async (req, res) => {
    try {
      // Logic to retrieve all users
      const mainBalance = await MainBalance.find();
      res.status(200).json(mainBalance);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


  mainBalance.put('/update-main-balance', async (req, res) => {
    try {
      // Extract the updated balance from the request body
      const { mainBalance: mainBalanceChange } = req.body;
  
      // Set the default value for updateType to 'increment'
      const updateType = 'increment';
  
      // Validate the input
      if (typeof mainBalanceChange !== 'number') {
        return res.status(400).json({ message: 'Invalid input for main balance' });
      }
  
      // Find the existing main balance document
      const existingMainBalance = await MainBalance.findOne({ role: 'main', name: 'e-cash' });
  
      if (!existingMainBalance) {
        return res.status(404).send('Main Balance is not found');
      }
  
      // Increment the existing main balance
      existingMainBalance.mainBalance += mainBalanceChange;
  
      // Save the updated main balance
      await existingMainBalance.save();
  
      // Create a new profit document
      const newProfit = new Profit({
        amounts: mainBalanceChange,
        updateType,
        mainBalance: existingMainBalance._id,
      });
  
      // Save the profit data
      await newProfit.save();
  
      // Respond with the updated main balance
      return res.status(200).json(existingMainBalance);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  




export default mainBalance