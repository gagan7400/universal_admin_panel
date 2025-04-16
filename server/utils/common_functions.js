const nodemailer = require("nodemailer");

exports.sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        service: 'gmail',
        auth: {
            user: 'gagan.engineersahabedu@gmail.com',
            pass: 'obzgfddcwzkgtfpl',
        },
    });

    await transporter.sendMail({
        from: 'gagan.engineersahabedu@gmail.com',
        to,
        subject,
        html,
    });
};
