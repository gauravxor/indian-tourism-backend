import React, {useContext} from 'react'
import axios from 'axios';
import './BookingCard.css';
import classes from '../../../UI/Buttons/Button.module.css';
import {AppContext} from '../../../../AppContext';


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

const BookingCard = (props) => {

	const { bookingData } = props;

	const {resetContext} = useContext(AppContext);

	const bookingId = bookingData.bookingId;
	const cancelBookingHandler = async () => {
		console.log("Submitting a cancellation request for booking ID: " + bookingId);

		try{
			const url = `${window.location.protocol}//${window.location.hostname}:4000/api/book/cancel`;
			const data = {
				bookingId : bookingId,
				userId : bookingData.userId,
			}
			const response = await axios.post(url, data, {withCredentials: true});

			if(response.data.status === "failure" && response.data.msg === "Tokens Expired"){
				alert("Session Expired. Please Login Again");
				resetContext();
			}
			else
			if(response.data.status === "success"){
				alert("Cancellation Request Submitted Successfully");
				window.location.reload();
			}
			else{
				alert("Cancellation Request Failed");
			}
		}
		catch(error){
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
				alert("Cancellation Request Failed");
			}
		}
	}

	return (
		<div className='main_'>
		<div className="booking-card">
			<div className="booking-card-header">
				<h2>{bookingData.locationName}</h2>
				<p><b>{bookingData.locationDesc}</b></p>
			</div>
			<div className="booking-card-details">
				<div className="booking-card-details-row">
					<p><strong>Booking ID:</strong> {bookingData.bookingId}</p>
					<p><strong>User Name:</strong> {bookingData.userName}</p>
					<p><strong>Number of Tickets:</strong> {bookingData.noOfTickets}</p>
					<p><strong>Date of Visit:</strong> {formatDate(bookingData.dateOfVisit)}</p>
					<p><strong>Booking Price: Rs. </strong> {bookingData.bookingPrice}</p>
					<p><strong>Location Address:</strong> {bookingData.locationAddress.address}, {bookingData.locationAddress.city}, {bookingData.locationAddress.state} {bookingData.locationAddress.pincode}, {bookingData.locationAddress.country}</p>
					{bookingData.cancellationStatus !== "na" && (<p><strong>Cancellation Status:</strong> {bookingData.cancellationStatus}</p>)}
					{bookingData.isVisited === true && (<p><strong>Visited :</strong> YES </p>)}

				</div>
			</div>
			{bookingData.cancellationStatus === "na" && !(bookingData.isVisited) && (
				<button className={`${props.className} ${classes.button} `} type='submit' onClick={cancelBookingHandler}>
					Cancel Booking
				</button>
			)}
		</div>
		</div>
	)
}

export default BookingCard;