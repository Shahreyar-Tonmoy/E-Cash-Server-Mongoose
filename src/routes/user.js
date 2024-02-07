import express from "express";
import { SavingsTransaction, User } from "../models/User.model.js";
import verifyTokenMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET route to retrieve all users
router.get("/users", async (req, res) => {
  try {
    // Logic to retrieve all users
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET route to retrieve one users
router.get("/users/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;

    // Logic to retrieve a user based on email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST route to create a new user
router.post("/add/users", async (req, res) => {
  try {
    const userData = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists", insertedId: null });
    }

    // Create a new user using the User model
    const newUser = new User(userData);

    // Save the new user to the database
    await newUser.save();

    // Respond with a success message and the created user object
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// user count

router.get("/api/user/count", async (req, res) => {
  try {
    // Assuming 'user' is the role you are interested in
    const count = await User.countDocuments({ role: 'user' });

    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

// update

router.put("/users/update/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const filter = { email: email };
    const options = { upsert: true };
    const updatedUser = req.body;
    console.log(updatedUser);
    const updates = {
      $set: {
        name: updatedUser.name,
        phoneNumber: updatedUser.phoneNumber,
        image: updatedUser.image,
        dateOfBirth: updatedUser.dateOfBirth,
      },
    };

    const result = await User.updateOne(filter, updates, options);
    console.log(result);

    res.status(201).json({ message: "User Update successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// user phonenumber

router.get("/usersNumber/:phoneNumber", async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;
    const role = "user";

    const user = await User.findOne({ phoneNumber, role: role });

    if (!user) {
      return res.status(404).send({ error: "Number not found" });
    }

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// update amount

router.put("/usersNumber/:phoneNumber", async (req, res) => {
  const phoneNumber = req.params.phoneNumber;
  const filter = { phoneNumber: phoneNumber };
  const options = { upsert: true };
  const UpdateProduct = req.body;
  const Updates = {
    $set: {
      amount: UpdateProduct.Amount,
    },
  };
  const result = await User.updateOne(filter, Updates, options);

  res.send(result);
});

router.put("/myAmount/:phoneNumber", async (req, res) => {
  const phoneNumber = req.params.phoneNumber;
  const filter = { phoneNumber: phoneNumber };
  const options = { upsert: true };
  const UpdateProduct = req.body;

  const Updates = {
    $set: {
      amount: UpdateProduct.myAmount,
    },
  };
  const result = await User.updateOne(filter, Updates, options);

  res.send(result);
});

// agent check
router.get("/agentNumber/:phoneNumber", async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;

    const role = "agent";
    const user = await User.findOne({ phoneNumber, role: role });

    if (!user) {
      return res.status(404).send({ error: "Number not found" });
    }

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});


// add savings

router.post("/api/savings/:phoneNumber", async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;
    const { saving } = req.body;

    const user = await User.findOne({ phoneNumber: phoneNumber });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAmount = parseInt(user.amount) - parseInt(saving);
    user.amount = newAmount;

    let newSavingsAmount = user.savings;

    if (parseInt(saving) > 0) {
      newSavingsAmount += parseInt(saving);
      user.savings = newSavingsAmount;
      await user.save();

      // Create a new savings transaction record for deposit
      const depositTransaction = new SavingsTransaction({
        userId: user._id,
        type: 'deposit',
        amount: parseInt(saving),
      });
      await depositTransaction.save();

      console.log("Savings increased by:", saving);
    }

    await user.save();
    console.log("New Amount:", newAmount);

    return res.json({ message: 'Amount and Savings updated successfully', newAmount, newSavingsAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// withdraw


router.post("/api/withdraw/:phoneNumber", async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;
    const { saving } = req.body;

    const user = await User.findOne({ phoneNumber: phoneNumber });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAmount = parseInt(user.amount) + parseInt(saving);
    user.amount = newAmount;

    let newSavingsAmount = user.savings;

    if (parseInt(saving) > 0) {
      newSavingsAmount -= parseInt(saving);
      user.savings = newSavingsAmount;
      await user.save();

      // Create a new savings transaction record for withdrawal
      const withdrawTransaction = new SavingsTransaction({
        userId: user._id,
        type: 'withdraw',
        amount: parseInt(saving),
      });
      await withdrawTransaction.save();

      console.log("Savings decreased by:", saving);
    }

    await user.save();
    console.log("New Amount:", newAmount);

    return res.json({ message: 'Amount and Savings updated successfully', newAmount, newSavingsAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// savings history
router.get('/transaction/savings/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const savingsTransactions = await SavingsTransaction
      .find({ userId: user?._id })
      .sort({ date: -1 }); // Sort by date in descending order (most recent first)

    res.json({ user, savingsTransactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});







export default router;
