import React, {Fragment, useContext} from 'react';

import { Route, Routes } from 'react-router-dom';
import classes from './App.module.css'
import Body from './Components/Body/Body.jsx';
import Header from './Components/Header/Header.jsx';
import Footer from './Components/Footer/Footer.jsx';
import ImageSlider from './Components/ImageSliders/ImageSlider.js';
import slides from './Components/ImageSliders/slides.js';
import Profile 				from './Components/Body/UserProfile/UserProfile.jsx';
import LocationBody 		from './Components/Body/Locations/LocationBody/LocationBody.jsx'
import BookingsContainer 	from './Components/Body/Bookings/BookingsContainer/BookingsContainer.jsx';
import LocationsContainer 	from './Components/Body/Locations/LocationsContainer/LocationsContainer.jsx';
import {AppContext}  from './AppContext';

function App() {
       const {context, setContext} = useContext(AppContext);
	    const {isSlideShow} = context; 
		console.log(typeof(context.isSlideShow));
	   console.log(typeof(isSlideShow));
	   
	return (
    <React.Fragment className={classes.App}>
      <Header />
      {!isSlideShow &&(<div className={classes.container}>
	    <ImageSlider slides={slides} parentWidth={700} />
      </div>)}
      <div className={classes.body}>
	  {/* <div> */}
        <Routes>
          <Route path="/" Component={Body} />
          <Route path="/profile" Component={Profile} />
          <Route path="/bookings" Component={BookingsContainer} />
          <Route path="/locations" Component={LocationsContainer} />
          <Route path="/locations/:locationId" Component={LocationBody} />
        </Routes>
      </div>
      <Footer className={classes.footer} />
    </React.Fragment>
  );
}

export default App;
