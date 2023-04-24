import "./ForgotPasswordModal.css";

import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import {AppContext} from '../../../AppContext.js'
import Button from "../../UI/Buttons/Button";

const ForgotPasswordModal = () => {

	const { context, setContext } = useContext(AppContext);

	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [isMailSent, setIsMailSent] = useState(false);
	const [timer, setTimer] = useState(120);

	const [isOtpValidated, setIsOtpValidated] = useState(false);

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");


	const [resetMessage, setResetMessage] = useState("");


	// this will handle when user first sends out the request to reset the password
	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = {
			email: email,
		};

		console.log(data);
		try {
			const response = await axios.post("http://localhost:4000/api/auth/forgot-password",data);
			console.log(response.data);

			if(response.data.status === "success"){
				setResetMessage("OTP send to the email");

				// wait 2 second and update the state var to render the next form
				setTimeout(() => {
					setIsMailSent(true);
				}, 2000);
			}
			else{
				setResetMessage("User does not exist");
			}
		}
		catch (error) {
			console.log("Error sending OTP");
			setResetMessage("Invalid email or user does not exist");
		}
	};

	// this will handle when user submits the OTP
	const handleOtpSubmit = async (e) => {
		e.preventDefault();
		const data = {
			email: email,
			otp: otp,
			otpType: "passwordReset"
		}

		console.log(data);

		try {
			const response = await axios.post("http://localhost:4000/api/auth/verify-otp",data);
			console.log(response.data);

			if(response.data.status === "success"){
				setResetMessage("OTP validated");

				setTimeout(() => {
					setIsOtpValidated(true);
				}, 2000);
			}
			else{
				setResetMessage("Invalid OTP or OTP expired");
			}
		}
		catch{
			console.log("Something went wrong at server side");
			setResetMessage("Something went wrong");
		}
	}

	// this will handle when user submits the new password
	const handleResetSubmit = async (e) => {
		e.preventDefault();

		const data = {
			email: email,
			newPassword: password,
		}

		console.log(data);

		try{
			const response = await axios.post("http://localhost:4000/api/auth/forgot-password",data);
			console.log(response.data);
			if(response.data.status === "success"){
				setResetMessage("Password reset successful, please login");
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

	// handle the resend otp button
	const handleResendOtp = async () => {
		const data = {
			email: email,
			otpType: "passwordReset"
		};

		console.log(data);

		try {
			const response = await axios.post("http://localhost:4000/api/auth/resend-otp", data);
			console.log(response.data);
			if (response.data.status === "success") {
				setResetMessage("New OTP sent");
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

				{/* OTP FORM */}
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

				{isOtpValidated && (
					<>
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
						</>
				)}
				<div>
					<h2>{resetMessage}</h2>
				</div>
			</div>
		</div>
	);
};

export default ForgotPasswordModal;