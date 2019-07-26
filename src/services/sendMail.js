import sendgridMail from '@sendgrid/mail';

/**
 * Send mail service
 * @name sendMail
 * @param {string} senderMail
 * @param {string} receiverMail
 * @param {string} message
 * @returns {Func} a call to Sendgrid's send method
 */

const sendMail = (senderMail, receiverMail, message) => {
  sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: receiverMail,
    from: senderMail,
    ...message
  };
  return sendgridMail.send(msg);
};

export default sendMail;
