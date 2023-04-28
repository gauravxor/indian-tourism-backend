import React from 'react'

const BookingCard = (props) => {

	const { bookingData } = props;

	const bookingId = bookingData.bookingId;
	const cancelBookingHandler = () => {
		console.log("Booking tried to cancel");
		console.log("This will trigger a cancellation request for booking id = " + bookingId);
	}


	return (
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
			<button type='submit' onClick={cancelBookingHandler}> Cancel Booking </button>
		</div>
	)
}

export default BookingCard;