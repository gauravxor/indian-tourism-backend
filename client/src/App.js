import React, {useContext} from 'react';
import { Route, Routes } from 'react-router-dom';
import {AppContext} 			from './AppContext';

import classes from './App.module.css'
import Body from './Components/Body/Body.jsx';
import Header from './Components/Header/Header.jsx';
import Footer from './Components/Footer/Footer.jsx';
import slides from './Components/ImageSliders/slides.jsx';
import Profile from './Components/Body/UserProfile/UserProfile.jsx';
import ImageSlider from './Components/ImageSliders/ImageSlider.jsx';
import LocationBody from './Components/Body/Locations/LocationBody/LocationBody.jsx'
import BookingsContainer from './Components/Body/Bookings/BookingsContainer/BookingsContainer.jsx';
import LocationsContainer from './Components/Body/Locations/LocationsContainer/LocationsContainer.jsx';
import AddLocationContainer from './Components/Body/Locations/AddLocationContainer/AddLocationContainer.jsx';
import CancellationContainer from './Components/Body/Cancellation/CancellationContainer/CancellationContainer.jsx';


function App() {
	// eslint-disable-next-line
	const {context, setContext} = useContext(AppContext);
	const {isSlideShow} = context;
	console.log(typeof(context.isSlideShow));
	console.log(typeof(isSlideShow));

	return (
	<div className={classes.App}>
		<Header />

		{!isSlideShow &&(<div className={classes.container}>
			<ImageSlider slides={slides} parentWidth={700} />
		</div>)}

		<div className={classes.body}>
			<Routes>
				<Route path="/" Component={Body} />
				<Route exact path="/profile" Component={Profile} />
				<Route path="/bookings" Component={BookingsContainer} />
				<Route path="/locations" Component={LocationsContainer} />
				<Route path="/locations/:locationId" Component={LocationBody} />
				<Route path="/add-location/" Component={AddLocationContainer} />
				<Route path="/cancellations" Component={CancellationContainer} />
			</Routes>
		</div>

		<Footer className={classes.footer} />
	</div>
	);
}

export default App;
