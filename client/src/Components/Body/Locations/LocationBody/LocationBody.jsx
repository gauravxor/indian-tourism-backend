import React, {useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from "react-router-dom";


import TopImageSlider 			from './TopImageSlider';
import LeftLocationSection 		from './LeftLocationSection';
import RightLocationSection 	from './RightLocationSection';

import { AppContext } 			from '../../../../AppContext'
import './LocationBody.css';

function LocationBody() {

	// eslint-disable-next-line
	const { context, setContext } = useContext(AppContext);

	const [locationData, setLocationData] = useState({});

	const { locationId } = useParams();

	const url = `${window.location.protocol}//${window.location.hostname}:4000/api/location/${locationId}`;

	useEffect(() => {
		axios
		.get(url, {withCredentials: false})
		.then((response) => {
			if(response.data.status === "success"){
				console.log("Fetched location data");
				setLocationData(response.data.location);
			}
			else{
				console.log("Error fetching location data");
			}
		})
		.catch(error => console.log("Error fetching location data"));
	}, [locationId]); // eslint-disable-line

	return (
		<div className="location-body">
			{/* Passing the image data to the TopImageSlider */}
			<div className="loc-image"> <TopImageSlider imageData = {locationData.images}/> </div>

			<div className='booking-details'>
				{/* Passing the location data to the LeftLocationSection */}
				<LeftLocationSection locationData={locationData}/><hr/>

				{/* If user is an admin, they will not be allowed to access booking section */}
				{context.isUserAdmin === false && (<RightLocationSection locationId = {context.locationId}/>)}
			</div>
		</div>
	);
};

export default LocationBody;