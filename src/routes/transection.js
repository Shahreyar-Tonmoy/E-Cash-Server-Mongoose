// routes/transaction.js
import express from "express";
import { Transaction } from "./../models/User.model.js";
import { startOfWeek, addWeeks } from "date-fns";
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

// get only cash in todays agent transaction



transaction.get("/get/today/agentcashin/transaction/:from", async (req, res) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    console.log(req.params.from);

    const todayAgentTransactions = await Transaction.find({
      createdAt: {
        $gte: currentDate,
        $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
      },
      fromRole: 'agent',
      from: req.params.from, 
    });





    const totalAmountTodayByAgents = todayAgentTransactions.reduce((total, transaction) => {
      return total + transaction.amounts;
    }, 0);

    res.status(200).json({
      totalAmountTodayByAgents: totalAmountTodayByAgents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get only cash out todays agent transaction

transaction.get("/get/today/agentcashout/transaction/:to", async (req, res) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    console.log(req.params.from);

    const todayAgentTransactions = await Transaction.find({
      createdAt: {
        $gte: currentDate,
        $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
      },
      fromRole: 'user',
      to: req.params.to, 
    });





    const totalAmountTodayByAgents = todayAgentTransactions.reduce((total, transaction) => {
      return total + transaction.amounts;
    }, 0);

    res.status(200).json({
      totalAmountTodayByAgents: totalAmountTodayByAgents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});









// get transaction by month

transaction.get('/get/month/transaction', async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          totalAmount: { $sum: '$amounts' },
        },
      },
      {
        $project: {
          month: '$_id.month',
          year: '$_id.year',
          totalAmount: 1,
          _id: 0,
        },
      },
      {
        $addFields: {
          monthNames: [
            null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
          ],
        },
      },
      {
        $addFields: {
          monthName: {
            $arrayElemAt: [
              '$monthNames',
              '$month',
            ],
          },
        },
      },
      {
        $project: {
          month: 1,
          monthName: 1,
          totalAmount: 1,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);



    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
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
          },
        },
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


// transaction.get("/get/percentage/transaction", async (req, res) => {
//   try {
//     // Get the current date
//     const currentDate = new Date();

//     // Calculate the date for the first day of the current month
//     const firstDayOfCurrentMonth = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       1
//     );

//     // Calculate the date for the first day of the previous month
//     const firstDayOfPreviousMonth = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth() - 1,
//       1
//     );

//     // Logic to retrieve total amount for the current month
//     const currentMonthResult = await Transaction.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: firstDayOfCurrentMonth },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalAmount: { $sum: "$amounts" },
//         },
//       },
//     ]);

//     // Logic to retrieve total amount for the previous month
//     const previousMonthResult = await Transaction.aggregate([
//       {
//         $match: {
//           createdAt: {
//             $gte: firstDayOfPreviousMonth,
//             $lt: firstDayOfCurrentMonth,
//           },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalAmount: { $sum: "$amounts" },
//         },
//       },
//     ]);

//     // Extract currentMonthTotal and previousMonthTotal
//     const currentMonthTotal =
//       currentMonthResult.length > 0 ? currentMonthResult[0].totalAmount : 0;
//     const previousMonthTotal =
//       previousMonthResult.length > 0 ? previousMonthResult[0].totalAmount : 0;

//     // Calculate percentage difference
//     const percentageDifference =
//       previousMonthTotal !== 0
//         ? ((currentMonthTotal - previousMonthTotal) /
//             (previousMonthTotal + currentMonthTotal)) *
//           100
//         : 0;

//     console.log(currentMonthTotal, previousMonthTotal, percentageDifference);

//     res.status(200).json({
//       percentageDifference,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// transaction.get('/get/percentage/transaction', async (req, res) => {
//   try {
//     const result = await Transaction.aggregate([
//       {
//         $group: {
//           _id: {
//             month: { $month: '$createdAt' },
//             year: { $year: '$createdAt' },
//           },
//           totalAmount: { $sum: '$amounts' },
//         },
//       },
//       {
//         $project: {
//           month: '$_id.month',
//           year: '$_id.year',
//           totalAmount: 1,
//           _id: 0,
//         },
//       },
//       {
//         $addFields: {
//           monthNames: [
//             null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
//           ],
//         },
//       },
//       {
//         $addFields: {
//           monthName: {
//             $arrayElemAt: [
//               '$monthNames',
//               '$month',
//             ],
//           },
//         },
//       },
//       {
//         $project: {
//           month: 1,
//           monthName: 1,
//           totalAmount: 1,
//         },
//       },
//       {
//         $sort: { month: 1 },
//       },
//       {
//         $group: {
//           _id: null,
//           monthlyData: { $push: '$$ROOT' },
//           totalAmount: { $sum: '$totalAmount' },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           totalAmount: 1,
//           monthlyData: {
//             $map: {
//               input: '$monthlyData',
//               as: 'item',
//               in: {
//                 month: '$$item.month',
//                 monthName: '$$item.monthName',
//                 totalAmount: '$$item.totalAmount',
//                 percentageDifference: {
//                   $cond: {
//                     if: { $eq: ['$totalAmount', 0] },
//                     then: 0,
//                     else: {
//                       $multiply: [
//                         {
//                           $divide: [
//                             { $subtract: ['$totalAmount', '$$item.totalAmount'] },
//                             '$totalAmount',
//                           ],
//                         },
//                         100,
//                       ],
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     ]);

//     console.log('Aggregation Result:', result);

//     res.status(200).json(result[0] ? result[0].monthlyData : []);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

transaction.get("/get/daily/totalAmount", async (req, res) => {
  try {
    const currentDate = new Date();

    const result = await Transaction.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalAmount: { $sum: "$amounts" },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
            },
          },
          totalAmount: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});








export default transaction;
