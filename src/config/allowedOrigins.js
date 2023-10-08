const allowedOrigins = [
    'https://www.yoursite.com',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    process.env.HOST
];

module.exports = allowedOrigins;