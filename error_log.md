# Debugging Log - Backend JS API

This document summarizes the bugs, errors, and architectural issues identified and fixed during this conversation.

## 1. Environment & Configuration Errors
- **Issue**: Environment variables were not loading (`process.env` attributes were `undefined`).
- **Cause**: The [.env](file:///c:/Users/deepa/OneDrive/BackendJS/.env) file was corrupted/incorrectly formatted, and the `dotenv` initialization path in [index.js](file:///c:/Users/deepa/OneDrive/BackendJS/src/index.js) was unreliable.
- **Fix**: Re-formatted the [.env](file:///c:/Users/deepa/OneDrive/BackendJS/.env) file and updated [index.js](file:///c:/Users/deepa/OneDrive/BackendJS/src/index.js) to use an absolute path for `dotenv.config()`.

## 2. Multer & File Upload Errors
- **Issue**: `next is not a function` during file uploads on the `/register` route.
- **Cause**: Project was using `multer@2.x` (alpha) which removes Node-style callbacks (`cb`). This caused internal routing failures in the middleware wrapper.
- **Detailed Solution**: 
    1. Downgraded `multer` from `2.1.1` to `1.4.5-lts.1` (stable).
    2. Updated [multer.middleware.js](file:///c:/Users/deepa/OneDrive/BackendJS/src/middlewares/multer.middleware.js) to use the standard callback pattern:
       ```javascript
       destination: function (req, file, cb) { cb(null, tempDir); }
       ```
- **Issue**: Images were uploading to Cloudinary in "raw" form or with missing extensions.
- **Cause**: Multer's default `memoryStorage` or misconfigured `diskStorage` was passing files without extensions, causing Cloudinary's auto-detection to fail.
- **Detailed Solution**: 
    1. Implemented `multer.diskStorage` to save files locally first.
    2. Added logic to generate unique filenames with original suffixes:
       ```javascript
       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
       cb(null, uniqueSuffix + "-" + file.originalname);
       ```
    3. This ensured Cloudinary received a file with a valid extension (e.g., [.jpg](file:///c:/Users/deepa/OneDrive/BackendJS/pexels-daria-liudnaya-8167176.jpg)), allowing for correct processing.
- **Issue**: Local temporary files were accumulating in `public/temp/`.
- **Cause**: `cloudinary.js` was not deleting the local file after a successful upload.
- **Fix**: Added `fs.unlinkSync(localFilePath)` to the success path of the Cloudinary upload utility to ensure disk space is cleared.

## 3. Request Parsing Errors
- **Issue**: `Cannot destructure property 'email' of 'req.body' as it is undefined` on the `/login` route.
- **Cause**: Postman was sending `multipart/form-data`, which standard Express body-parsers (`express.json`) cannot read.
- **Fix**: Added `upload.none()` to the `/login` route in `user.routes.js`. This allowed Multer to parse the text fields into `req.body` without expecting any files.

## 4. Mongoose Hook Errors
- **Issue**: `next is not a function` occurring inside the `User` model.
- **Cause**: The `async` `pre("save")` hook was defined with a `next` parameter: `async function (next) { ... next() }`.
- **Detailed Solution**: 
    1. Specialized `async` hooks in modern Mongoose (v5+) should not use the `next` callback. If the function is `async`, Mongoose waits for the Promise to resolve.
    2. Cleaned up the hook to simply return/resolve:
       ```javascript
       userSchema.pre("save", async function () { 
           if (!this.isModified("password")) return;
           this.password = await bcrypt.hash(this.password, 10);
       });
       ```

## 5. Logic & Code Consistency
- **Issue**: Missing helper functions and variable shadowing.
- **Cause**: `generateAccessAndRefreshToken` wasn't defined, and the variable name `user` was colliding with the Model name `User`.
- **Fix**: Defined the missing helper function and renamed result variables to `userExists` or `loggedInUser`.

## 6. API Performance
- **Issue**: Postman requests taking >5 seconds.
- **Cause**: Inefficient error handling and unhandled async rejections causing the server to hang.
- **Fix**: Rewrote `asyncHandler` to properly use `Promise.resolve().catch(next)` which is optimized for Express 5's internal error handling.

## forget await in 
DB_user.save({validateBeforeSave}) : use await because DB is in another continent
