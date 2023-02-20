const otpHelper = require('../../helper/otpHelper');
const otpController = async (req, res) => {

	const email = req.body.email;
	const otp = req.body.otp;

	if(email === null)
		return res.status(400).send({msg: "Email is required"});
	else
	{
		const result = await otpHelper.verifyOtp(email, otp, res);
		console.log("The returned result is = "+ result);
		if(result === "emailError")
			return res.status(200).send({msg: "User not found or invalid email"});
		else
		if(result === "otpError")
				res.status(200).send({msg: "Otp not expired or invalid otp"});
		else
		if(result === "success")
			res.status(200).send({msg: "Email verified successfully"});
	}
};



module.exports = otpController;
