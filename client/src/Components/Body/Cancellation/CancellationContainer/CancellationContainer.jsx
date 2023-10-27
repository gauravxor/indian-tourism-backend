import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import CancellationCard	from '../CancellationCard/CancellationCard.jsx';
import { AppContext }	from '../../../../AppContext.js';

const CancellationContainer = () => {
    // eslint-disable-next-line
	const { context, setContext, resetContext } = useContext(AppContext);

	/** React state to store the array of cancellation data objects */
	const [cancellation, setCancellation] = useState([]);

	/** Fetch the cancellation data as soon as the component is mounted */
	useEffect(() => {
		const url = `${window.location.protocol}//${window.location.hostname}:4000/api/book/cancellations/` + context.userId;

		axios
		.get(url, {withCredentials: true})
		.then((response) => {
			if(response.data.status === "failure" && response.data.msg === "Tokens Expired"){
				alert("Session Expired. Please Login Again");
				resetContext();
			}
			else
			if(response.data.status === "success"){
				console.log("Cancellation data fetched successfully");
				setCancellation(response.data.data);
			}
			else{
				console.log("Failed to fetch cancellation data");
			}
		})
		.catch((error) => {
			const response = error.response.data;
			if(response.msg === "User not logged in"){
				console.log("User not logged in");
				resetContext();
				alert("Session Expired. Please Login Again!");
			}
			else
			if(response.msg === "Duplicate session"){
				console.log("Duplicate session");
				resetContext();
				alert("Duplicate session. Please Login Again!");
			}
			else{
				console.log("Failed ot fetch cancellation data");
			}
		});
	}, []);  // eslint-disable-line

	return (<>
		<div className='cancellation-container'>
			{cancellation.map(cancellation => (
				<CancellationCard
					key={uuidv4()}
					cancellationData = {cancellation}
				/>
				))
			}
		</div>
	</>);

}


export default CancellationContainer;
