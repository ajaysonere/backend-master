import express from 'express';
import 'dotenv/config.js';
const app = express();

const PORT = process.env.PORT;

app.get("/" , (req , res)=> {
    return res.status(200).json({success:true, message:"App is working."});
});


app.listen(PORT, () => {
   console.log(`server is running on http:localhost:${PORT}`)
})

