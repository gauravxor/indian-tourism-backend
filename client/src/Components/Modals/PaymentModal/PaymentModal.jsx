import "./PaymentModal.css";

import React, { useState, useContext } from "react";
import axios from "axios";
import {AppContext} from '../../../AppContext.js'


const PaymentModal = () => {

	const { context, setContext } = useContext(AppContext);

	const [paymentMessage, setPaymentMessage] = useState("");
	const [cardNumber, setCardNumber] = useState("");

	const tempBookingId = context.tempBookingId;


	try{
		const url = "http://localhost:4000/api/book/lock/details/" + tempBookingId;
		axios.get(url, {withCredentials: true})
		.then((response) => {
			if(response.date.status === "success")
			{
				console.log("Booking details fetched successfully");
				console.log(response.data);
			}
		})
		.catch((error) => {
			console.log(error);
		})
	}
	catch(error){
		console.log(error);
	}


	const handlePaymentSubmit = async (e) => {
		e.preventDefault();

		const data = {
			lockId: context.tempBookingId,
			paymentId: "random-payment-id"
		}
		console.log(data);

		try {
			const url = "http://localhost:4000/api/book/final";
			const response = await axios.post(url, data, {withCredentials: true});
			if(response.data.status === "success"){
				console.log("Booking finalised successfully");
				setPaymentMessage("Booking finalised successfully");
				/** Wait for 2 seconds and then close the login modal */
				setTimeout(() => {
					setContext({...context, isLoggedIn: true, isPaymentModalOpen: false});
				}, 2000);
			}
			else{
				console.log("Booking finalisation failed");
				setPaymentMessage("Booking finalisation failed");
			}
		}
		catch (error) {
			console.log("Error finalzing booking");
			setPaymentMessage("Error finalizing booking, please try again later");
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
		<div className="modal">
			<div className="modal-content">
				<h2>Payment</h2>

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

					<button type="submit">Make Payment</button>
				</form> <br/>
				<button type="button" onClick={() => handleCancelRequest()}>Cancel</button>
				<div> <h1> {paymentMessage} </h1> </div>
			</div>
		</div>
	);
};
export default PaymentModal;