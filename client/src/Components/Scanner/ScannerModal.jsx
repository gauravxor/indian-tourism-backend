import React, {useState} from 'react'
import axios from 'axios'

import './ScannerModal.css'
import Button from '../UI/Buttons/Button'

const ScannerModal = (props) => {

	const [actionMessage, setActionMessage] = useState("")

	const handleButtonSubmit = async () => {

		const url = "http://localhost:4000/scanner/allow";
		const data = {
			accessKey : "2345678",
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
				<p>Date of Visit : {props.result.dateOfVisit}</p>
				<p>No of Tickets : {props.result.noOfTickets}</p>
				{actionMessage !== "" && (<p>{actionMessage}</p>)}
				<Button onClick={handleButtonSubmit}>Allow Entry</Button>
				<Button onClick={handleButtonClose}>Close</Button>

			</div>
		</div>
	);
}

export default ScannerModal;