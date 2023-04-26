import "./OtpModal.css";

import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import {AppContext} from '../../../AppContext.js'
import Button from "../../UI/Buttons/Button";

const OtpModal = () => {

	const { context, setContext } = useContext(AppContext);

	const [otp, setOtp] = useState("");
	const [timer, setTimer] = useState(120);
	const [verificationMsg, setVerificationMsg] = useState("");
	const [modalCloseClicked, setModalCloseClicked] = useState(false);

	const handleLoginSubmit = async (e)	 => {
		e.preventDefault();

		const data = {
			email: context.userEmail,
			otp: otp,
			otpType: "emailVerification"
		};

		console.log(data);

		try {
			const response = await axios.post("http://localhost:4000/api/auth/verify-otp", data)
			console.log(response.data);

			if(response.data.status === "success"){

				setVerificationMsg("Email verified successfully");

				/** Wait for 2 seconds and then close the OTP modal */
				setTimeout(() => {
					setContext({...context, isLoggedIn: true, isLoginModalOpen: false,
						isOtpModalOpen: false, isVerified: true, isUserAdmin: false});
				}, 2000);
			}
			else{
				setVerificationMsg("Invalid OTP or OTP expired");
			}
		}
		catch (error) {
			console.log(error);
		}
	};

	const handleModalClose = () => {
		if(context.isVerified === true){
			console.log("OTP Modal Closed")
			setContext({...context, isOtpModalOpen: false});
		}
		else{
			console.log("First verify the email id");
			setModalCloseClicked(true);
		}
	};

	const handleResendOtp = async () => {
		const data = {
			email: context.userEmail,
			otpType: "emailVerification"
		};

		try {
			const response = await axios.post("http://localhost:4000/api/auth/resend-otp", data);
			console.log(response.data);
			if (response.data.status === "success") {
				setVerificationMsg("New OTP sent");
				setTimer(120); // Set the timer to 2 minutes
			}
		}
		catch (error) {
			console.log(error);
		}
	};

	const handleCountdown = () => {
		if (timer > 0) {
			setTimeout(() => {
				setTimer(timer - 1);
			}, 1000);
		}
	};

	useEffect(() => {
		handleCountdown();
		// eslint-disable-next-line
	}, [timer]);




	return (
		<div className="modal">
			<div className="modal-content">
				<Button className="close-btn" onClick={() => handleModalClose()}>&times;</Button>

				<h2>Verify Email Address</h2>

				<form onSubmit={handleLoginSubmit}>

					<label>OTP : </label>
					<input
						type="text"
						name="otp"
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						required
					/>
					<br />
					<button type="submit">Login</button>
				</form>
				<div>
					{timer === 0 ? (
						<button type="submit" onClick={handleResendOtp}>Resend OTP</button>
					) : (
						<p>Resend OTP in {timer} seconds</p>
					)}
				</div>
				<div> <h1> {modalCloseClicked ? "First verify the email id" : ""} </h1> </div>
				<div> <h1> {verificationMsg} </h1> </div>
			</div>
		</div>
	);
};
export default OtpModal;