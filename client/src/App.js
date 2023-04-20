import React, {useContext} from 'react';

import {AppContext} from './AppContext.js';
import Body 		from './Components/Body/Body.jsx';
import Header 		from './Components/Header/Header.jsx';
import Footer 		from './Components/Footer/Footer.jsx';



import Profile 				from './Components/Body/Profile/Profile.jsx';
import LocationBody 		from './Components/Body/Locations/LocationBody/LocationBody.jsx'
import BookingsContainer 	from './Components/Body/Bookings/BookingsContainer/BookingsContainer.jsx';
import LocationsContainer 	from './Components/Body/Locations/LocationsContainer/LocationsContainer.jsx';


function App() {

	const {context} = useContext(AppContext);
	console.log("IsSearchClicked: ", context.isSearchClicked)
	console.log("IsLocationClicked: ", context.isLocationClicked)
	console.log("The context search text is: ", context.searchText)
	console.log("The context location id is: ", context.locationId)
	console.log("The location id is: ", context.locationId)
	return (
		<>
			<Header />
			{context.isBookingsClicked && <BookingsContainer />}
			{context.isProfileClicked && <Profile />}
			{context.isSearchClicked && <LocationsContainer searchText={context.searchText} />}
			{context.isLocationClicked && <LocationBody/>}
			{context.showMainBody && <Body />}
			<Footer />
		</>
	);
}

export default App;
