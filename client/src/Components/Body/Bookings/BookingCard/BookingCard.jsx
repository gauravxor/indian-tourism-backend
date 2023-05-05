import React from 'react'
import axios from 'axios';
import './BookingCard.css';
import classes from '../../../UI/Buttons/Button.module.css';

const BookingCard = (props) => {

	const { bookingData } = props;

	const bookingId = bookingData.bookingId;
	const cancelBookingHandler = async () => {
		console.log("Submitting a cancellation request for booking ID: " + bookingId);

		try{
			const url = "http://localhost:4000/api/book/cancel";
			const data = {
				bookingId : bookingId,
				userId : bookingData.userId,
			}

			const response = await axios.post(url, data, {withCredentials: true});
			if(response.data.status === "success"){
				alert("Cancellation Request Submitted Successfully");
				window.location.reload();
			}
			else{
				alert("Cancellation Request Failed");
			}
		}
		catch(err){
			console.log(err);
		}
	}

	return (
		<div className='main'>
		<div className="booking-card">
			<div className="booking-card-header">
				<h2>{bookingData.locationName}</h2>
				<p>{bookingData.locationDesc}</p>
			</div>
			<div className="booking-card-details">
				<div className="booking-card-details-row">
					<p><strong>Booking ID:</strong> {bookingData.bookingId}</p>
					<p><strong>Date of Visit:</strong> {new Date(bookingData.dateOfVisit).toLocaleDateString()}</p>
					<p><strong>Number of Tickets:</strong> {bookingData.noOfTickets}</p>
					<p><strong>Booking Price:</strong> {bookingData.bookingPrice}</p>
					<p><strong>User ID:</strong> {bookingData.userId}</p>
					<p><strong>User Name:</strong> {bookingData.userName}</p>
					<p><strong>Location Address:</strong> {bookingData.locationAddress.address}, {bookingData.locationAddress.city}, {bookingData.locationAddress.state} {bookingData.locationAddress.pincode}, {bookingData.locationAddress.country}</p>
					<p><strong>Cancellation Status</strong> {bookingData.cancellationStatus}</p>
				</div>
			</div>
			<button  className={`${props.className} ${classes.button} `} type='submit' onClick={cancelBookingHandler}> Cancel Booking </button>
		</div>
		</div>
	)
}

export default BookingCard;