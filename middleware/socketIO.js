export const socketIOMiddleware = (io) => {
    return (req, res, next) => {
        req.io = io;
        next();
    };
};
