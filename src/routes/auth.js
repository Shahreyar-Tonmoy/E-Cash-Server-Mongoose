import express from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();



const jwtRouter = express.Router();

jwtRouter.post("/jwt", async (req, res) => {
  try {
    const user = req.body;

    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "24h",
    });
    res.send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});



export { jwtRouter };
