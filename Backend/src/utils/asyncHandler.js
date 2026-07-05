const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        try {
            Promise.resolve(requestHandler(req, res, next)).catch((err) => {
                console.log(`Error in ${requestHandler.name}: ${err.message}`);
                next(err);
            });
        } catch (err) {
            next(err);
        }
    };
};

export default asyncHandler;