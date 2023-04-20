import React, { createContext, useState } from 'react';


const AppContext = createContext();

const AppContextProvider = ({ children }) => {
	const [context, setContext] = useState({
		userId: "",
		userEmail: "",
		isUserAdmin: false,
		locationId: "",
		bookingId: "",
		paymentId: "",
		tempBookingId: "",
		searchText: "",
		errorMessage: "",

		// user state variables
		isLoggedIn: false,

		// context event variables
		isHamburgerVisible: false, // hamburger menu
		isProfileClicked: false,   // user profile section
		isBookingsClicked: false,  // user bookings section
		isLocationClicked: false, // details of a location
		isSearchClicked: false,    // search button click

		// context state variables
		showMainBody: true,
		isLoginModalOpen: false,
		isSignUpModalOpen: false,
		isAddLocationModalOpen: false,
	});

	return (
		<AppContext.Provider value={{ context, setContext }}>
			{children}
		</AppContext.Provider>
	);
};

export { AppContext, AppContextProvider };