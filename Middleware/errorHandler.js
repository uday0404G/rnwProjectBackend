const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            message: 'Invalid token or no token provided'
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
};

module.exports = { errorHandler }; 