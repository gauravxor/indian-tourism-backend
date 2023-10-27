import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';

import UserProfileEdit	from './UserProfileEdit.jsx';
import { AppContext }	from '../../../AppContext.js'
import './UserProfile.css';
import Button from '../../UI/Buttons/Button.jsx';

const getDayOfMonthSuffix = (dayOfMonth) => {

	if(dayOfMonth >= 11 && dayOfMonth <= 13) {
		return 'th';
	}
	switch (dayOfMonth % 10) {
		case 1: return 'st';
		case 2: return 'nd';
		case 3: return 'rd';
		default: return 'th';
	}
}

const formatDate = (dateStr) => {

	const date = new Date(dateStr);
	const options = {month: 'long', year: 'numeric' };
	const formattedDate = date.toLocaleDateString('en-US', options);
	const dayOfMonth = date.getDate();
	const suffix = getDayOfMonthSuffix(dayOfMonth);
	const finalResult = `${dayOfMonth}${suffix} ${formattedDate}`;
	return finalResult;
}


const UserProfile = () => {

	console.log("Component UserProfile rendered");
    // eslint-disable-next-line
	const { context, setContext, resetContext } = useContext(AppContext);

	const [userDetails, setUserDetails] = useState({});

	/** If user want to edit their profile */
	const [inEditableMode, setInEditableMode] = useState(false);

	/** Fetch the user details as soon as the component is mounted */
	useEffect(() => {
		console.log("The context user id is " + context.userId);
		const url = `${window.location.protocol}//${window.location.hostname}:4000/api/user/details/${context.userId}`;

		/** Calling the API to fetch the user data */
		axios
		.get(url, { withCredentials: true })
		.then((response) => {
			if(response.data.status === "failure" && response.data.msg === "Tokens Expired"){
				alert("Session Expired. Please Login Again");
				resetContext();
			}
			else
			if (response.data.status === "success") {
				console.log("User details fetched successfully");
				console.log("The response data is: " + JSON.stringify(response.data));
				setUserDetails(response.data.userData);
				console.log("User details are: " + JSON.stringify(userDetails));
			}
			else {
				console.log("Error fetching user details");
			}
		})
		.catch((error) => {
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
				console.log("Error fetching user details");
			}
		})
	},[context.userId]);  //eslint-disable-line


	useEffect(() => {
		console.log("The user details are: " + JSON.stringify(userDetails));
	}, [userDetails]);

	/** If userId is emptry in context, then the user is not logged in, hence display appropriate message */
	if (context.userId === "") {
		return (
			<div>
				<h1> You must be logged in to view this page </h1>
			</div>
		)
	}
	else  /** If userDetails are are fetched successfully, only then render the component */
	if (Object.keys(userDetails).length !== 0){
		return (<>
			{/* If the state of inEditableMode is false, then display the user details, else display the edit form */}
			{!inEditableMode ? (
				<div className="user-details">
					<div className="user-image">
						<img src={`${window.location.protocol}//${window.location.hostname}:4000${userDetails.userImageURL}`} alt="User-profile" />
					</div>
					<div className="user-info">
						<div className="name">
							{userDetails.name.firstName} {userDetails.name.middleName} {userDetails.name.lastName}
						</div>
						<div className="contact">
							📱 <b>Phone :</b>	 {userDetails.contact.phone} <br />
							📧 <b>Email :</b>	 {userDetails.contact.email}
						</div>
						<div className="address">
							🏠 <b>Address :</b> {userDetails.address.addressMain}, {userDetails.address.city}, {userDetails.address.state},{" "}
							{userDetails.address.country} - {userDetails.address.pincode}
						</div>
						<div className="additional-info">
							{!(context.isUserAdmin) && (<div>📫 <b>Email Verified :</b> {userDetails.isEmailVerified ? "Yes ✅" : "No ❌"}</div>)}
							{!(context.isUserAdmin) && (<div>💰 <b>Wallet Balance :</b> Rs. {userDetails.walletBalance}</div>)}
							<div>🎂 <b>Date of Birth :</b> {formatDate(userDetails.dob)}</div>
							{!(context.isUserAdmin) && (<div>🔖 <b>Total Bookings :</b> {userDetails.bookingCount}</div>)}
							{(context.isuserAdmin) && (<div>🌏 <b>Total Locations :</b> {userDetails.locationCount} </div>)}
						</div>
						<div className="edit-button">
							<Button onClick={() => setInEditableMode(true)}>Edit</Button>
						</div>
					</div>
				</div>
			) : (
				/** Displaying the edit form */
				<UserProfileEdit userDetails={userDetails} setInEditableMode={setInEditableMode} />
			)}
		</>
		)
	}
}

export default UserProfile;
