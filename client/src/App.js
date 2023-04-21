import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Body 		from './Components/Body/Body.jsx';
import Header 		from './Components/Header/Header.jsx';
import Footer 		from './Components/Footer/Footer.jsx';



import Profile 				from './Components/Body/Profile/Profile.jsx';
import LocationBody 		from './Components/Body/Locations/LocationBody/LocationBody.jsx'
import BookingsContainer 	from './Components/Body/Bookings/BookingsContainer/BookingsContainer.jsx';
import LocationsContainer 	from './Components/Body/Locations/LocationsContainer/LocationsContainer.jsx';


function App() {
	return (
		<>
			<Header />
			<Routes>
				<Route path="/" Component={Body} />
				<Route path="/profile" Component={Profile} />
				<Route path="/bookings" Component={BookingsContainer} />
				<Route path="/locations" Component={LocationsContainer} />
				<Route path="/locations/:locationId" Component={LocationBody} />
			</Routes>
			<Footer />
		</>
	);
}

export default App;
