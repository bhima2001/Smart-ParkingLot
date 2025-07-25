import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export const errorHandler = (err, _req, res, _next) => {
    const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    console.log(err);
    res.status(status).json({
        error: true,
        message: err.message || getReasonPhrase(status),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};