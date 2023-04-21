import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios';

import LocationCard from '../LocationCard/LocationCard.jsx';
import './LocationsContainer.css';

import { AppContext } from '../../../../AppContext.js';

import { v4 as uuidv4 } from 'uuid';


function LocationsContainer() {

	// eslint-disable-next-line
	const { context, setContext } = useContext(AppContext);

	const [locations, setLocations] = useState([]);

	useEffect(() => {
		console.log("Use effect search text is = " + context.searchText);

		let url = "";
		if(context.searchText === "") {
			console.log("Calling the default function");
			url = 'http://localhost:4000/api/location';
		}
		else {
			console.log("Calling the city function");
			url = 'http://localhost:4000/api/location/city/' + context.searchText;
		}

		const apiUrl = url;

		axios.get(apiUrl, {withCredentials: false})
		.then((response) => {
			console.log("The response object is = " + response.data)
			// check if the response is empty
			if(response.data.length === 0) {
				console.log("The response is empty");
				// setLocations([]);
				setContext({ ...context, showMainBody: true});
			}
			else {
				setLocations(response.data);
				setContext({ ...context, showMainBody: false});
			}})

		.catch(error => console.log(error));
	// eslint-disable-next-line
	}, [context.searchText]);


	return (
		<div className='location-card-container'>
			{locations.map(location => (
				<LocationCard
					key={uuidv4()}
					locationId={location._id}
					name={location.name}
					description={location.description}
					images={location.images}
					price={location.ticketPrice}
				/>
				))
			}
		</div>
	)
}

export default LocationsContainer;