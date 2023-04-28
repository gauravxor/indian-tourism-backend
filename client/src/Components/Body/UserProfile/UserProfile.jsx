import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../../AppContext.js'
import './UserProfile.css';
import UserProfileEdit from './UserProfileEdit.jsx';


const UserProfile = () => {

	//eslint-disable-next-line
	const { context, setContext } = useContext(AppContext);

	const [userDetails, setUserDetails] = useState({});

	/** If user want to edit their profile */
	const [inEditableMode, setInEditableMode] = useState(false);



	useEffect(() => {
		const url = `http://localhost:4000/api/user/details/${context.userId}`;

		axios
		.get(url, { withCredentials: true })
		.then((response) => {
			if (response.data.status === "success") {
				setUserDetails(response.data.userData);
				console.log(JSON.stringify(userDetails));
			}
			else {
				console.log("Error fetching user details");
			}
		})
		.catch((error) => {
			console.log(error);
			console.log("Error fetching user details");
		})
	},[context.userId]);  //eslint-disable-line


	useEffect(() => {
		console.log("User details: " + JSON.stringify(userDetails));
	}, [userDetails]);


	if (context.userId === "") {
		return (
			<div>
				<h1> You must be logged in to view this page </h1>
			</div>
		)
	}
	else
	if (Object.keys(userDetails).length !== 0){
		return (<>
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
				<UserProfileEdit userDetails={userDetails} setInEditableMode={setInEditableMode} />
			)}
		</>
		)
	}
}

export default UserProfile;
