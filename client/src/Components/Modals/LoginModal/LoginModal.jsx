import React, { useState, useContext } from "react";
import axios from "axios";

import Button		from "../../UI/Buttons/Button";
import logo			from '../../UI/Images/profile.png'

import {AppContext}	from '../../../AppContext.js'
import "./LoginModal.css";

const resendOtp = async (userEmail) => {

	const data = {
		email: userEmail,
		otpType: "emailVerification"
	};
	console.log(data);

	try {
		const response = await axios.post("http://localhost:4000/api/auth/resend-otp", data);
		console.log(response.data);
		return response.data.status
	}
	catch (error) {
		console.log(error);
	}
};


const LoginModal = () => {

	const { context, setContext } = useContext(AppContext);

	/** To store the user login email id */
	const [email, setEmail] = useState("");

	/** To store the user login password */
	const [password, setPassword] = useState("");

	/** To store if the user is admin or not */
	const [isAdmin, setIsAdmin] = useState(false);

	/** To store the login message to be displayed to user */
	const [loginMessage, setLoginMessage] = useState("");

	/** Function to handle things when user clicks the SUBMIT button in login form */
	const handleLoginSubmit = async (e) => {
		e.preventDefault();

		const data = {
			email: email,
			password: password,
			isAdmin: isAdmin.toString()
		};

		try {
			const url = "http://localhost:4000/api/auth/login";
			const response = await axios.post(url, data);
			if(response.data.status === "failure" && response.data.msg === "Tokens Expired"){
				alert("Session Expired. Please Login Again");
				setContext({...context, isLoggedIn: false});
			}
			else
			if(response.data.status === "success"){
				setLoginMessage("Login Successful");

				/** Wait for 2 seconds and then close the login modal */
				setTimeout(() => {
					setContext({...context, isLoggedIn: true, isLoginModalOpen: false,
						isUserAdmin: isAdmin, userEmail: email, userId: response.data.userId})
				}, 2000);
			}
			else  /** If the user is having a duplicate session */
			if(response.data.msg === "Duplicate Session"){
				setLoginMessage("Existing session found. Please Logout to continue.");

				setTimeout(() => {
					setContext({...context, isLoggedIn: true, isLoginModalOpen: false,
						isUserAdmin: isAdmin, userEmail: email, userId: response.data.userId})
				}, 2000);

			}
			else /** If the user has not verified the email yet */
			if(response.data.msg === "Email not verified"){
				setLoginMessage("Email not verified. Please verify your email to continue.");
				const isOtpResent = await resendOtp(email);
				if(isOtpResent === "success"){
					console.log("OTP resent successfully");
					console.log("User id is: " + JSON.stringify(response.data));
					setContext({ ...context, isLoggedIn: false, isUserAdmin: isAdmin, userEmail: email,
						userId: response.data.userId, isOtpModalOpen: true, isLoginModalOpen: false});
				}
			}
			else{
				setLoginMessage("Invalid Credentials or user does not exist");
			}
		}
		catch (error) {
			console.log("Error in login");
			setLoginMessage("Invalid Credentials or user does not exist");
		}
	};

	const handleModalClose = () => {
		console.log("Login Modal Closed")
		setContext({...context, isLoginModalOpen: false});
	};


	const handlePasswordReset = () => {
		console.log("Password Reset Clicked");
		setContext({...context, isForgotPasswordModalOpen: true, isLoginModalOpen: false});
	};

	return (
		<div className="modal">
			<div className="modal_content">
				<Button className="close" onClick={() => handleModalClose()}>&times;</Button>

				<div className="login">
					<img src={logo} alt="dummy img" className="image"/>
					<form onSubmit={handleLoginSubmit}>

						<div className="control">
							<label>Email Id:</label>
							<input
								type="email"
								name="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>

							<label>Password:</label>
							<input
								type="password"
								name="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<div className="checkbox">
							<label>Is Admin:</label><br/>
							<input
								type="checkbox"
								name="isAdmin"
								className="isadmin"
								value={isAdmin}
								onChange={(e) => setIsAdmin(e.target.checked)}
							/>
						</div>

						<div className="actions">
							<Button type="submit">Login</Button>
						</div>
					</form>
					<Button type="button" onClick={() => handlePasswordReset()}>Forgot Password?</Button>

					<div className="message">
						{loginMessage}
					</div>
				</div>
			</div>
		</div>
	);
};
export default LoginModal;