import React, {useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../../AppContext'
import { useParams } from "react-router-dom";
import axios from 'axios';


import TopImageSlider from './TopImageSlider';
import LeftLocationSection from './LeftLocationSection';
import RightLocationSection from './RightLocationSection';

import './LocationBody.css';

function LocationBody() {

	const { context, setContext } = useContext(AppContext);

	const [locationData, setLocationData] = useState({});

	const { locationId } = useParams();

	const url = `http://localhost:4000/api/location/${locationId}`;

	useEffect(() => {
	axios.get(url, {withCredentials: false})
	.then((response) => {
		console.log(JSON.stringify(response.data.location));
		setLocationData(response.data.location);
		}
	)
	.catch(error => console.log(error));
	// eslint-disable-next-line
	}, [locationId]);

	return (
		<div>
			<TopImageSlider imageData = {locationData.images}/>
			<LeftLocationSection locationData={locationData}/>
			<RightLocationSection locationId = {context.locationId}/>
		</div>
	);
};

export default LocationBody;