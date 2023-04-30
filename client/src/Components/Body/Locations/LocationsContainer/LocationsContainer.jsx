import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios';

import LocationDataEdit from './LocationDataEdit.jsx';
import LocationCard from '../LocationCard/LocationCard.jsx';
import './LocationsContainer.css';

import { AppContext } 	from '../../../../AppContext.js';
import { v4 as uuidv4 } from 'uuid';


function LocationsContainer() {

	// eslint-disable-next-line
	const { context, setContext } = useContext(AppContext);

	const [locations, setLocations] = useState([]);

	/** If Admin want to edit the location */
	const [inEditableMode, setInEditableMode] = useState(false);
	const [editLocationId, setEditLocationId] = useState("");

	useEffect(() => {
		console.log("Use effect search text is = " + context.searchText);

		let url = "";
		/** If search text is empty, call the API to get random locations or else get specific results */
		if(context.searchText === "") {
			console.log("Calling the default function");
			url = 'http://localhost:4000/api/location';
		}
		else {
			console.log("Calling the city function");
			url = 'http://localhost:4000/api/location/search/' + context.searchText;
		}

		axios.get(url, {withCredentials: false})
		.then((response) => {

			/** The response will contain an array of objects. If the array is empty, we will render the main body
			 *  or else we will render the fetched location data for search query.
			*/
			if(response.data.length === 0) {
				setContext({ ...context, showMainBody: true});
			}
			else {
				setLocations(response.data);
				setContext({ ...context, showMainBody: false});
			}})
		.catch(error => console.log(error));
	}, [context.searchText]); // eslint-disable-line


	return (<>
		<div className='location-card-container'>
			{locations.map(location => (
				<LocationCard
					key={uuidv4()}
					locationId={location._id}
					name={location.name}
					description={location.description}
					images={location.images}
					price={location.ticketPrice}
					inEditableMode={inEditableMode}
					setInEditableMode={setInEditableMode}
					setEditLocationId={setEditLocationId}
				/>
				))
			}
		</div>

		{/* If Admin clicks the edit button in child component, we will render the edit component here in parent */}
		{inEditableMode && (
			<div className="location-edit-container">
				<LocationDataEdit
					locationId={editLocationId}
					setInEditableMode={setInEditableMode}
				/>
			</div>
		)}
	</>
	)
}

export default LocationsContainer;