import connectDB from "./db/index.js";
import { app } from "./app.js";
import router from "./routes/user.js";
import { jwtRouter } from "./routes/auth.js";
import transaction from "./routes/transection.js";
import Verify from "././routes/Verify/Varify.js";
import deposit from "./routes/deposit.js";
import smsRouter from "./routes/sms/smsRouter.js";
import mainBalance from "./routes/MainBalance/mainBalance.js";





const startServer = (port) => {
  return app.listen(port);
};

const tryStartServer = (port) => {
  const server = startServer(port);
  server.on("listening", () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} is already in use. Trying a different port...`);
      tryStartServer(port + 1); // Try the next port
    } else {
      console.error("Error starting the server:", err);
      process.exit(1);
    }
  });
};

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {

   
    // jwt token
    
 
    app.use(smsRouter);
    app.use(jwtRouter);
    // verify
    app.use(Verify);

    // get & post all user
    app.use(router);
    app.use(mainBalance);
    app.use(deposit);
    // transction
    app.use(transaction);
    // end router call
    app.get("/", (req, res) => {
      res.send(`Server is running at http://localhost:${PORT}`);
    });

    tryStartServer(PORT);
  })
  .catch((err) => {
    console.log("Failed to start the server:", err);
  });
