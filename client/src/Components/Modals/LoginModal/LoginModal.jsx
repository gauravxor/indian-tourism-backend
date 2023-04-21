import "./LoginModal.css";

import React, { useState, useContext } from "react";
import axios from "axios";
import {AppContext} from '../../../AppContext.js'


const LoginModal = () => {

	const { context, setContext } = useContext(AppContext);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isAdmin, setIsAdmin] = useState("false");

	const [loginMessage, setLoginMessage] = useState("");

	const handleLoginSubmit = async (e) => {
		e.preventDefault();

		const data = {
			email: email,
			password: password,
			isAdmin: isAdmin,
		};

		console.log(data);
		try {
			const response = await axios.post(
				"http://localhost:4000/api/auth/login",
				data
			);
			console.log(response.data);
			setLoginMessage("Login Successful");

			/** Wait for 2 seconds and then close the lgoin modal */
			setTimeout(() => {
				setContext({...context, isLoggedIn: true, isLoginModalOpen: false,
					isUserAdmin: isAdmin, userEmail: email})
			}, 2000);

		}
		catch (error) {
			console.log("Error in login");
			setLoginMessage("Invalid Credentials or user does not exist");
		}
	};

	const handleModalClose = () => {
		console.log("Login Modal Closed")
		setContext({...context, isLoginModalOpen: false, isHamburgerVisible: false});
	};

	return (
		<div className="modal">
			<div className="modal-content">
				<span className="close" onClick={() => handleModalClose()}>&times;</span>

				<h2>Login</h2>

				<form onSubmit={handleLoginSubmit}>

					<label>Email:</label>
					<input
						type="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<br />

					<label>Password:</label>
					<input
						type="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<br/>

					<label>Is Admin:</label>
					<input
						type="checkbox"
						name="isAdmin"
						value={isAdmin}
						onChange={(e) => setIsAdmin(e.target.checked.toString())}
					/>
					<br/>

					<button type="submit">Login</button>
				</form>
				<div> <h1> {loginMessage} </h1> </div>
			</div>
		</div>
	);
};
export default LoginModal;