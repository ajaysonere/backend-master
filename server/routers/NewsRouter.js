import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { createNews, deleteNews, getAllNews, getNews, updateNews } from '../controllers/NewsController.js';

const newsRouter = express.Router();

newsRouter.post("/create-news" , authMiddleware , createNews);
newsRouter.get("/get-all-news", authMiddleware, getAllNews);
newsRouter.get("/get-news/:id" , authMiddleware, getNews);
newsRouter.put("/update-news/:id" , authMiddleware , updateNews);
newsRouter.delete("/delete-news/:id" , authMiddleware, deleteNews); 


export default newsRouter;