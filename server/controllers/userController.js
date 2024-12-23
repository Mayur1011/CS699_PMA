import User from "../models/user.js";
import Notification from "../models/notification.js";
import { createJWT } from "../utils/index.js";
import mongoose from "mongoose";
import { ObjectId } from "mongoose";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin, role, title } = req.body;
    // console.log("In registerUser", req.body);
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }
    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
      role,
      title,
    });
    if (user) {
      isAdmin ? createJWT(res, user._id) : null;
      user.password = undefined;
      console.log(user);
      res.status(201).json(user);
    } else {
      return res.status(400).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  // console.log("In loginUser");
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials" });
    }
    if (!user?.isActive) {
      return res
        .status(401)
        .json({ status: false, message: "User is disabled" });
    }
    const isMatch = await user.comparePassword(password);

    if (user && isMatch) {
      createJWT(res, user._id);

      user.password = undefined;

      res.status(200).json(user);
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTeamList = async (req, res) => {
  try {
    const users = await User.find().select("name title role email isActive");

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getNotificationsList = async (req, res) => {
  try {
    const { userId } = req.user;

    const notice = await Notification.find({
      team: userId,
      isRead: { $nin: [userId] },
    }).populate("task", "title");

    res.status(201).json(notice);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;
    const { _id } = req.body;

    const id =
      isAdmin && userId === _id
        ? userId
        : isAdmin && userId !== _id
        ? _id
        : userId;

    const user = await User.findById(id);

    if (user) {
      user.name = req.body.name || user.name;
      user.title = req.body.title || user.title;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();

      user.password = undefined;

      res.status(201).json({
        status: true,
        message: "Profile Updated Successfully.",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// export const markNotificationRead = async (req, res) => {
//   try {
//     const { userId } = req.user;

//     // const { isReadType, id } = req.query;
//     const { isReadType, id } = req.body;

//     if (isReadType === "all") {
//       await Notification.updateMany(
//         { team: userId, isRead: { $nin: [userId] } },
//         { $push: { isRead: userId } },
//         { new: true }
//       );
//     } else {
//       await Notification.findOneAndUpdate(
//         { _id: id, isRead: { $nin: [userId] } },
//         { $push: { isRead: userId } },
//         { new: true }
//       );
//     }

//     res.status(201).json({ status: true, message: "Done" });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ status: false, message: error.message });
//   }
// };

// CHATGPT FIXED CODE

export const markNotificationRead = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming `userId` is extracted from JWT or session
    const { isReadType, id } = req.query; // Read query parameters

    // Check if 'isReadType' is 'all' (no 'id' should be provided)
    if (isReadType === "all") {
      // Validate that no 'id' is included
      if (id) {
        return res.status(400).json({
          status: false,
          message:
            "ID should not be provided when marking all notifications as read",
        });
      }

      // Mark all notifications as read for the user
      await Notification.updateMany(
        { team: userId, isRead: { $nin: [userId] } }, // Notifications that haven't been read by the user yet
        { $push: { isRead: userId } } // Add the userId to the 'isRead' array
      );

      return res
        .status(200)
        .json({ status: true, message: "All notifications marked as read" });
    }

    // If 'isReadType' is not 'all', we expect an 'id' to be provided
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "A valid notification ID is required",
      });
    }

    // Mark a specific notification as read
    await Notification.findOneAndUpdate(
      { _id: id, isRead: { $nin: [userId] } },
      { $push: { isRead: userId } },
      { new: true }
    );

    return res
      .status(200)
      .json({ status: true, message: "Notification marked as read" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (user) {
      user.password = req.body.password;

      await user.save();

      user.password = undefined;

      res.status(201).json({
        status: true,
        message: `Password chnaged successfully.`,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const activateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user) {
      user.isActive = req.body.isActive;

      await user.save();

      res.status(201).json({
        status: true,
        message: `User account has been ${
          user?.isActive ? "activated" : "disabled"
        }`,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
