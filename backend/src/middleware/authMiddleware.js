import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - please log in" });
    }

    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - please log in" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - please log in" });
    }

    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - please log in" });
    }

    const isAdmin =
      process.env.ADMIN_EMAIL === user.primaryEmailAddress.emailAddress;

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Forbidden - admin access required" });
    }

    next();
  } catch (error) {
    console.error("Error in adminRoute:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
