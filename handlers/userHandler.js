import User from "../models/User.js";
import Testimonial from "../models/Testimonial.js";
import { Message } from "../models/Message.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Registration
export const createUsers = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  if (!firstname || !lastname || !email || !password) {
    return res.send({ status: false, message: "All fields are required" });
  }
  if (await User.findOne({ email })) {
    return res.send({ status: false, message: "Email already exists" });
  }
  const user = await User.create({ firstname, lastname, email, password });
  res.send({
    status: true,
    message: "User Registered Successfully :)",
    Userdata: user,
  });
};

// Login
export const loginUsers = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid Email or Password",
        Userdata: {},
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Invalid Email or Password",
        Userdata: {},
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      status: true,
      message: "User Logged in Successfully :)",
      Userdata: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error", error });
  }
};

export const feedbackUsers = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .send({ status: false, message: "Image is required" });
  }

  const imagePath = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  const { name, designation, rating, short_description } = req.body;

  if (!name || !designation || !rating || !short_description) {
    return res.send({ status: false, message: "All fields are required" });
  }

  const testimonial = await Testimonial.create({
    image: imagePath,
    name,
    designation,
    rating,
    short_description,
  });

  res.send({
    status: true,
    message: "Your Feedback is Uploaded successfully!",
    testimonial,
  });
};

// (Optional) Fetch all users
export const getUsers = async (req, res) => {
  const users = await User.find();
  res.send({ status: true, message: "User Data Fetched", Userdata: users });
};

// Fetch all approved feedbacks
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Testimonial.find({ is_approved: true }).sort({
      created_at: -1,
    });
    res.status(200).json({ status: true, feedback: feedbacks });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// Fetch all unapproved testimonials
export const getPendingFeedback = async (req, res) => {
  try {
    const feedbacks = await Testimonial.find({ is_approved: false }).sort({
      created_at: -1,
    });
    res.status(200).json({ status: true, feedbacks });
  } catch (error) {
    console.error("Error fetching pending feedback:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// Approve or reject testimonial
export const moderateFeedback = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  try {
    if (action === "approve") {
      await Testimonial.findByIdAndUpdate(id, { is_approved: true });
    } else if (action === "reject") {
      await Testimonial.findByIdAndDelete(id); // or soft-delete by setting deleted_at
    } else {
      return res.status(400).json({ status: false, message: "Invalid action" });
    }

    res
      .status(200)
      .json({ status: true, message: `Feedback ${action}d successfully` });
  } catch (error) {
    console.error("Error moderating feedback:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstname, lastname, email } = req.body;

    if (!firstname || !lastname || !email) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstname, lastname, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude passwords
    res.status(200).json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const messagePost = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, msg: "Missing required fields" });
    }

    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();

    res
      .status(200)
      .json({ success: true, msg: "Message received successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
};
export const markMessageSeen = async (req, res) => {
  try {
    await Message.updateMany({ seen: false }, { seen: true });
    res.json({ success: true, message: "All messages marked as seen" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to mark as seen" });
  }
};
export const messageUnSeen = async (req, res) => {
  try {
    const count = await Message.countDocuments({ seen: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Error fetching unseen message count" });
  }
};
