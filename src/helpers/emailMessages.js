const URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://dahlia-ah-frontend-staging.herokuapp.com';

const messageHeader = "<div style='width:600px;font-family: Arial,Helvetica,sans-serif; text-decoration: none; margin:auto; font-size: 14px;'><div style='background-color:#8c9ca8; color:#fff; padding:20px;text-align: center;font-size: 18px;'><span style='margin-right: 10px'>Authors Haven</span></div><div style='padding:15px'>";

const messageFooter = "<p style='margin-top:20px; margin-bottom:0px; color:#6a6c6f; line-height: 1.35em;'>Thank you,</p><p style='margin-top:0px; margin-bottom:5px; color:#6a6c6f; line-height: 1.35em;'>The Authors Haven Team</p></div><div style='background-color:#8c9ca8; color:#fff; padding:7px'></div></div>";


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
            <p style='margin-top:20px;text-align:center'><a style='text-decoration:none;padding:10px;background:#0e87e3;color:#ffffff;border-radius:5px;' href='${URL}/reset-password?token=${token}'>Reset Password</a></p>
            ${messageFooter}`,
  };
  return message;
};

/**
 * verify user email page
 * @name page
 * @param {object} info
 * @returns {string} html page
 */

const VerifyAccountEmailPage = (info) => {
  const [firstName, url] = info;
  return `
<html>
    <head>
        <link href="https://fonts.googleapis.com/css?family=Courgette&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Courgette|Roboto&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
    </head>
    <body>
        <div style="border: 1px solid #E5E5E5; text-align: center; width: 550px; height: 300px">
            <h1 style="font-family: 'Roboto', sans-serif; font-weight:normal; text-align: left; margin-left: 25px"><i style="color: #73C81F; margin-right:7px" class="fas fa-feather"></i>Authors Haven</h1>
            <h3 style="font-weight: normal; font-family: 'Roboto', sans-serif; normal">Welcome, ${firstName}</h3>
            <p style="font-family: 'Roboto', sans-serif">You’ve  sucessfully signed up to Authors Haven</p>
            <p style="font-weight: bold; font-family:'Courgette', cursive">Share your ideas, get reviews and request collaborations</p>
            <p style="font-weight: bold; font-family:'Courgette', cursive">Bring your ideas to life</p>
            <a href = "${url}" style="font-family:'Roboto', sans-serif;  margin: 10px auto auto auto; color: black; display: block; width: 120px; border: 1px solid #73C81F; text-decoration: none; padding:14px; text-transform: uppercase">Confirm Email</a>
        </div>
    </body>
</html>`;
};

const emailNotificationMessage = (notificationObject) => {
  const [{
    actor, message, novelTitle, novelUrl
  }] = notificationObject;
  const data = {
    subject: 'Authors Haven - Notification',
    html: `${messageHeader}
            <p>${actor} ${message}
            ${novelTitle && novelUrl ? `<a href="${process.env.SERVER_URL}${novelUrl}"> ${novelTitle}</a></p>` : ''}
            ${messageFooter}`,
  };
  return data;
};

export default {
  forgotPasswordMessage,
  emailNotificationMessage,
  VerifyAccountEmailPage
};
