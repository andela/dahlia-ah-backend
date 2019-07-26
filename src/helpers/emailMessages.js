const messageHeader = "<div style='width:600px;font-family: Arial,Helvetica,sans-serif; text-decoration: none; margin:auto; font-size: 14px;'><div style='background-color:#8c9ca8; color:#fff; padding:20px;text-align: center;font-size: 18px;'><span style='margin-right: 10px'>Authors Haven</span></div><div style='padding:15px'>";

const messageFooter = "<p style='margin-top:20px; margin-bottom:0px; color:#6a6c6f; line-height: 1.35em;'>Thank you,</p><p style='margin-top:0px; margin-bottom:5px; color:#6a6c6f; line-height: 1.35em;'>The Aurthors Haven Team</p></div><div style='background-color:#8c9ca8; color:#fff; padding:7px'></div></div>";


/**
 * Forgot password message
 * @name sendMail
 * @param {string} firstName
 * @param {string} token
 * @returns {object} a message object to be used by SendGrid
 */

const forgotPasswordMessage = (firstName, token) => {
  const message = {
    subject: 'Authors Haven - Password Reset',
    html: `${messageHeader}
            <p>Dear <span style='text-transform: capitalize;'>${firstName}</span>,</p>
            <p>You requested for a password reset. Click on the button below to confirm this action.</p>
            <p style='margin-top:20px;text-align:center'><a style='text-decoration:none;padding:10px;background:#0e87e3;color:#ffffff;border-radius:5px;' href='${process.env.SERVER_URL}/auth/passwordreset?token=${token}'>Reset Password</a></p>
            ${messageFooter}`,
  };
  return message;
};

export default {
  forgotPasswordMessage
};
