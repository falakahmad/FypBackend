import { Router } from "express";
import multer from "multer";
import {
  getUsers,
  createUsers,
  loginUsers,
  feedbackUsers,
  getAllFeedback,
  getPendingFeedback,
  moderateFeedback,
  updateUserProfile,
  getAllUsers,
  messagePost,
  getAllMessages,
  markMessageSeen,
  messageUnSeen,
} from "../handlers/userHandler.js";
import verifyToken from "../middleware/verifyToken.js";

const uploads = multer({ dest: "uploads/" });
const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.post("/create", createUsers);
userRouter.post("/login", loginUsers);
userRouter.post("/feedback", uploads.single("image"), feedbackUsers);

userRouter.get("/feedbacks", getAllFeedback);
userRouter.get("/pending-feedbacks", verifyToken, getPendingFeedback);
userRouter.put("/moderate-feedback/:id", verifyToken, moderateFeedback);
userRouter.put("/update-profile", verifyToken, updateUserProfile);
userRouter.get("/allUsers", getAllUsers);
userRouter.post("/messages", messagePost);
userRouter.get("/messages", getAllMessages);
userRouter.patch("/messages/mark-seen", markMessageSeen);
userRouter.get("/messages/unseen-count", messageUnSeen);

userRouter.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // return res.json({
    //   status: true,
    //   name: user.name,
    //   email: user.email,
    //   isAdmin: user.isAdmin, // ✅ This tells the frontend your role
    // });
    return res.json({
      status: true,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    console.error("Error in /me route:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
});

export default userRouter;
