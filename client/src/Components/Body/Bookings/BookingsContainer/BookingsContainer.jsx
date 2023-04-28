import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios';

import BookingCard from '../BookingCard/BookingCard.jsx';
import './BookingsContainer.css';

import { AppContext } from '../../../../AppContext.js';

import { v4 as uuidv4 } from 'uuid';


function BookingsContainer() {

	// eslint-disable-next-line
	const { context, setContext } = useContext(AppContext);

	const [bookings, setBookings] = useState([]);

	useEffect(() => {
		console.log("The context is = " + context.userId);
	}, [context.userId]);

	useEffect(() => {
		const userId = context.userId;
		console.log("The context user id is = " + userId);

		const url = `http://localhost:4000/api/user/bookings/${userId}`;

		axios.get(url, {withCredentials: true})
		.then((response) => {
			console.log("The response object is = " + response.data)

			/** Check if we received a valid response */
			if(response.data.status === "success"){
				setBookings(response.data.userBookings);
			}
			else{
				console.log("The response status is not success");
			}
		})
		.catch((error) => {
			console.log("The error is = " + error);
		})
	}, [context.userId]);


	return (
		<div className='bookings-card-container'>
			{bookings.map(booking => (
				<BookingCard
					key={uuidv4()}
					bookingData = {booking}
				/>
				))
			}
		</div>
	)
}

export default BookingsContainer;