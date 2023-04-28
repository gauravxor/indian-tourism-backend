import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import CancellationCard from '../CancellationCard/CancellationCard.jsx';


import { AppContext } from '../../../../AppContext.js';

const CancellationContainer = () => {

	//eslint-disable-next-line
	const { context, setContext } = useContext(AppContext);
	const [cancellation, setCancellation] = useState([]);

	useEffect(() => {

		const url = `http://localhost:4000/api/book/cancellations/` + context.userId;
		axios
		.get(url, {withCredentials: true})
		.then((response) => {
			if(response.data.status === "success"){
				console.log("Cancellation data fetched successfully");
				setCancellation(response.data.data);
			}
			else{
				console.log("Cancellation data fetch failed");
			}
		})
		.catch(error => console.log(error));
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
