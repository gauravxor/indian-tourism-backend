import React from "react";

function LeftLocationSection(props) {

	const locationData = props.locationData;

	return (
		<div className="left-section">
			<div >
				{/* <h2>Location Details</h2> */}
				<h1> Name: {locationData.name} </h1>
				<p> Type: {locationData.description} </p>
				<p className="address"> Address: {locationData.address} </p>
				<span> City: {locationData.city} </span>
				<span> State: {locationData.state} </span>
				<span> Pincode: {locationData.pincode} </span>
				<br/>
				<span> Entry Fee: Rs. {locationData.ticketPrice} </span>
				<span> Max Capacity: Rs. {locationData.capacity} </span>
			</div>
		</div>
	);
}

export default LeftLocationSection;
