import nodemailer from 'nodemailer'

var smtpConfiq = {
  service: "Gmail",
  auth: {
    user: 'noreplydummy1256@gmail.com',
    pass: 'rirl rvjn eqju bemx',
  },
};


const  generateEmail= async (email, subject, html) => {
    try {
      const transporter = nodemailer.createTransport(smtpConfiq);
      const mailOptions = {
        from: 'arsalantanvir@yahoo.com',
        to: email,
        subject,
        text: "hiiii",
        html,
      };
      const res = await transporter.sendMail(mailOptions);
      console.log(res);
      return true;
    } catch (err) {
      console.log("err in generate email: ", err);
      return true;
    }
  }

  

export default generateEmail