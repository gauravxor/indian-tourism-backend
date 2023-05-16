import React, {useState} from 'react'
import axios from 'axios'

import './ScannerModal.css'
import Button from '../UI/Buttons/Button'

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

const ScannerModal = (props) => {

	const [actionMessage, setActionMessage] = useState("")

	const handleButtonSubmit = async () => {

		const url = `${window.location.protocol}//${window.location.hostname}:4000/scanner/allow`;
		const data = {
			accessKey : props.token,
			bookingId: props.result.bookingId,
		}
		try{
			const response = await axios.post(url, data);
			if(response.data.status === "success"){
				setActionMessage("Entry Allowed");
				setTimeout(() => {
					setActionMessage("");
					props.setResult("");
					props.setShowEntryModal(false);
				}, 2000);
			}
			else{
				setActionMessage("Entry Not Allowed");
				setTimeout(() => {
					setActionMessage("");
					props.setResult("");
					props.setShowEntryModal(false);
				}, 2000);
			}

		}
		catch(err){
			setActionMessage("Entry Not Allowed");
			console.log(err);
		}
	}

	const handleButtonClose = () => {
		props.setResult("");
		props.setShowEntryModal(false);
	}


	return (
		<div className="modal___">
			<div className="modal-content___">
				<p>Location Name : {props.result.locationName}</p>
				<p>Booking Id : {props.result.bookingId}</p>
				<p>User Name : {props.result.userName}</p>
				<p>Date of Visit : {formatDate(props.result.dateOfVisit)}</p>
				<p>No of Tickets : {props.result.noOfTickets}</p>
				{actionMessage !== "" && (<p>{actionMessage}</p>)}
				<Button onClick={handleButtonSubmit}>Allow Entry</Button>
				<Button onClick={handleButtonClose}>Close</Button>

			</div>
		</div>
	);
}

export default ScannerModal;