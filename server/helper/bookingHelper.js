const nodemailer = require('nodemailer');


const sendQrCode = async (bookingId, userEmail) => {

	/** Creating the nodemailer object */
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASSWORD,
		}
	});

	/** Creating the mail body object */
	const mailData = {
		from: process.env.EMAIL,
		to: userEmail,
		subject: "Booking Confirmation",
		text: "Booking Confirmation",
		html: `<h1>Booking Confirmation</h1>
		<p>Thank you for booking with us. Please find the QR code attached to this email.</p>
		<img src="cid:bandito@123" alt="QR Code" />
		<p>Regards,</p>
		<p>Team Bandito</p>
		`,
		attachments: [
			{
				filename: bookingId+'.png',
				path: './public/qr/'+bookingId+'.png',
				cid: 'bandito@123'
			}]
	};

	console.log("sending the email".green)
	try{
		await transporter.sendMail(mailData);
		return true;
	}
	catch(err) {
		return false;
	}
};

module.exports = sendQrCode;
