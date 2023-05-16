import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Button from '../../UI/Buttons/Button';
import {AppContext}	from '../../../AppContext.js'
import "./PaymentModal.css";
import { useNavigate } from 'react-router-dom';


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

const PaymentModal = () => {

	const navigate = useNavigate();

	const { context, setContext, resetContext } = useContext(AppContext);

	/** To store the user payment status message */
	const [paymentMessage, setPaymentMessage] = useState("");

	/** To store the card number entered by user */
	const [cardNumber, setCardNumber] = useState("");

	/** To store booking details */
	const [bookingDetails, setBookingDetails] = useState({});

	const tempBookingId = context.tempBookingId;

	/** Fetch the temporary booking details. As of now this function is not doing anything useful
	 * Once payment gateway is implemented in the future, this function will be used to fetch the
	 * temporary booking details and display it to the user for confirmation before making the payment
	*/
	useEffect(() => {
		try{
			const url = `${window.location.protocol}//${window.location.hostname}:4000/api/book/lock/details/${tempBookingId}`;
			axios
			.get(url, {withCredentials: true})
			.then((response) => {
				if(response.data.status === "success")
				{
					console.log("Booking details fetched successfully");
					setBookingDetails(response.data.data);
				}
			})
			.catch((error) => {
				const response = error.response.data;
				if(response.msg === "User not logged in"){
					console.log("User not logged in");
					alert("Session Expired. Please Login Again!");
				}
				else
				if(response.msg === "Duplicate session"){
					console.log("Duplicate session");
					alert("Duplicate session. Please Login Again!");
				}
				else{
					console.log("Error fetching booking details")
					console.log(error);
				}
			})
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
				console.log("Error fetching booking details")
			}
		}
	}, [tempBookingId]);  // eslint-disable-line

	/** Function to handle things when user clicks the SUBMIT button in payment modal after entering the card number */
	const handlePaymentSubmit = async (e) => {
		e.preventDefault();

		const data = {
			lockId: context.tempBookingId,
			paymentId: "random-payment-id"
		}

		try {
			const url = `${window.location.protocol}//${window.location.hostname}:4000/api/book/final`;
			const response = await axios.post(url, data, {withCredentials: true});
			if(response.data.status === "success"){
				console.log("Booking finalised successfully");
				setPaymentMessage("Booking finalised successfully");

				/** Wait for 2 seconds and then close the login modal */
				setTimeout(() => {
					setContext({...context, isLoggedIn: true, isPaymentModalOpen: false});
					navigate(`/bookings`);
				}, 2000);
			}
			else{
				console.log("Booking finalisation failed");
				setPaymentMessage("Booking finalisation failed");
			}
		}
		catch (error) {
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
				console.log("Error finalzing booking");
				setPaymentMessage("Error finalizing booking, please try again later");
			}
		}
	};

	const handleCancelRequest = () => {
		console.log("Booking cancelled by user");
		setPaymentMessage("Booking cancelled by user");

		/** Wait for 2 seconds and then close the payment modal */
		setTimeout(() => {
			setContext({...context, isLoggedIn: true, isPaymentModalOpen: false});
		}, 2000);
	};


	return (
		<div className="_modal_">
			<div className="modal_content_">
				<div>
					<h3>Booking Details</h3>
					<p><strong>Lock Id:</strong> {bookingDetails.lockId}</p>
					<p><strong>Location Name:</strong> {bookingDetails.locationName}</p>
					<p><strong>Total Amount:</strong> Rs. {bookingDetails.bookingPrice}</p>
					<p><strong>No of Tickets:</strong> {bookingDetails.noOfTickets}</p>
					<p><strong>Date of Visit:</strong> {formatDate(bookingDetails.dateOfVisit)}</p>

				</div>
				<form onSubmit={handlePaymentSubmit}>

					<label>Card Number:</label>
					<input
						type="text"
						name="cardNumber"
						value={cardNumber}
						onChange={(e) => setCardNumber(e.target.value)}
						required
					/>
					<br />


				</form> <br/>
				<Button className="payment-btn" type="submit" onClick={handlePaymentSubmit}>Make Payment</Button>
				<Button className="cancel-btn" type="submit" onClick={() => handleCancelRequest()}>Cancel</Button>
				<div> <h1> {paymentMessage} </h1> </div>
			</div>
		</div>
	);
};
export default PaymentModal;