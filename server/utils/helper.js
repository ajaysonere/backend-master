import { supportedMimes } from "../config/fileSystem.js";
import { v4 as uuidv4 } from "uuid";

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