import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the temp directory exists before multer tries to write to it
const tempDir = path.join(process.cwd(), "public/temp");
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// multer 2.x diskStorage: destination and filename return values directly (no cb)
const storage = multer.diskStorage({
    destination: function (req, file) {
        return tempDir;
    },
    filename: function (req, file) {
        // Add a timestamp to avoid filename collisions
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        return uniqueSuffix + "-" + file.originalname;
    }
});

export const upload = multer({
    storage,
});