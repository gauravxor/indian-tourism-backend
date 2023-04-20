import React, {useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../../AppContext'
import axios from 'axios';

function LocationBody() {
	const { context, setContext } = useContext(AppContext);

	const [locationData, setLocationData] = useState({});


	useEffect(() => {
		const fetchData = async () => {
			console.log('location id: ' + context.locationId);
			try {
				const url = 'http://localhost:4000/api/location/' + context.locationId;
				const response = await axios.get(url);
				setLocationData(response.data.location);
			}
			catch (error) {
				console.log(error);
			}
		};
		fetchData();

	}, [context.locationId, setLocationData]);

	useEffect(() => {
		console.log(locationData);
	}, [locationData]);






	return (
		<div>
			<p> Location Name: {locationData.name} </p>
			<p> Location Type: {locationData.description} </p>
			<p> Location Address: {locationData.address} </p>
			<p> Location City: {locationData.city} </p>
			<p> Location State: {locationData.state} </p>
			<p> Location Pincode: {locationData.pincode} </p>
		</div>
	);
};

export default LocationBody;