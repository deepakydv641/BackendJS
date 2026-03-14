import ConnectDB from "./db/index.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

ConnectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Errro",error)
        throw error
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log("server is running on port",process.env.PORT);
    })
})
.catch((error)=>{
    console.log("Error connecting to database",error);
    process.exit(1);
})

app.use(cors({
    origin:process.env.CROS_ORIGIN,
    credentials:true
}))
app.use(express.json({
    limit:"16kb"
}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(express.static("public"))
app.use(cookieParser())