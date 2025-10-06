import { imageValidator, randomNumGenenrator } from "../utils/helper.js";
import newsSchema from "../validation/newsValidation.js";
import prisma from "../db/db.config.js";
import { transformer } from "../transform/transform.js";

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
    return res
      .status(200)
      .json({
        success: true,
        data: newsTransform,
        metaData: { totalPage: totalPage , currentPage: page , currentLimit: limit },
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

export const getNews = () => {
  try {
  } catch (error) {}
};

export const updateNews = () => {
  try {
  } catch (error) {}
};

export const deleteNews = () => {
  try {
  } catch (error) {}
};
