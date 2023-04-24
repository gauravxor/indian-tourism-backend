import React from "react";

function LeftLocationSection(props) {

	const locationData = props.locationData;

	return (
		<div className="left-section">
			<div className="details">
				<h2>Location Details</h2>
				<p> Name: {locationData.name} </p>
				<p> Type: {locationData.description} </p>
				<p> Address: {locationData.address} </p>
				<p> City: {locationData.city} </p>
				<p> State: {locationData.state} </p>
				<p> Pincode: {locationData.pincode} </p>
				<p> Entry Fee: Rs. {locationData.ticketPrice} </p>
				<p> Max Capacity: Rs. {locationData.capacity} </p>
			</div>
		</div>
	);
}

export default LeftLocationSection;
