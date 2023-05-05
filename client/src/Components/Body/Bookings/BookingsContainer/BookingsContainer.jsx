import React, {useState, useEffect, useContext} from 'react'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import './BookingsContainer.css';
import BookingCard from '../BookingCard/BookingCard.jsx';

import { AppContext } from '../../../../AppContext.js';


function BookingsContainer() {

	const { context, setContext } = useContext(AppContext);

	const [bookings, setBookings] = useState([]);

	/** As soon as we have the userId, fetch all the bookings under that UserId */
	useEffect(() => {
		const userId = context.userId;
		console.log("The user id is = " + userId);

		const url = `http://localhost:4000/api/user/bookings/${userId}`;

		axios.get(url, {withCredentials: true})
		.then((response) => {

			/** Check if token is expired */
			if(response.data.status === "failure" && response.data.message === "Tokens Expired"){
				alert("Session Expired. Please Login Again");
				setContext({...context, isLoggedIn: false});
			}
			else /** Check if we received a valid response */
			if(response.data.status === "success"){
				console.log("Successfully fetched bookings");
				setBookings(response.data.userBookings);
			}
			else{
				console.log("Faild to fetch bookings");
			}
		})
		.catch((error) => {
			console.log("Faild to fetch bookings");
		})
	}, [context.userId]);  // eslint-disable-line


	return (
		<div className='bookings-card-container'>
			{bookings.map((booking) => (
				booking.cancellationStatus !== "approved" && (
				<BookingCard
					key={uuidv4()}
					bookingData = {booking}
				/>)
				))
			}
		</div>
	)
}

export default BookingsContainer;