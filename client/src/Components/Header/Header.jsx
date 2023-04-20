import "./Header.css";

// eslint-disable-next-line
import React, { useContext, useState, useEffect } from 'react';
import LoginModal from "../Modals/LoginModal/LoginModal";
import SignUpModal from "../Modals/SignUpModal/SignUpModal";

import {AppContext} from '../../AppContext.js';

import axios from "axios";
const Header = ( ) => {

	const { context, setContext } = useContext(AppContext);

	const { isLoggedIn, isLoginModalOpen, isSignUpModalOpen } = context;

	const [searchTxt, setSearchTxt] = useState("");

	const handleLogoutClick = async () => {
		console.log("Logout Clicked");

		// data to be sent to the server
		const data = {
			userEmail: "connect2gaurav15@gmail.com",
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
				isHamburgerCliked: false,
				showMainBody: true
			});
		}
		catch (error) {
			console.error(error);
		}
	}

	const handleSearchClicked = () => {
		console.log("Search Clicked, re-rendering the main body");
		setContext({ ...context, searchText: searchTxt, isSearchClicked: true});
	}

	const handleLoginClicked = () => {
		console.log("Login Clicked");
		setContext({ ...context, isLoginModalOpen: true, isHamburgerVisible: false });
	}

	const handleSignUpClicked = () => {
		console.log("Signup Clicked");
		setContext({ ...context, isSignUpModalOpen: true, isHamburgerVisible: false });
	}

	const handleHamburgetClick = () => {
		console.log("Hamburger Clicked");
		if(context.isHamburgerVisible)
			setContext({ ...context, isHamburgerVisible: false });
		else
			setContext({ ...context, isHamburgerVisible: true });
	}


    return (
        <div className="landing-page">

			{/* Site Logo Container */}
            <div className="site-logo">
                <img src={process.env.PUBLIC_URL + "/res/icons/site-icon.png"} alt="Site Logo" />
            </div>

			{/* Search Bar Container */}
            <div className="search-bar">
  				<input type="text" placeholder="Search for amusement parks and locations"
    				value={searchTxt} onChange={(e) => setSearchTxt(e.target.value)} />
  				<button onClick={() => handleSearchClicked()}>Search</button>
			</div>


			{/* Hamburger Menu Container */}
            <div className="user-profile" onClick={() => handleHamburgetClick()}>
                <img src={process.env.PUBLIC_URL + "/res/icons/default-user.jpg"} alt="User Profile" />
			</div>


			{context.isHamburgerVisible && (
				<div className="dropdown-menu">
					<ul>
						{!isLoggedIn && <li> <button onClick={() => handleLoginClicked()}> Login </button> </li>}
						{!isLoggedIn && <li> <button onClick={() => handleSignUpClicked()}> Signup </button> </li>}


						{isLoggedIn && <li> <button> Profile </button> </li>}
						{isLoggedIn && <li> <button> Bookings </button> </li>}
						{isLoggedIn && <li> <button> Cancellations </button> </li>}
						{isLoggedIn && <li> <button onClick={handleLogoutClick}> Logout </button> </li>}


					</ul>
				</div>)
			}
			{isLoginModalOpen && <LoginModal/>}
			{isSignUpModalOpen && <SignUpModal/>}
		</div>
	);
};

export default Header;