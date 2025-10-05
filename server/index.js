import express from 'express';
import 'dotenv/config.js';
import cors from 'cors';
import fileUpload from 'express-fileupload';

import authRouter from './routers/AuthRouter.js';
import profileRouter from './routers/ProfileRouter.js';

const app = express();

const PORT = process.env.PORT;


// middleware
app.use(express.json());
app.use(cors());
app.use(fileUpload());


app.get("/", (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "Welcome - Backend is working." });
});

app.use("/api/auth", authRouter);
app.use("/api/user", profileRouter);


app.listen(PORT, () => {
   console.log(`server is running on http:localhost:${PORT}`)
})

