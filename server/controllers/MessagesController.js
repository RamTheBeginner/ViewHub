import Channel from "../models/ChannelModel.js";
import Message from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";

export const getMessages = async (request, response, next) => {
  try {
    const user1 = request.userId;
    const user2 = request.body.id;
    console.log(user1);

    console.log(request.body.admin);

    if (request.body.admin === undefined) {
      if (!user1 || !user2) {
        return response.status(400).json("Both user ID's are required");
      }

      const messages = await Message.find({
        $or: [
          { sender: user1, recipient: user2 },
          { sender: user2, recipient: user1 },
        ],
      }).sort({ timestamp: 1 });

      return response.status(200).json({ messages });
    }else{
      const messages1 = await Channel.find({_id:user2})
      .populate("messages")
      .exec()
      const messages = messages1[0].messages
      return response.status(200).json({messages})
    }
  } catch (err) {
    console.log({ err });
    return response.status(500).json({ message: "Unable to search contacts" });
  }
};

export const uploadFile = async (request, response) => {
  try {
    if (!request.file) {
      return response.status(400).send("Message is Required");
    }

    const date = Date.now();
    let fileDir = `uploads/files/${date}`;
    let fileName = `${fileDir}/${request.file.originalname}`;

    mkdirSync(fileDir, { recursive: true });
    renameSync(request.file.path, fileName);

    return response.status(200).json({ filePath: fileName });
  } catch (err) {
    console.error("Error uploading file:", err);
    return response.status(500).json({ message: "Unable to upload file" });
  }
};
