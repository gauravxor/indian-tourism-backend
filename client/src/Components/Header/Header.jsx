import "./Header.css";

// eslint-disable-next-line
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from "../Modals/LoginModal/LoginModal";
import SignUpModal from "../Modals/SignUpModal/SignUpModal";
import OtpModal from "../Modals/OtpModal/OtpModal";
import ForgotPasswordModal from "../Modals/ForgotPasswordModal/ForgotPasswordModal";
import Button from "../UI/Buttons/Button";

import {AppContext} from '../../AppContext.js';

import axios from "axios";
const Header = ( ) => {

	const navigate = useNavigate();

	const { context, setContext } = useContext(AppContext);

	const { isLoggedIn, isUserAdmin} = context;
	const { isLoginModalOpen, isSignUpModalOpen, isOtpModalOpen, isForgotPasswordModalOpen } = context;

	const [searchTxt, setSearchTxt] = useState("");
	const [searchPlaceholder, setSearchPlaceholder] = useState("Search for locations");

	const handleLogoutClick = async () => {
		console.log("Logout Clicked");

		// data to be sent to the server
		const data = {
			userEmail: context.userEmail,
		}

		try {
			const response = await axios.post(
				"http://localhost:4000/api/auth/logout",
				data
			);
			console.log(response.data);

			// if user logs out reset the app context
			setContext({ ...context,
				isLoggedIn: false,
				isUserAdmin: false,
				showMainBody: true,
				userEmail: "",
			});
		}
		catch (error) {
			console.error(error);
		}
	}

	const handleSearchClicked = (event) => {
		event.preventDefault()
		console.log("Search Clicked, re-rendering the main body");
		if(searchTxt === ""){
			console.log("Please enter a location");
			setSearchPlaceholder("Please enter a location");
		}
		else{
			setContext({ ...context, searchText: searchTxt});
			navigate("/locations");
		}
	}

	const handleLoginClicked = () => {
		console.log("Login Clicked");
		setContext({ ...context, isLoginModalOpen: true});
	}

	const handleSignUpClicked = () => {
		console.log("Signup Clicked");
		setContext({ ...context, isSignUpModalOpen: true});
	}

	console.log("Is user admin: ", isUserAdmin);
	console.log("Is user admin in type: ", typeof(isUserAdmin));
	return (
		<div className="navbar-container">
			<nav className="navbar">

				<div className="site-logo">
					<img src={process.env.PUBLIC_URL + "/res/icons/site-icon.png"} href="/" alt="Site Logo" />
				</div>

				<div className="navbar-links">

					{isLoggedIn && !isUserAdmin && (<>
						<a href="/">Home</a>
						<a href="/profile">Profile</a>
						<a href="/bookings">Bookings</a>
						<a href="/about">About</a>
						</>
					)}

					{isLoggedIn && isUserAdmin && (<>
						<a href="/">Home</a>
						<a href="/profile">Profile</a>
						<a href="/locations">Locations</a>
						<a href="/add-location">Add Location</a> {/* Implement a modal */}
						<a href="/about">About</a>
						</>
					)}

					{!isLoggedIn && (<>
						<a href="/">Home</a>
						<a href="/locations">Locations</a>
						<a href="/about">About</a>
						</>
					)}
				</div>

				<form className="navbar-search">
					<input type="text" placeholder={searchPlaceholder}
						value={searchTxt} onChange={(e) => setSearchTxt(e.target.value)} />
					<Button onClick = {handleSearchClicked}>Search</Button>
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
			{isForgotPasswordModalOpen && <ForgotPasswordModal/>
			}
		</div>
	);
};

export default Header;