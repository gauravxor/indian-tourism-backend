import React, {useContext} from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import {AppContext} 			from './AppContext';

import classes from './App.module.css'
import Header from './Components/Header/Header.jsx';
import Scanner from './Components/Scanner/Scanner.jsx'
import slides from './Components/ImageSliders/slides.jsx';
import Profile from './Components/Body/UserProfile/UserProfile.jsx';
import ImageSlider from './Components/ImageSliders/ImageSlider.jsx';
import LocationBody from './Components/Body/Locations/LocationBody/LocationBody.jsx'
import BookingsContainer from './Components/Body/Bookings/BookingsContainer/BookingsContainer.jsx';
import LocationsContainer from './Components/Body/Locations/LocationsContainer/LocationsContainer.jsx';
import AddLocationContainer from './Components/Body/Locations/AddLocationContainer/AddLocationContainer.jsx';
import CancellationContainer from './Components/Body/Cancellation/CancellationContainer/CancellationContainer.jsx';
import About from './Components/Body/About/About';

function App() {
	// eslint-disable-next-line
	const {context, setContext} = useContext(AppContext);

	const {isSlideShow} = context;

	/** Using useLocation hook to determine the current route/path and render components accordingly */
	const location = useLocation();
	const isScannerRoute = location.pathname === '/scanner';

	return (
	<div className={classes.App}>
		{!isScannerRoute && <Header />}
		{!isScannerRoute && !isSlideShow && (
			<div className={classes.container}>
				<ImageSlider slides={slides} parentWidth={700} />
			</div>
		)}

		<div className={classes.body}>
			<Routes>
				<Route path="/" Component={LocationsContainer} />
				<Route path="/profile" Component={Profile} />
				<Route path="/bookings" Component={BookingsContainer} />
				<Route path="/about" Component={About} />
				<Route path="/locations" Component={LocationsContainer} />
				<Route path="/locations/:locationId" Component={LocationBody} />
				<Route path="/add-location/" Component={AddLocationContainer} />
				<Route path="/cancellations" Component={CancellationContainer} />
				<Route path="/scanner" Component={Scanner} />
			</Routes>
		</div>

	</div>
	);
}

export default App;
