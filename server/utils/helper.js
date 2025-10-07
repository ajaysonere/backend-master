import { supportedMimes } from "../config/fileSystem.js";
import { v4 as uuidv4 } from "uuid";
import fs from 'fs';

export const imageValidator = (size, mime) => {

  if (bytesToMB(size) > 2) {
    return "Image must be less then 2 MB";
  } else if (!supportedMimes.includes(mime)) {
    return "Image must be type of png, jpg, jpeg";
  }
  return null;
};

function bytesToMB(bytes) {
  return bytes / (1024 * 1024);
}


export const randomNumGenenrator = () => {
  return uuidv4();
}

export const imageUrlTransformer = (imageName) => {
  return `${process.env.APP_URL}/images/${imageName}`
}

export const removeImage = (imageName) => {
  const imagePath = process.cwd() + "/public/images/" + imageName;
  if(fs.existsSync(imagePath)){
    return fs.unlinkSync(imagePath);
  }
}

export const uploadImage = (imageName) => {
   const imageExtension = imageName?.name.split(".");
   const newImageName = randomNumGenenrator() + "." + imageExtension[1];
   
   const uploadPath = process.cwd() + "/public/images/" + newImageName;
   
   imageName.mv(uploadPath , (err) => {
      if(err){
         return res.status(500).json({success:false, error:[{message:'failed to upload the image.'}]})
      }
   })
   return newImageName;
}