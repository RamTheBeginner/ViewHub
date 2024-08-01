import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";

export const createChannel = async (request, response, next) => {
  try {
    const { name, members } = request.body;
    const userId = request.userId;
    const admin = await User.findById(userId);

    if (!admin) {
      return response.status(400).send("Admin User Not Found");
    }

    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return response.status(400).send("Some Members are not valid users.");
    }

    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });

    await newChannel.save();
    return response.status(201).json({channel : newChannel});

  } catch (err) {
    console.log({ err });
    return response.status(500).json({ message: "Unable to Create" });
  }
};

export const getUserChannels = async (request, response, next) => {
    try {
      const userId = new mongoose.Types.ObjectId(request.userId);
      const channels = await Channel.find({
        $or: [{admin: userId} , {members: userId}],
      }).sort({updatedAt: -1});
      
      return response.status(201).json({channels});
  
    } catch (err) {
      console.log({ err });
      return response.status(500).json({ message: "Unable to Create" });
    }
  };
