import express from 'express';
import verifyTokenMiddleware from './../../middlewares/authMiddleware.js';
import { User } from '../../models/User.model.js'; 

const Verify = express.Router();

Verify.get("/user/admin/:email", verifyTokenMiddleware, async (req, res) => {
  const email = req.params.email;
  
  if (email !== req.decoded?.email) {
    return res.status(403).send({ message: "unauthorized access" });
  }
  const query = { email: email };
  const user = await User.findOne(query);

  let admin = false;
  if (user) {
    admin = user?.role === "admin";
  }


  res.send({ admin });
});

Verify.get("/user/agent/:email", verifyTokenMiddleware, async (req, res) => {
  const email = req.params.email;
  
  if (email !== req.decoded?.email) {
    return res.status(403).send({ message: "unauthorized access" });
  }
  const query = { email: email };
  const user = await User.findOne(query);

  let agent = false;
  if (user) {
    agent = user?.role === "agent";
  }

  res.send({ agent });
});

export default Verify;
