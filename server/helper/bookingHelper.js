const nodemailer = require('nodemailer');

const getDayOfMonthSuffix = (dayOfMonth) => {

	if(dayOfMonth >= 11 && dayOfMonth <= 13) {
		return 'th';
	}
	switch (dayOfMonth % 10) {
		case 1: return 'st';
		case 2: return 'nd';
		case 3: return 'rd';
		default: return 'th';
	}
}

const formatDate = (dateStr) => {

	const date = new Date(dateStr);
	const options = {month: 'long', year: 'numeric' };
	const formattedDate = date.toLocaleDateString('en-US', options);
	const dayOfMonth = date.getDate();
	const suffix = getDayOfMonthSuffix(dayOfMonth);
	const finalResult = `${dayOfMonth}${suffix} ${formattedDate}`;
	return finalResult;
}


const sendQrCode = async (bookingId, userEmail, bookingData) => {

	/** Creating the nodemailer object */
	const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASSWORD,
	}
	});

	const locationName = bookingData.locationName;
	const locationAddress = `${bookingData.locationAddress.address} ${bookingData.locationAddress.city} ${bookingData.locationAddress.state} ${bookingData.locationAddress.pincode}`;
	const dateOfVisit = formatDate(bookingData.dateOfVisit);
	const noOfTickets = bookingData.noOfTickets;
	const bookingPrice = bookingData.bookingPrice;

	/** Creating the mail body object */
	const mailData = {
		from: process.env.EMAIL,
		to: userEmail,
		subject: "Booking Confirmation - Indian Tourism",
		html: `
			<div style="background-color:#f2f2f2; padding: 20px;">
			<div style="background-color:white; padding: 20px;">
				<h2 style="color:#007bff; font-family:Arial, sans-serif;">Indian Tourism</h2>
				<p style="font-size:16px; font-family:Arial, sans-serif;">Dear customer,</p>
				<p style="font-size:16px; font-family:Arial, sans-serif;">We are delighted to confirm your booking at <strong>${locationName}</strong>. Please find your QR code attached to this email.</p><br>
				<p style="font-size:16px; font-family:Arial, sans-serif;">Your booking details are:</p>
				<ul style="list-style-type: none; padding: 0; margin: 0;">
				<li style="font-size:16px; font-family:Arial, sans-serif;"><strong>Booking ID:</strong> ${bookingId}</li>
				<li style="font-size:16px; font-family:Arial, sans-serif;"><strong>Location:</strong> ${locationName}</li>
				<li style="font-size:16px; font-family:Arial, sans-serif;"><strong>Address:</strong> ${locationAddress}</li>
				<li style="font-size:16px; font-family:Arial, sans-serif;"><strong>Date of visit:</strong> ${dateOfVisit}</li>
				<li style="font-size:16px; font-family:Arial, sans-serif;"><strong>No. of tickets:</strong> ${noOfTickets}</li>
				<li style="font-size:16px; font-family:Arial, sans-serif;"><strong>Booking price:</strong> ${bookingPrice}</li>
				</ul>
				<div style="text-align:center;">
				<img src="cid:bandito@123" alt="QR Code" />
				</div>
				<p style="font-size:16px; font-family:Arial, sans-serif;">Thank you for choosing Indian Tourism, and we look forward to serving you soon.</p>
				<p style="font-size:16px; font-family:Arial, sans-serif;">Best regards,</p>
				<p style="font-size:16px; font-family:Arial, sans-serif;">The Indian-Tourism Team</p>
			</div>
			<p style="font-size:12px; color:#666666; font-family:Arial, sans-serif;">This email was sent from Indian Tourism.</p>
			</div>`,
		attachments: [{ filename: bookingId+'.png', path:'./public/qr/'+bookingId+'.png', cid: 'bandito@123' }]
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
