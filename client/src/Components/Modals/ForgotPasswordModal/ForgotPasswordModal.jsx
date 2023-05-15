import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import Button 		from "../../UI/Buttons/Button";
import {AppContext}	from '../../../AppContext.js'
import "./ForgotPasswordModal.css";


const ForgotPasswordModal = () => {

	const { context, setContext, resetContext } = useContext(AppContext);

	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [resetMessage, setResetMessage] = useState("");

	/** To store the state, if reset email is sent */
	const [isMailSent, setIsMailSent] = useState(false);

	/** To store the OTP expiry timer */
	const [otpTimer, setOtpTimer] = useState(0);

	/** To store the reset window expiry timer */
	const [resetWindowTimer, setResetWindowTimer] = useState(0);

	/** To store the state if the user has validated the OTP */
	const [isOtpValidated, setIsOtpValidated] = useState(false);


	/** Function to handle things when user clicks FORGOT PASSWORD button */
	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = {
			email: email,
		};

		try {
			const url = `${window.location.protocol}//${window.location.hostname}:4000/api/auth/forgot-password`;
			const response = await axios.post(url ,data);

			if(response.data.status === "failure" && response.data.msg === "Tokens Expired"){
				alert("Session Expired. Please Login Again");
				resetContext();
			}
			else
			if(response.data.status === "success"){

				/** Setting the appropriate message to user's click action */
				setResetMessage("OTP sent to registered email");
				/** Wait for 2 seconds before rendering the other component */
				setTimeout(() => {
					setIsMailSent(true);
					setOtpTimer(120);
				}, 2000);
			}
			if(response.data.status === "failure" && response.data.msg === "Invalid request body"){
				console.log("Clearing old access tokens....");
				setResetMessage("Exisiting tokens cleared. Please try again");
			}
			else
			if(response.data.status === "failure" && response.data.msg === "Invalid details"){
				setResetMessage("Invalid email or user does not exist");
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
				setResetMessage("Invalid email or user does not exist");
			}
		}
	};


	/** Function to be executed when user submits an OTP */
	const handleOtpSubmit = async (e) => {
		e.preventDefault();
		const data = {
			email: email,
			otp: otp,
			otpType: "passwordReset"
		}

		try {
			const url = `${window.location.protocol}//${window.location.hostname}:4000/api/auth/verify-otp`;
			const response = await axios.post(url, data);

			if(response.data.status === "success"){

				/** Setting the appropriate message to user's click action */
				setResetMessage("OTP validated");

				/** Wait for 2 seconds before rendering the other component */
				setTimeout(() => {
					setOtpTimer(0);
					setResetWindowTimer(120);
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
			const url = `${window.location.protocol}//${window.location.hostname}:4000/api/auth/forgot-password`;
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
				console.log("Error resetting the password");
				setResetMessage("Error resetting the password");
			}
		}
	}

	/** Function to handle things when user clicks the RESENT OTP button */
	const handleResendOtp = async () => {
		const data = {
			email: email,
			otpType: "passwordReset"
		};

		try {
			const url = `${window.location.protocol}//${window.location.hostname}:4000/api/auth/resend-otp`;
			const response = await axios.post(url, data);

			if (response.data.status === "success") {
				setResetMessage("New OTP sent. Please check your email");

				/** Reset the OTP expiry timer to 2 minutes */
				setOtpTimer(120);
				setResetWindowTimer(0);
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
				console.log("Error sending OTP");
				console.log(error);

			}
		}
	};

	const executeLogout = async () => {
		const data = {
			email: email
		}
		try{
			const url = `${window.location.protocol}//${window.location.hostname}:4000/api/auth/logout`;
			const response = await axios.post(url, data, {withCredentials: true});

			return response.data.status;
		}
		catch(error){
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
				console.log(error)
				console.log("Error logging out");
			}
		}
	}

	/** Function to handle things when user clicks the CLOSE button in forgot password modal */
	const handleModalClose = async () => {
		console.log("Forgot password Modal Closed")
		if(isOtpValidated === true){
			const logoutResult = await executeLogout();
			if(logoutResult === "success")
				setContext({...context, isForgotPasswordModalOpen: false, isLoginModalOpen: false});
			else{
				console.log(logoutResult);
				setResetMessage("Error logging out");
			}
		}
		else
			setContext({...context, isForgotPasswordModalOpen: false, isLoginModalOpen: false});
	};

	/** Function to clear reset message in 2 seconds after it is displayed */
	useEffect(() => {
		if(resetMessage !== ""){
			setTimeout(() => {
				setResetMessage("");
			}, 2000);
		}
	}, [resetMessage]);


	/** Function to handle the expiry timer */
	const handleCountdown = () => {
		/** Decrease timer count by 1, each second */
		console.log("OTP Timer: ", otpTimer);
		if (otpTimer > 0) {
			setTimeout(() => {
				console.log("reducing....");
				setOtpTimer(otpTimer - 1);
			}, 1000);
		}
	};

	useEffect(() => {
		handleCountdown();
	}, [otpTimer]);		// eslint-disable-line


	const handleResetWindowCountdown = () => {
		/** Decrease timer count by 1, each second */
		if (resetWindowTimer > 0) {
			setTimeout(() => {
				setResetWindowTimer(resetWindowTimer - 1);
			}, 1000);
		}
	};

	useEffect(() => {
		handleResetWindowCountdown();
	}, [resetWindowTimer]);		// eslint-disable-line


	const handleRestartClick = () => {
		const logoutResult = executeLogout();
		if(logoutResult === "success")
			console.log("User logged out successfully");
		else
			console.log("Error logging out");
		setIsOtpValidated(false);
		setIsMailSent(false);
	}

	return (
		<div className="modal_1">
			<div className="modal--content_">
				<div className="head"></div>
				<Button className="close__" onClick={() => handleModalClose()}>&times;</Button>

				<h2>Password Reset</h2>

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
							{otpTimer !== 0 && (<button type="submit">Validate OTP</button>)}
						</form>
						<div>
							{otpTimer === 0 ? (
								<button type="submit" onClick={handleResendOtp}>Resend OTP</button>
							) : (
								<p>Resend OTP in {otpTimer} seconds</p>
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
					</form>
					<div>
						{resetWindowTimer === 0 ? (<>
							<p> Password change window expired. Please restart the process</p>
							<button type="button" onClick={handleRestartClick}>Restart</button></>
						) : (
							<p>Password change window will become invalid in {resetWindowTimer} seconds</p>
						)}
					</div></>
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