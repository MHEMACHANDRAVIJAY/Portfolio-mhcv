const sendEmailHandler = require('./send-email.js');

module.exports = async function handler(req, res) {
    return sendEmailHandler(req, res);
};
