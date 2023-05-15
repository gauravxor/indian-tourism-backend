import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import Button		from "../../UI/Buttons/Button";
import {AppContext}	from '../../../AppContext.js'

import "./OtpModal.css";

const OtpModal = () => {

	const { context, setContext, resetContext } = useContext(AppContext);

	/** To store the OTP entered by user */
	const [otp, setOtp] = useState("");

	/** To store the OTP expiry timer value */
	const [timer, setTimer] = useState(120);

	/** To store the verification message to be displayed to user */
	const [verificationMsg, setVerificationMsg] = useState("");

	/** Function to handle things when user clicks the SUBMIT button in OTP form */
	const handleVerifySubmit = async (e)	 => {
		e.preventDefault();

		const data = {
			email: context.userEmail,
			otp: otp,
			otpType: "emailVerification"
		};

		try {
			const url = `${window.location.protocol}//${window.location.hostname}:4000/api/auth/verify-otp`;
			const response = await axios.post(url, data)
			if(response.data.status === "failure" && response.data.msg === "Tokens Expired"){
				alert("Session Expired. Please Login Again");
				resetContext();
			}
			else
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
				console.log("Invalid OTP or OTP expired");
			}
		}
		catch (error) {
			const response = error.response.data;
			if(response.msg === "User not logged in"){
				console.log("User not logged in");
				resetContext();
				alert("Session Expired. Please Login Again!");
			}
			else
			if(response.msg === "Duplicate session"){
				console.log("Duplicate session");
				resetContext();
				alert("Duplicate session. Please Login Again!");
			}
			else{
				console.log("Invalid OTP or OTP expired");
			}
		}
	};

	/** Function to handle OTP modal close button click */
	const handleModalClose = () => {
		if(context.isVerified === true){
			console.log("OTP Modal Closed")
			setContext({...context, isOtpModalOpen: false});
		}
		else{
			console.log("First verify the email id");
			setVerificationMsg("First verify the email id");
		}
	};

	const handleResendOtp = async () => {
		const data = {
			email: context.userEmail,
			otpType: "emailVerification"
		};

		try {
			const url = `${window.location.protocol}//${window.location.hostname}:4000/api/auth/resend-otp`;
			const response = await axios.post(url, data);
			if(response.data.status === "failure" && response.data.msg === "Tokens Expired"){
				alert("Session Expired. Please Login Again");
				resetContext();
			}
			else
			if (response.data.status === "success") {
				setVerificationMsg("New OTP sent");
				setTimer(120); // Set the timer to 2 minutes
			}
		}
		catch (error) {
			const response = error.response.data;
			if(response.msg === "User not logged in"){
				console.log("User not logged in");
				resetContext();
				alert("Session Expired. Please Login Again!");
			}
			else
			if(response.msg === "Duplicate session"){
				console.log("Duplicate session");
				resetContext();
				alert("Duplicate session. Please Login Again!");
			}
			else{
				console.log(error);
			}
		}
	};

	/** Function to handle the OTP expiry timer */
	const handleCountdown = () => {

	/** Decrease timer count by 1, each second */
		if (timer > 0) {
			setTimeout(() => {
				setTimer(timer - 1);
			}, 1000);
		}
	};

	useEffect(() => {
		handleCountdown();
	}, [timer]); // eslint-disable-line

	/** Clear the verification message after 2 seconds */
	useEffect(() => {
		if(verificationMsg !== ""){
			setTimeout(() => {
				setVerificationMsg("");
			}, 2000);
		}
	}, [verificationMsg]);


	return (
		<div className="modal_2">
			<div className="modal-_content">
				<Button className="close-btn" onClick={() => handleModalClose()}>&times;</Button>
				<h2>Verify Email Address</h2>

				<form onSubmit={handleVerifySubmit}>
					<label>OTP : </label>
					<input
						type="text"
						name="otp"
						placeholder="Enter OTP"
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						required
					/>
					<br/>
					<Button type="submit">Verify</Button>
				</form>

				{/* Enable OTP resend button when OTP timer expires*/}
				<div className="resend">
					{timer === 0 ? (
						<Button type="submit" onClick={handleResendOtp}>Resend OTP</Button>
					) : (
						<p>Resend OTP in {timer} seconds</p>
					)}
				</div>

				<div>
					<h1> {verificationMsg} </h1>
				</div>
			</div>
		</div>
	);
};
export default OtpModal;