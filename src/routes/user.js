import express from "express";
import { User } from "../models/User.model.js";
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
router.post('/users', async (req, res) => {
  try {
    const user = req.body;

    // Validate that the required fields are present
    if (!user || !user.email || !user.name) {
      return res.status(400).json({ message: 'Name and email are required', insertedId: null });
    }

    const existingUser = await User.findOne({ name: user.name });

    if (existingUser) {
      return res.status(400).json({ message: 'User with the same name already exists Change Your Name', insertedId: null });
    } else {
      const newUser = new User(user);

      // Handle null dateOfBirth
      if (newUser.dateOfBirth === null || newUser.dateOfBirth === undefined) {
        // Set a default value or handle as per your requirements
        newUser.dateOfBirth = 'N/A';
      }

      await newUser.save();

      console.log(newUser);

      res.status(201).json({ message: 'User created successfully' });
    }
  } catch (error) {
    console.log(error);

    if (error.code === 11000 && error.keyPattern && error.keyValue) {
      // Duplicate key error
      return res.status(400).json({ message: `Duplicate key error for key: ${JSON.stringify(error.keyValue)}`, insertedId: null });
    }

    // Handle other errors if needed
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

export default router;
