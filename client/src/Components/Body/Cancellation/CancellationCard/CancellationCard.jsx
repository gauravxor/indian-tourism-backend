import React, {useContext} from 'react';
import axios from 'axios';
import './CancellationCard.css';

import {AppContext} from '../../../../AppContext.js';


const CancellationCard = (props) => {

	const { context, setContext } = useContext(AppContext);

	/** Storing the cancellationData object */
	const cancellationData = props.cancellationData;

	const cancelApprovalHandler = () => {
		console.log("Approve button clicked");

		const data = {
			bookingId : cancellationData.bookingId,
			adminId : cancellationData.adminId
		}

		const url = `http://localhost:4000/api/book/cancel/approve`;

		/** Calling the cancellation API to approve cancellation */
		axios
		.post(url, data, {withCredentials: true})
		.then((response) => {

			if(response.data.status === "failure" && response.data.msg === "Tokens Expired"){
				alert("Session Expired. Please Login Again");
				setContext({...context, isLoggedIn: false});
			}
			else
			if(response.data.status === "success"){
				alert("Cancellation approved successfully");
				console.log("Cancellation approved successfully");
				window.location.reload();
			}
			else{
				console.log("Cancellation approval failed");
			}
		})
		.catch(error => console.log(error));
	}

	return (
		<div className="main">
			<div className="cancellation-card">
				<div className="cancellation-card-header">
					<h2>{cancellationData.locationName}</h2>
					<p>{cancellationData.locationDesc}</p>
				</div>
				<div className="cancellation-card-details">
					<div className="cancellation-card-details-row">
						<p><strong>Booking ID:</strong> {cancellationData.bookingId}</p>
						<p><strong>Location ID:</strong> {cancellationData.locationId}</p>
						<p><strong>Location Name:</strong> {cancellationData.locationName}</p>
						{/* <p><strong>Admin ID:</strong> {cancellationData.adminId}</p> */}
						<p><strong>Usesr ID:</strong> {cancellationData.userId}</p>
						<p><strong>User Name:</strong> {cancellationData.userName}</p>
						<p><strong>Date of Visit:</strong> {new Date(cancellationData.dateOfVisit).toLocaleDateString()}</p>
						<p><strong>Booking Price:</strong> {cancellationData.bookingPrice}</p>
					</div>
				</div>
				<button type='submit' className="cancellation-approve-btn" onClick={cancelApprovalHandler}> Approve </button>
			</div>
		</div>
	)
}

export default CancellationCard;