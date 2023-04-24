import "./LoginModal.css";

import React, { useState, useContext } from "react";
import axios from "axios";
import {AppContext} from '../../../AppContext.js'
import Button from "../../UI/Buttons/Button";
import logo from '../../UI/Images/profile.png'
const LoginModal = () => {

	const { context, setContext } = useContext(AppContext);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isAdmin, setIsAdmin] = useState(false);

	const [loginMessage, setLoginMessage] = useState("");

	const handleLoginSubmit = async (e) => {
		e.preventDefault();

		const data = {
			email: email,
			password: password,
			isAdmin: isAdmin.toString()
		};

		console.log(data);
		try {
			const response = await axios.post(
				"http://localhost:4000/api/auth/login",
				data
			);

			console.log(response.data);
			setLoginMessage("Login Successful");

			/** Wait for 2 seconds and then close the login modal */
			setTimeout(() => {

				setContext({...context, isLoggedIn: true, isLoginModalOpen: false,
					isUserAdmin: isAdmin, userEmail: email, userId: response.data.userId})
			}, 2000);
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
			<div className="header"></div>
				<Button className="close" onClick={() => handleModalClose()}>&times;</Button>
			  <div className="login">	
				<img src={logo} alt="Login Image here" className="image"/>

				<form onSubmit={handleLoginSubmit}>
					<div className="control">
                   <label>Email:</label>
					<input
						type="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					</div>
                    <div className="control">
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
				<div className="message"> {loginMessage} </div>
			<div className="footer"></div>
			</div>
			</div>
		</div>
	);
};
export default LoginModal;