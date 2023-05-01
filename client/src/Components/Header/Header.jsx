import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ForgotPasswordModal 	from "../Modals/ForgotPasswordModal/ForgotPasswordModal";
import LoginModal			from "../Modals/LoginModal/LoginModal";
import SignUpModal			from "../Modals/SignUpModal/SignUpModal";
import OtpModal				from "../Modals/OtpModal/OtpModal";
import Button				from "../UI/Buttons/Button";

import {AppContext}			from '../../AppContext.js';
import "./Header.css";

import axios from "axios";

const Header = ( ) => {


	const navigate = useNavigate();

	const { context, setContext } = useContext(AppContext);

	const { isLoggedIn, isUserAdmin} = context;
	const { isLoginModalOpen, isSignUpModalOpen, isOtpModalOpen, isForgotPasswordModalOpen } = context;

	const [searchText, setSearchText] = useState("");
	const [searchPlaceholder, setSearchPlaceholder] = useState("Search for locations");

	/** Function to handle things when user clicks the logout button */
	const handleLogoutClick = async () => {
		console.log("Logout Clicked");

		/** Data to be sent to the server */
		const data = {
			userEmail: context.userEmail,
		}

		try {
			const url = "http://localhost:4000/api/auth/logout";

			/** Calling the Logout API */
			const response = await axios.post(url, data, { withCredentials: true });
			console.log(response.data);

			/** Since user is logging out, so reset the context variables */
			setContext({ ...context,
				isLoggedIn: false,
				isUserAdmin: false,
				showMainBody: true,
				userEmail: "",
				isVerified: false,
			});
		}
		catch (error) {
			console.error(error);
		}
	}

	/** Function to handle things when user clicks the SEARCH button */
	const handleSearchClicked = (event) => {
		event.preventDefault()
		console.log("Search button clicked");

		if(searchText === ""){
			console.log("Empty search text");
			setSearchPlaceholder("Enter a valid search text");
		}
		else{
			setContext({ ...context, searchText: searchText});
			navigate("/locations");  /** Navigate the user to {locations} route */
		}
	}

	/** Function to handle things when user clicks the LOGIN button */
	const handleLoginClicked = () => {
		console.log("Login button clicked");
		setContext({ ...context, isLoginModalOpen: true});
	}

	/** Function to handle things when user clicks the SIGNUP button */
	const handleSignUpClicked = () => {
		console.log("Signup Clicked");
		setContext({ ...context, isSignUpModalOpen: true});
	}

	return (
		<div className="navbar-container">
			<nav className="navbar">
				{/* The site logo container */}
				<div className="site-logo">
					<Link to="/">
					<img src={process.env.PUBLIC_URL + "/res/icons/site-icon.png"} href="/" alt="Site Logo" />
					</Link>
				</div>

				{/* The navbar links container */}
				<div className="navbar-links">

					{isLoggedIn && !isUserAdmin && (<>
						<Link to="/">Home</Link>
						<Link to="/profile">Profile</Link>
						<Link to="/bookings">Bookings</Link>
						<Link to="/about">About</Link>
						</>
					)}

					{isLoggedIn && isUserAdmin && (<>
						<Link to="/">Home</Link>
						<Link to="/profile">Profile</Link>
						<Link to="/locations">Locations</Link>
						<Link to="/add-location">Add Location</Link>
						<Link to="/cancellations">Cancellations</Link>
						<Link to="/about">About</Link>
						</>
					)}

					{!isLoggedIn && (<>
						<Link to="/">Home</Link>
						<Link to="/locations">Locations</Link>
						<Link to="/about">About</Link>
						</>
					)}
				</div>

				{/* The search bar container */}
				<form className="navbar-search">
					<input type="text" placeholder={searchPlaceholder}
						value={searchText} onChange={(e) => setSearchText(e.target.value)} />
					<Button onClick = {handleSearchClicked}> Search </Button>
				</form>

				<div className="navbar-buttons">
					{context.isLoggedIn && (
						<Button onClick = {() => handleLogoutClick()}>Logout</Button>
					)}
					{!context.isLoggedIn && ( <>
						<Button onClick = {() => handleLoginClicked()}>Login</Button>
						<Button onClick = {() => handleSignUpClicked()}>Signup</Button>
						</>
					)}
				</div>
			</nav>

			{isLoginModalOpen && <LoginModal/>}
			{isSignUpModalOpen && <SignUpModal/>}
			{isOtpModalOpen && <OtpModal/>}
			{isForgotPasswordModalOpen && <ForgotPasswordModal/>}
		</div>
	);
};

export default Header;