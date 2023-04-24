import axios from 'axios';
import React, {useContext} from 'react'
import {AppContext} from '../../../../AppContext.js';
import PaymentModal from '../../../Modals/PaymentModal/PaymentModal.jsx';

const formattedDate = (visitDate) => {
	const date = new Date(visitDate);
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const formattedDate = day + "-" + month + "-" + year;
	return formattedDate;
}


function RightLocationSection(props) {
	// const locationData = props.locationData;


	const [adultCount, setAdultCount] = React.useState(1);
	const [childrenCount, setChildrenCount] = React.useState(0);
	const [visitDate, setVisitDate] = React.useState("");

	const {context, setContext} = useContext(AppContext);
	const {isPaymentModalOpen} = context;

	const [bookingMessage, setBookingMessage] = React.useState("");


	const handleBookingFormSubmit = async (event) => {
		event.preventDefault();
		console.log("Booking submit button clicked");

		const visitorCount = parseInt(adultCount) + parseInt(childrenCount);
		const data = {
			locationId : context.locationId,
			noOfTickets : visitorCount.toString(),
			bookingDate : formattedDate(visitDate),
		}
		console.log(data);
		const url = "http://localhost:4000/api/book/lock/";
		try{
			const response = await axios.post(url, data, {withCredentials: true});
			if(response.data.status === "success"){
				console.log("Booking locked successfully");
				console.log("The temporary booking id is : " + response.data.lockId);
				setBookingMessage("Booking locked successfully, proceeding to payment.....");

				setTimeout(() => {
					setContext({...context, tempBookingId: response.data.lockId, isPaymentModalOpen: true});
				}, 5000);
			}
		}
		catch(error){
			console.log(error);
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
			{isPaymentModalOpen && (<PaymentModal />)}
		</div>
	);
}

export default RightLocationSection