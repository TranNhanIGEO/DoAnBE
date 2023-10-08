const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
    origin: (origin, callback) => {
        allowedOrigins.indexOf(origin) !== -1
            ? callback(null, true)
            : callback(new Error('Not allowed by CORS'));
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;