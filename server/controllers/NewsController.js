import { imageValidator, randomNumGenenrator, removeImage, uploadImage } from "../utils/helper.js";
import newsSchema from "../validation/newsValidation.js";
import prisma from "../db/db.config.js";
import { transformer } from "../transform/transform.js";
import { z } from "zod";

export const getAllNews = async (req, res) => {
  try {
    const user_id = req.user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;

    if (page <= 0) {
      page = 1;
    }

    if (limit <= 0 || limit >= 100) {
      limit = 2;
    }

    const skip = (page - 1) * limit;

    const news = await prisma.news.findMany({
      take: limit,
      skip: skip,
      include: {
        user: true,
      },
    });

    if (!news) {
      return res
        .status(404)
        .json({ success: false, error: [{ message: "news not found." }] });
    }

    const newsTransform = news?.map((item) => transformer(item));

    const totalNews = await prisma.news.count();
    const totalPage = Math.ceil(totalNews / limit);
    return res.status(200).json({
      success: true,
      data: newsTransform,
      metaData: {
        totalPage: totalPage,
        currentPage: page,
        currentLimit: limit,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, error: [{ message: "something went wrong." }] });
  }
};

export const createNews = async (req, res) => {
  try {
    const user = req.user;
    const newsData = req.body;

    const newsValidation = newsSchema.safeParse(newsData);

    if (!newsValidation.success) {
      const errors = newsValidation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        error: errors,
      });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(400)
        .json({ success: false, error: [{ message: "Image is required" }] });
    }

    const imageName = req.files.image;
    const message = imageValidator(imageName?.size, imageName.mimetype);

    if (message !== null) {
      return res
        .status(400)
        .json({ success: false, error: [{ message: message }] });
    }

    const imageExtension = imageName.name.split(".");
    const newImageName = randomNumGenenrator() + "." + imageExtension[1];

    const uploadPath = process.cwd() + "/public/images/" + newImageName;

    imageName.mv(uploadPath, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: [{ message: "Something went wrong while uploading image." }],
        });
      }
    });

    const payload = {
      title: newsValidation.data.title,
      content: newsValidation.data.content,
      image: newImageName,
      user_id: user.id,
    };

    const news = await prisma.news.create({
      data: payload,
    });

    return res.status(200).json({ success: true, data: news });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, error: [{ message: "something went wrong." }] });
  }
};

export const getNews = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: [{ message: "Please provide the news id." }],
      });
    }

    const newsData = await prisma.news.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: true,
          },
        },
      },
    });

    if (!newsData) {
      return res
        .status(404)
        .json({ success: false, error: [{ message: "News not found." }] });
    }

    const validNews = newsData ? transformer(newsData) : null;

    return res.status(200).json({ success: true, news: validNews });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, error: [{ message: "something went wrong." }] });
  }
};

export const updateNews = async (req, res) => {
  try {
    const newsId = Number(req.params.id);

    const {title, content} = req.body;
    
    console.log(req.body);

    const newsValidation = newsSchema.safeParse(req.body);

    console.log(newsValidation);

    if (!newsValidation.success) {
      const errors = newsValidation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      }));

      return res
        .status(400)
        .json({ success: false, error: [{ message: errors }] });
    }

    if (!newsId) {
      return res.status(400).json({
        success: false,
        error: [{ message: "Please provide the news Id" }],
      });
    }
    console.log(newsId);

    const user = req?.user;

    console.log(user);

    const newsData = await prisma.news.findUnique({
      where: {
        id: newsId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: true,
          },
        },
      },
    });
    
    console.log(newsData);

    if (user.id !== newsData.user_id) {
      return res
        .status(401)
        .json({
          success: false,
          error: [{ message: "user is not authorized to edit this news." }],
        });
    }
    
    const image = req.files.image;
    
    if(!image){
       return res.status(400).json({success:false, error:[{message:'Please provide the image.'}]})
    }
    
    const validateImage = imageValidator(image.size, image.mimetype);
    
    if(validateImage !== null){
       return res.status(400).json({success:false, error:[{message:validateImage}]})
    }
    
    removeImage(newsData.image);
    
    const newImageName = uploadImage(image);
    
    const payload = {
       title: title,
       content:content,
       image:newImageName
    }
    
    console.log(payload)
    
    const data = await prisma.news.update({
      data:payload,
      where:{
        id:newsId,
      }
    })

    return res.status(200).json({ success: true, news: data });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, error: [{ message: "Internal server error." }] });
  }
};

export const deleteNews = () => {
  try {
  } catch (error) {}
};
