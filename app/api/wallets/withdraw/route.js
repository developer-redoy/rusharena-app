import mongoose from "mongoose";
import { connectDB } from "@/lib/connectDB";
import User from "@/models/user";
import { z } from "zod";
import { catchError, response } from "@/lib/healperFunc";
import Withdraw from "@/models/withdrawSchema";
import Transactions from "@/models/transection";

// ✅ Zod schema
const zwithdrawSchema = z.object({
  receiverPhone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid phone number!"),
  amount: z.number().min(65, "Minimum withdrawal amount is 65!"),
  method: z.enum(["Bkash", "Nagad"]),
  userId: z.string().min(1, "UserId is required"),
});

export async function POST(req) {
  const session = await mongoose.startSession();

  try {
    await connectDB();

    const body = await req.json();
    const { method, userId, receiverPhone, amount } = body;

    // ✅ Validate input
    const validation = zwithdrawSchema.safeParse({
      method,
      userId,
      receiverPhone,
      amount,
    });

    if (!validation.success) {
      return response(false, 400, validation.error.errors[0].message);
    }

    // 🟡 Start transaction
    session.startTransaction();

    // ✅ Find user inside transaction
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return response(false, 404, "User not found");
    }

    // ❗ Check today's withdraw (start & end of day)
    // const startOfDay = new Date();
    // startOfDay.setHours(0, 0, 0, 0);

    // const endOfDay = new Date();
    // endOfDay.setHours(23, 59, 59, 999);

    // const withdrawCount = await Withdraw.countDocuments({
    //   userId: user._id,
    //   createdAt: { $gte: startOfDay, $lte: endOfDay },
    // }).session(session);

    // const transactionCount = await Transactions.countDocuments({
    //   userId: user._id,
    //   createdAt: { $gte: startOfDay, $lte: endOfDay },
    // }).session(session);

    // if (withdrawCount + transactionCount >= 2) {
    //   await session.abortTransaction();
    //   return response(false, 400, "Your withdrawal limit reached for today");
    // }
    // ❗ Safe balance deduction (atomic check)
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        winbalance: { $gte: amount },
      },
      { $inc: { winbalance: -amount } },
      { new: true, session },
    );

    if (!updatedUser) {
      await session.abortTransaction();
      return response(false, 400, "Insufficient winning balance");
    }

    // ✅ Create withdraw request
    const newWithdraw = await Withdraw.create(
      [
        {
          userId: user._id,
          method,
          phone: receiverPhone,
          amount,
          status: "pending",
        },
      ],
      { session },
    );

    if (!newWithdraw) {
      await session.abortTransaction();
      return response(false, 500, "Failed to create withdrawal");
    }

    // ✅ Commit transaction
    await session.commitTransaction();
    session.endSession();

    return response(true, 200, "Withdrawal request submitted!");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    return catchError(err);
  }
}
