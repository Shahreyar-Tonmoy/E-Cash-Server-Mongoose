import express from "express";
import { Deposit, User } from "../models/User.model.js";
const deposit = express.Router();


// Route to create a new deposit
deposit.post('/agent/deposits', async (req, res) => {
    try {
      const { agentId, depositAmount } = req.body;
  
      const newDeposit = new Deposit({
        agentId: agentId,
        depositAmount: depositAmount
      });
  
      const savedDeposit = await newDeposit.save();
      res.status(201).json({ message: 'Deposit created successfully', deposit: savedDeposit });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  deposit.get('/api/agent/deposits', async (req, res) => {
    try {
      // Find deposits and populate the 'agentId' field with data from the 'User' model
      const deposits = await Deposit.find({ status: 'pending' }).populate('agentId').sort({ createdAt: -1 });
  
      if (!deposits || deposits.length === 0) {
        return res.status(404).json({ error: 'Deposits not found' });
      }
  
      
      res.json(deposits);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  deposit.get('/api/get/agent/deposits/:id', async (req, res) => {
    try {
      const agentId = req.params.id;
  
      const deposit = await Deposit.find({agentId}).sort({ createdAt: -1 })
  
      if (!deposit) {
        return res.status(404).json({ error: 'Deposit not found' });
      }
  console.log(deposit);
      res.json(deposit);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  // Route to update deposit status

deposit.post('/deposits/:id/accept', async (req, res) => {
    try {
        const depositId = req.params.id;
        
        const updatedDeposit = await Deposit.findByIdAndUpdate(
            depositId,
            { $set: { status: 'accepted' } },
            { new: true }
        );

        // console.log(updatedDeposit);

        if (!updatedDeposit) {
            return res.status(404).json({ error: 'Deposit not found' });
        }

        // Now update the user's amount
        const user = await User.findById({_id:updatedDeposit.agentId}); // Assuming you have a userId field in Deposit model
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
       

        // Update the user's amount
        user.amount += req.body.Amount; // Assuming the deposit amount is sent in the request body

        // Save the updated user
        await user.save();

        res.json({ updatedDeposit, updatedUser: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



deposit.put('/deposits/:id/reject', async (req, res) => {
    try {
        const depositId = req.params.id;
        
        const updatedDeposit = await Deposit.findByIdAndUpdate(
            depositId,
            { $set: { status: 'rejected' } },
            { new: true }
        );

        if (!updatedDeposit) {
            return res.status(404).json({ error: 'Deposit not found' });
        }

        res.json(updatedDeposit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});







  export default deposit