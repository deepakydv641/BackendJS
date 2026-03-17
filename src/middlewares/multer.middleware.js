import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the temp directory exists before multer tries to write to it
const tempDir = path.join(process.cwd(), "public/temp");
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Reverted to multer v1.4.x callback pattern
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        // Add a timestamp to avoid filename collisions
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
});

export const upload = multer({
    storage,
});