import React from "react";

function LeftLocationSection(props) {

	const locationData = props.locationData;

	return (
		<div className="left-section">
			<div >
				<h2> {locationData.name} </h2>
				<p><b> Description: </b>{locationData.description} </p>
				<p className="address"> <b> Address: </b>{locationData.address} </p>
				<p> <b> City: </b>{locationData.city} </p>
				<p><b> State: </b>{locationData.state} </p>
				<p><b> Pincode: </b>{locationData.pincode} </p>
				<p><b> Entry Fee:</b> Rs. {locationData.ticketPrice} per person</p>
			</div>
		</div>
	);
}

export default LeftLocationSection;
