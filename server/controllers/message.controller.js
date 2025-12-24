import imagekit from "../configs/imageKit.js";
import openai from "../configs/openAI.js";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import axios from "axios";

//AI chat message controller

export const textMsgController = async (req, res) => {
  try {
    const userId = req.user._id;

    //check credit
    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You dont have enough credits",
      });
    }

    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({
      userId,
      _id: chatId,
    });

    chat.messages.push({
      role: "user",
      content: prompt,
      timeStamp: Date.now(),
      isImage: false,
    });

    const { choices } = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {
      ...choices[0].messages,
      timeStamp: Date.now(),
      isImage: false,
    };

    res.status(200).json({ message: "Message added", chat });

    chat.messages.push(reply);

    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });
  } catch (error) {
    res.json({ success: false, message: "Error adding message", error });
  }
};

//Image generation controller

export const imageMsgController = async (req, res) => {
  try {
    const userId = req.user._id;
    //check credit
    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You dont have enough credits",
      });
    }
    const { prompt, chatId, isPublished } = req.body;

    //find chat
    const chat = await Chat.findOne({ userId, _id: chatId });

    //push user msg
    chat.messages.push({
      role: "user",
      content: prompt,
      timeStamp: Date.now(),
      isImage: false,
    });

    //encode prompt
    const encodedPrompt = encodeURIComponent(prompt);

    //construct imageKit AI gen url
    const generateImgUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickGpt/${Date.now()}.png?tr=w-800,h-800`;

    //trigger generation by fetching from image kit
    const aiImgResponse = await axios.get(generateImgUrl, {responseType:"arraybuffer"})

    //Convert to base64
    const base64Img = `data:image/png;base64${Buffer.from(aiImgResponse.data,"binary").toString('base64')}`

    //upload to image-kit
    const uploadResponse = await imagekit.files.upload({
      file: base64Img,
      fileName: `${Date.now()}.png`,
      folder: "quickGpt"
    })

    const reply = {
      role:'assistant',
      content : uploadResponse.url,
      timeStamp: Date.now(),
      isImage: true,
      isPublished
    };

    res.json({
      success:true,
      reply
    })

    chat.messages.push(reply);

    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};
