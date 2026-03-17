// asyncHandler wraps async route handlers to forward errors to Express error middleware
// Works with both Express 4 and Express 5
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

export default asyncHandler;