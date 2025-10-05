import prisma from "../db/db.config.js";
import { imageValidator, randomNumGenenrator } from "../utils/helper.js";

export async function getUsers(req, res) {
  try {
    const user = req.user;
    return res
      .status(200)
      .json({ success: true, message: "fetched user data", data: user });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "something went wrong.",
      error: [{ message: "something went wrong." }],
    });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload valid image.",
        error: [{ message: "Please upload valid image." }],
      });
    }
    
    

    const profile = req.files.profile;
    
    
    const profileValidation = imageValidator(profile?.size, profile.mimetype);

    if (profileValidation !== null) {
      return res
        .status(400)
        .json({ success: false, error: [{ message: profileValidation }] });
    }
    
    const imgExtension = profile.name.split(".");
    const imgName = randomNumGenenrator() + "." + imgExtension[1];
    
    const uploadPath = process.cwd() + "/public/images" + imgName;
    
    profile.mv(uploadPath , (err) => {
       if(err){
         return res
           .status(400)
           .json({
             success: false,
             message: "something went wrong.",
             error: [{ message: "something went wrong. please try again." }],
           });
       }
    })
    
    await prisma.users.update({
      data:{
         profile:imgName,
      },
      where: {
        id:Number(id)
      }
    })
    
    return res
      .status(200)
      .json({
        success: true,
        message: "image uploaded successfullly",
      });
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "something went wrong",
      error: [{ message: "failed to update user." }],
    });
  }
}
