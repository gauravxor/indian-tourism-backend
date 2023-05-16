import React, {useContext} from 'react'
import axios from 'axios';

import {AppContext} from '../../../../AppContext.js';
import PaymentModal from '../../../Modals/PaymentModal/PaymentModal.jsx';
import Button from '../../../UI/Buttons/Button.jsx';
import DateSelector from './DateSelector.jsx'


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

	const {context, setContext, resetContext} = useContext(AppContext);
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
			const url = `${window.location.protocol}//${window.location.hostname}:4000/api/book/lock/`;
			const response = await axios.post(url, data, {withCredentials: true});

			if(response.data.status === "failure" && response.data.msg === "Tokens Expired"){
				alert("Session Expired. Please Login Again");
				resetContext();
			}
			else
			if(response.data.status === "success"){
				console.log("Booking lock ID is : " + response.data.lockId);
				setBookingMessage("Booking locked successfully, proceeding to payment.....");

				/** Open the payment modal after 4 seconds */
				setTimeout(() => {
					setBookingMessage("");
					setContext({...context, tempBookingId: response.data.lockId, isPaymentModalOpen: true});
				}, 4000);
			}
		}
		catch(error){
			const response = error.response.data;
			if(error.response.status === 401 && response.msg === "Unauthorized access"){
				console.log("You need to be logged in to book tickets");
				setBookingMessage("You need to be logged in to book tickets");
				setTimeout(() => {
					setBookingMessage("");
				}, 3000);
			}
			else
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
			else
			{
				console.log("Not enough tickets available");
				setBookingMessage(response.message);
				setTimeout(() => {
					setBookingMessage("");
				}, 3000);
			}
		}
	}

	return (
		<div className="right-section">
			<h4>Booking</h4>

			<form onSubmit={handleBookingFormSubmit} className="booking-form">
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
				<br/>

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
				<br/>
				<hr/>

				<label htmlFor="date">Visit date:</label>
				<div className="date-selector">
					<DateSelector
						visitDate={visitDate}
						setVisitDate={setVisitDate}
						locationId={context.locationId}
					/>
				</div>
				<br /><br /><br/>

				<Button type="submit" className='submit-btn' >Book Now</Button>
				<p> {bookingMessage}</p>
			</form>

			{/* If booking lock is successful, then render the payment modal */}
			{isPaymentModalOpen && (<PaymentModal />)}
		</div>
	);
}

export default RightLocationSection