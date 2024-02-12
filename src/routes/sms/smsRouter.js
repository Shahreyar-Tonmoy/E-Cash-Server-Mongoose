import express from "express";
import axios from "axios";

const smsRouter = express.Router();

smsRouter.post("/send/sender", async (req, res) => {
  try {
    const apiURL = "http://bulksmsbd.net/api/smsapi";
    const apiKey = "pSJy83M0KXWAOHwZ4hQJ";
    const senderID = "8809617615463";

    const { message, senderNumber } = req.body;

    const number = `88${senderNumber}`;
    const messages = message;

    if (!number || !message) {
      return res
        .status(400)
        .json({ error: "Invalid request. Numbers and message are required." });
    }
    
    const params = {
      api_key: apiKey,
      senderid: senderID,
      type: "text",
      number: number,
      message: messages,
    };

    const response = await axios.post(apiURL, params);

    res.json({ status: "SMS sent successfully", response: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send SMS" });
  }
});

smsRouter.post("/send/receiver", async (req, res) => {
  try {
    const apiURL = "http://bulksmsbd.net/api/smsapi";
    const apiKey = "pSJy83M0KXWAOHwZ4hQJ";
    const senderID = "8809617615463";

    const { receiverNumber, messageReceiver } = req.body;

    const number = `88${receiverNumber}`;
    const messages = messageReceiver;

    if (!number || !messageReceiver) {
      return res
        .status(400)
        .json({ error: "Invalid request. Numbers and message are required." });
    }

    const params = {
      api_key: apiKey,
      senderid: senderID,
      type: "text",
      number: number,
      message: messages,
    };

    // Make a POST request using axios
    const response = await axios.post(apiURL, params);

    res.json({ status: "SMS sent successfully", response: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send SMS" });
  }
});

export default smsRouter;
