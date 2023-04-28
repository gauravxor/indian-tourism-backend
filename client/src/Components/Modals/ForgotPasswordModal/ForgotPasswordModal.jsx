import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import Button 		from "../../UI/Buttons/Button";
import {AppContext}	from '../../../AppContext.js'
import "./ForgotPasswordModal.css";


const ForgotPasswordModal = () => {

	const { context, setContext } = useContext(AppContext);

	/** State to store the email during password reset */
	const [email, setEmail] = useState("");

	/** State to store the OTP during password reset */
	const [otp, setOtp] = useState("");

	/** To store the state, if reset email is sent */
	const [isMailSent, setIsMailSent] = useState(false);

	/** To store the OTP expiry timer */
	const [timer, setTimer] = useState(120);

	/** To store the state if the user has validated the OTP */
	const [isOtpValidated, setIsOtpValidated] = useState(false);

	/** To store the new password */
	const [password, setPassword] = useState("");

	/** To store the confirm password */
	const [confirmPassword, setConfirmPassword] = useState("");

	/** To store the action message to be displayed to user */
	const [resetMessage, setResetMessage] = useState("");


	/** Function to handle things when user clicks FORGOT PASSWORD button */
	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = {
			email: email,
		};

		try {
			const url = "http://localhost:4000/api/auth/forgot-password";
			const response = await axios.post(url ,data);

			if(response.data.status === "success"){

				/** Setting the appropriate message to user's click action */
				setResetMessage("OTP sent to registered email");

				/** Wait for 2 seconds before rendering the other component */
				setTimeout(() => {
					setIsMailSent(true);
				}, 2000);
			}
			else{
				setResetMessage("Invalid details provided");
			}
		}
		catch (error) {
			console.log("Error sending OTP");
			setResetMessage("Invalid email or user does not exist");
		}
	};

	/** Function to handle things when user submits an OTP */
	const handleOtpSubmit = async (e) => {
		e.preventDefault();

		const data = {
			email: email,
			otp: otp,
			otpType: "passwordReset"
		}

		try {
			const url = "http://localhost:4000/api/auth/verify-otp";
			const response = await axios.post(url, data);

			if(response.data.status === "success"){

				/** Setting the appropriate message to user's click action */
				setResetMessage("OTP validated");

				/** Wait for 2 seconds before rendering the other component */
				setTimeout(() => {
					setIsOtpValidated(true);
				}, 2000);
			}
			else{
				setResetMessage("Invalid OTP provided");
			}
		}
		catch{
			console.log("Something went wrong at server side");
			setResetMessage("Something went wrong");
		}
	}

	/** Function to handle things when user submits the new password */
	const handleResetSubmit = async (e) => {
		e.preventDefault();

		const data = {
			email: email,
			newPassword: password,
		}

		try{
			const url = "http://localhost:4000/api/auth/reset-password";
			const response = await axios.post(url, data);

			if(response.data.status === "success"){
				/** Setting the appropriate message to user's click action */
				setResetMessage("Password reset successful. Login to continue");

				/** Wait for 2 seconds before rendering the other component */
				setTimeout(() => {
					setContext({...context, isForgotPasswordModalOpen: false, isLoginModalOpen: false});
				}, 2000);
			}
		}
		catch(error){
			console.log("Error resetting the password");
			setResetMessage("Error resetting the password");
		}
	}

	/** Function to handle things when user clicks the RESENT OTP button */
	const handleResendOtp = async () => {
		const data = {
			email: email,
			otpType: "passwordReset"
		};

		try {
			const url = "http://localhost:4000/api/auth/resend-otp";
			const response = await axios.post(url, data);

			if (response.data.status === "success") {
				setResetMessage("New OTP sent. Please check your email");

				/** Reset the OTP expiry timer to 2 minutes */
				setTimer(120);
			}
		}
		catch (error) {
			console.log("Error sending OTP");
			console.log(error);
		}
	};

	/** Function to handle the expiry timer */
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
	}, [timer]);		// eslint-disable-line



	/** Function to handle things when user clicks the CLOSE button in forgot password modal */
	const handleModalClose = () => {
		console.log("Forgot password Modal Closed")
		setContext({...context, isForgotPasswordModalOpen: false, isLoginModalOpen: false});
	};

	return (
		<div className="modal">
			<div className="modal--content">
				<div className="head"></div>
				<Button className="close__" onClick={() => handleModalClose()}>&times;</Button>

				<h2>Passowrd Reset</h2>

				{/* Render email field for the first time */}
				{!isMailSent && !isOtpValidated && ( <>
					<form onSubmit={handleSubmit}>
						<label>Email :- </label>
						<input
							type="email"
							name="email"
							value={email}
							placeholder="Enter your registered email"
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<br/>
						<button type="submit">Send OTP</button>
					</form>
					</>
				)}

				{/* When mail is send, render the OTP input field */}
				{isMailSent && !isOtpValidated && (
					<>
						<form onSubmit={handleOtpSubmit}>
							<label>OTP:</label>
							<input
								type="text"
								name="otp"
								value={otp}
								placeholder="Enter the OTP"
								onChange={(e) => setOtp(e.target.value)}
								required
							/>
							<br/>
							<button type="submit">Validate OTP</button>
						</form>
						<div>
							{timer === 0 ? (
								<button type="submit" onClick={handleResendOtp}>Resend OTP</button>
							) : (
								<p>Resend OTP in {timer} seconds</p>
							)}
						</div>
					</>
				)}

				{/* When OTP is validated, render the new password form */}
				{isOtpValidated && (<>
					<form onSubmit={handleResetSubmit}>
						<label>New Password:</label>
						<input
							type="password"
							name="password"
							value={password}
							placeholder="Enter your new password"
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<br/>
						<label>Confirm Password:</label>
						<input
							type="password"
							name="confirmPassword"
							value={confirmPassword}
							placeholder="Confirm your new password"
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
						<br/>
						<button type="submit">Reset Password</button>
					</form></>
				)}

				{/* Render the action messages to user */}
				<div>
					<h2>{resetMessage}</h2>
				</div>
			</div>
		</div>
	);
};

export default ForgotPasswordModal;