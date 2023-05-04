import React from "react";

function LeftLocationSection(props) {

	const locationData = props.locationData;

	return (
		<div className="left-section">
			<div >
				{/* <h2>Location Details</h2> */}
				<h2> {locationData.name} </h2>
				<p><b> Type: </b>{locationData.description} </p>
				<p className="address"> <b> Address: </b>{locationData.address} </p>
				<p> <b> City: </b>{locationData.city} </p>
				<p><b> State: </b>{locationData.state} </p>
				<p><b> Pincode: </b>{locationData.pincode} </p>
				<p><b> Entry Fee: Rs.</b> {locationData.ticketPrice} </p>
				<p><b> Max Capacity: Rs. </b>{locationData.capacity} </p>
			</div>
		</div>
	);
}

export default LeftLocationSection;
