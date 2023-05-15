import React, { createContext, useState, useEffect } from 'react';


const AppContext = createContext();
const LOCAL_STORAGE_KEY = "app-context";


const AppContextProvider = ({ children }) => {

	const [context, setContext] = useState(() => {

		const storedContext = localStorage.getItem(LOCAL_STORAGE_KEY);
		return storedContext ? JSON.parse(storedContext) : {
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
			isVerified: false,

			//Slideshow state
            isSlideShow: false,

			// context state variables
			showMainBody: true,
			isLoginModalOpen: false,
			isSignUpModalOpen: false,
			isOtpModalOpen: false,
			isAddLocationModalOpen: false,
			isForgotPasswordModalOpen: false,
			isPaymentModalOpen: false,
		}
	});

	// Save context state in local storage whenever it changes
	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(context));
	},[context]);

	// eslint-disable-next-line
	const resetContext = () => {
        setContext({
			userEmail: "",
            userId: "",
            isUserAdmin: false,
            locationId: "",
            bookingId: "",
            paymentId: "",
            tempBookingId: "",
            searchText: "",
            errorMessage: "",
            // user state variables
            isLoggedIn: false,
            isVerified: false,
            //Slideshow state
            isSlideShow: false,
            // context state variables
            showMainBody: true,
            isLoginModalOpen: false,
            isSignUpModalOpen: false,
            isOtpModalOpen: false,
            isAddLocationModalOpen: false,
            isForgotPasswordModalOpen: false,
            isPaymentModalOpen: false,
        });
    };

	return (
		<AppContext.Provider value={{ context, setContext, resetContext }}>
			{children}
		</AppContext.Provider>
	);
};

export { AppContext, AppContextProvider };