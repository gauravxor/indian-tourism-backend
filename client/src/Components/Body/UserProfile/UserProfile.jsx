import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';

import UserProfileEdit	from './UserProfileEdit.jsx';
import { AppContext }	from '../../../AppContext.js'
import './UserProfile.css';


const UserProfile = () => {

	console.log("Component UserProfile rendered");

	const { context, setContext } = useContext(AppContext);

	const [userDetails, setUserDetails] = useState({});

	/** If user want to edit their profile */
	const [inEditableMode, setInEditableMode] = useState(false);

	/** Fetch the user details as soon as the component is mounted */
	useEffect(() => {
		console.log("The context user id is " + context.userId);
		const url = `http://localhost:4000/api/user/details/${context.userId}`;

		/** Calling the API to fetch the user data */
		axios
		.get(url, { withCredentials: true })
		.then((response) => {
			if(response.data.status === "failure" && response.data.msg === "Tokens Expired"){
				alert("Session Expired. Please Login Again");
				setContext({...context, isLoggedIn: false});
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
			console.log("Error fetching user details");
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
						<img src={`http://localhost:4000${userDetails.userImageURL}`} alt="User-profile" />
					</div>
					<div className="user-info">
						<div className="name">
							{userDetails.name.firstName} {userDetails.name.middleName} {userDetails.name.lastName}
						</div>
						<div className="contact">
							📱Phone: {userDetails.contact.phone} <br />
							📧Email: {userDetails.contact.email}
						</div>
						<div className="address">
							🏠{userDetails.address.addressMain}, {userDetails.address.city}, {userDetails.address.state},{" "}
							{userDetails.address.country} - {userDetails.address.pincode}
						</div>
						<div className="additional-info">
							<div>Email Verified: {userDetails.isEmailVerified ? "Yes ✔️" : "No ❎"}</div>
							<div>🪙Wallet Balance: {userDetails.walletBalance}</div>
							<div>🎂Date of Birth: {userDetails.dob}</div>
							<div>📅Created At: {userDetails.createdAt}</div>
							<div>✅Updated At: {userDetails.updatedAt}</div>


							{!(context.isUserAdmin) && (<>
								<div>🔖Booking Count: {userDetails.bookingCount}</div>
								<div>
									🎫Bookings: {userDetails.bookings.map((booking) => (
										<span key={booking.bookingId}>{booking.bookingId}, </span>))}
								</div>
								</>
							)}
						</div>
						<div className="edit-button">
							<button onClick={() => setInEditableMode(true)}>Edit</button>
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
