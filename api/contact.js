import sendEmailHandler from './send-email.js';

export default async function handler(req, res) {
    return sendEmailHandler(req, res);
}
