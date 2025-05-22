import { User } from "../models/user.js";

export const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    const user = await User.findOne({ clerkId: id });
    if (!user) {
      await User.create({
        firstName,
        lastName,
        imageUrl: imageUrl,
        clerkId: id,
      });
      return res.status(201).json({ message: "User created successfully" });
    }
  } catch (error) {
    console.error("Error in authCallback:", error);
    next(error);
  }
};
