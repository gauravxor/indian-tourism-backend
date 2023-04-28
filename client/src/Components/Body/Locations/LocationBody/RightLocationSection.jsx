import React, {useContext} from 'react'
import axios from 'axios';

import {AppContext} from '../../../../AppContext.js';
import PaymentModal from '../../../Modals/PaymentModal/PaymentModal.jsx';

/** This function takes in a date in ISO format and converts it into in DD-MM-YYYY format */
const formattedDate = (visitDate) => {
	const date = new Date(visitDate);
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const formattedDate = day + "-" + month + "-" + year;

	return formattedDate;
}

const RightLocationSection = (props) => {

	/** To store the number of adults in tickets */
	const [adultCount, setAdultCount] = React.useState(1);

	/** To store the number of children in tickets */
	const [childrenCount, setChildrenCount] = React.useState(0);

	/** To store the visit date */
	const [visitDate, setVisitDate] = React.useState("");

	/** React state to store the booking message that is to be displayed to user */
	const [bookingMessage, setBookingMessage] = React.useState("");

	const {context, setContext} = useContext(AppContext);
	const {isPaymentModalOpen} = context;

	/** Function to handle the thing when user submits a booking requesr */
	const handleBookingFormSubmit = async (event) => {
		event.preventDefault();
		console.log("Booking request was submitted");

		/** Calculating the total number of visitors */
		const visitorCount = parseInt(adultCount) + parseInt(childrenCount);

		const data = {
			locationId : context.locationId,
			noOfTickets : visitorCount.toString(),
			bookingDate : formattedDate(visitDate),
		}

		try{
			const url = "http://localhost:4000/api/book/lock/";
			const response = await axios.post(url, data, {withCredentials: true});

			if(response.data.status === "success"){
				console.log("Booking lock ID is : " + response.data.lockId);
				setBookingMessage("Booking locked successfully, proceeding to payment.....");

				/** Open the payment modal after 4 seconds */
				setTimeout(() => {
					setContext({...context, tempBookingId: response.data.lockId, isPaymentModalOpen: true});
				}, 4000);
			}
		}
		catch(error){
			setBookingMessage("Booking failed, please try again later");
		}
	}

	return (
		<div className="right-section">
			<h2>Location Booking</h2>

			<form onSubmit={handleBookingFormSubmit}>
				<label htmlFor="adults">Adult:</label>
				<input
					type="number"
					id="adults"
					name="adults"
					min="1"
					max="10"
					value={adultCount}
					onChange={(e) => setAdultCount(e.target.value)}
					required
				/>
				<br />

				<label htmlFor="children">Children:</label>
				<input
					type="number"
					id="children"
					name="children"
					min="0"
					max="10"
					value={childrenCount}
					onChange={(e) => setChildrenCount(e.target.value)}
				/>
				<br />

				<label htmlFor="date">Visit date:</label>
				<input
					type="date"
					id="date"
					name="date"
					value={visitDate}
					onChange={(e) => setVisitDate(e.target.value)}
					required
				/>
				<br/>
				<input type="submit" value="Book Now" />
				<p> {bookingMessage}</p>
			</form>

			{/* If booking lock is successfull, then render the payment modal */}
			{isPaymentModalOpen && (<PaymentModal />)}
		</div>
	);
}

export default RightLocationSection