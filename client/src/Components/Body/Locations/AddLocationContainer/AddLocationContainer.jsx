import React, {useState, useContext} from 'react'
import axios from 'axios';
import classes from './AdddLocationContainer.module.css';
import Button from '../../../UI/Buttons/Button';

import { AppContext } from '../../../../AppContext';

const AddLocationContainer = () => {
    // eslint-disable-next-line
	const { context, setContext, resetContext } = useContext(AppContext);

	/** React states to store location data */
	const [locationName, setLocationName] = useState("");
	const [locationAddress, setLocationAddress] = useState("");
	const [locationDescription, setLocationDescription] = useState("");
	const [locationCity, setLocationCity] = useState("");
	const [locationState, setLocationState] = useState("");
	const [locationCountry, setLocationCountry] = useState("");
	const [locationPincode, setLocationPincode] = useState("");
	const [locationLongitude, setLocationLongitude] = useState("");
	const [locationLatitude, setLocationLatitude] = useState("");
	const [locationCapacity, setLocationCapacity] = useState("");
	const [locationPrice, setLocationPrice] = useState("");

	const [locationCoverImage1, setLocationCoverImage1]   = useState("");
	const [locationCoverImage2, setLocationCoverImage2]   = useState("");
	const [locationCoverImage3, setLocationCoverImage3]   = useState("");
	const [locationSliderImage1, setLocationSliderImage1] = useState("");
	const [locationSliderImage2, setLocationSliderImage2] = useState("");
	const [locationSliderImage3, setLocationSliderImage3] = useState("");


	/** Function to handle adding location to the database */
	const handleAddLocation = async (event) => {
		event.preventDefault();
		console.log("Add Location Button Clicked");

		/** Since the form will be sending out a multipart data, we are using FormApi to create data object */
		const data = new FormData();
		data.append("name", locationName);
		data.append("description", locationDescription);
		data.append("address", locationAddress);
		data.append("city", locationCity);
		data.append("state", locationState);
		data.append("country", locationCountry);
		data.append("pincode", locationPincode);
		data.append("longitude", locationLongitude);
		data.append("latitude", locationLatitude);
		data.append("capacity", locationCapacity);
		data.append("ticketPrice", locationPrice);

		data.append("cover-image1", locationCoverImage1);
		data.append("cover-image2", locationCoverImage2);
		data.append("cover-image3", locationCoverImage3);

		data.append("slider-image1", locationSliderImage1);
		data.append("slider-image2", locationSliderImage2);
		data.append("slider-image3", locationSliderImage3);

		console.log(data);

		try{
			const url = `${window.location.protocol}//${window.location.hostname}:4000/api/location/add-location/`;

			/** Sending out the request with appropriate data */
			const response = await axios.post(url, data, {
				headers: {
					"Content-Type": "multipart/form-data"
				}, withCredentials: true });

			if(response.data.status === "failure" && response.data.msg === "Tokens Expired"){
				alert("Your session has expired. Please login again");
				resetContext();
			}
			else
			if (response.data.status === "success") {
				alert("Location successfully added to the database");
				console.log("Location successfully added to the database");
			}
			else {
				alert("Error adding location to the database");
				console.log("Error adding location to the database");
			}
		}
		catch(error){
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
				alert("Error adding location to the database");
			}
		}
	}
	return (
		<div className={classes.main_container}>
			<h2>Add Location To Database</h2>
			 <form className='add_location' onSubmit={handleAddLocation}>

				<span>
				<label htmlFor="location-name">Location Name</label>
				<input
					type="text"
					id="location-name"
					name="location-name"
					placeholder="Location Name"
					value = {locationName}
					onChange = {(e) => setLocationName(e.target.value)}
				/><br /><br/>
				</span>

                <span>
			    <label htmlFor="location-address">Location Address</label>
				<input
					type="text"
					id="location-address"
					name="location-address"
					placeholder="Location Address"
					value = {locationAddress}
					onChange = {(e) => setLocationAddress(e.target.value)}
				/> <br /><br />
				</span>
                 <span>
				 <label htmlFor="location-description">Location Description</label>
				<input
					type="text"
					id="location-description"
					name="location-description"
					placeholder="Location Description"
					value = {locationDescription}
					onChange = {(e) => setLocationDescription(e.target.value)}
				/> <br /><br />
				</span>
				<span>
				<label htmlFor="location-city" >Location City</label>
				<input
					type="text"
					id="location-city"
					name="location-city"
					placeholder="Location City"
					value = {locationCity}
					onChange = {(e) => setLocationCity(e.target.value)}
				/> <br /><br />
				</span>
				<span>
				<label htmlFor="location-state">Location State</label>
				<input
					type="text"
					id="location-state"
					name="location-state"
					placeholder="Location State"
					value = {locationState}
					onChange = {(e) => setLocationState(e.target.value)}
				/> <br /><br />
				</span>
				<span>
				<label htmlFor="location-country">Location Country</label>
				<input
					type="text"
					id="location-country"
					name="location-country"
					placeholder="Location Country"
					value = {locationCountry}
					onChange = {(e) => setLocationCountry(e.target.value)}
				/> <br /><br />
				</span>
				<span>
				<label htmlFor="location-pincode">Location Pincode</label>
				<input
					type="text"
					id="location-pincode"
					name="location-pincode"
					placeholder="Location Pincode"
					value = {locationPincode}
					onChange = {(e) => setLocationPincode(e.target.value)}
				/> <br /><br />
				</span>
                <span>
				<label htmlFor="location-longitude">Location Longitude</label>
				<input
					type="text"
					id="location-longitude"
					name="location-longitude"
					placeholder="Location Longitude"
					value = {locationLongitude}
					onChange = {(e) => setLocationLongitude(e.target.value)}
				/> <br /> <br /></span>
                <span>
				<label htmlFor="location-latitude">Location Latitude</label>
				<input
					type="text"
					id="location-latitude"
					name="location-latitude"
					placeholder="Location Latitude"
					value = {locationLatitude}
					onChange = {(e) => setLocationLatitude(e.target.value)}
				/> <br /><br /></span>
                <span>
				<label htmlFor="location-capacity">Location Capacity</label>
				<input
					type="number"
					id="location-capacity"
					name="location-capacity"
					placeholder="Location Capacity"
					value = {locationCapacity}
					onChange = {(e) => setLocationCapacity(e.target.value)}
				/> <br /><br />
				</span>

                <span>
				<label htmlFor="location-price">Location Price</label>
				<input
					type="number"
					id="location-price"
					name="location-price"
					placeholder="Location Price"
					value = {locationPrice}
					onChange = {(e) => setLocationPrice(e.target.value)}
				/> <br /><br />
				</span>
                <span>
				<label htmlFor="location-cover-image1">Location Cover Image 1</label>
				<input
					type="file"
					id="location-cover-image1"
					name="location-cover-image1"
					placeholder="Location Cover Image 1"
					onChange = {(e) => setLocationCoverImage1(e.target.files[0])}
				/> <br /><br />
				</span>
                 <span>
				<label htmlFor="location-cover-image2">Location Cover Image 2</label>
				<input
					type="file"
					id="location-cover-image2"
					name="location-cover-image2"
					placeholder="Location Cover Image 2"
					onChange = {(e) => setLocationCoverImage2(e.target.files[0])}
				/> <br /><br />
				</span>
                <span>
				<label htmlFor="location-cover-image3">Location Cover Image 3</label>
				<input
					type="file"
					id="location-cover-image3"
					name="location-cover-image3"
					placeholder="Location Cover Image 3"
					onChange = {(e) => setLocationCoverImage3(e.target.files[0])}
				/> <br /><br />
				</span>
                <span>
				<label htmlFor="location-slider-image1">Location Slider Image 1</label>
				<input
					type="file"
					id="location-slider-image1"
					name="location-slider-image1"
					placeholder="Location Slider Image 1"
					onChange = {(e) => setLocationSliderImage1(e.target.files[0])}
				/> <br /><br />
				</span>
				<span>
				<label htmlFor="location-slider-image2">Location Slider Image 2</label>
				<input
					type="file"
					id="location-slider-image2"
					name="location-slider-image2"
					placeholder="Location Slider Image 2"
					onChange = {(e) => setLocationSliderImage2(e.target.files[0])}
				/> <br /><br />
				</span>
				<span>
				<label htmlFor="location-slider-image3">Location Slider Image 3</label>
				<input
					type="file"
					id="location-slider-image3"
					name="location-slider-image3"
					placeholder="Location Slider Image 3"
					onChange = {(e) => setLocationSliderImage3(e.target.files[0])}
				/> <br /><br />
				</span>
                 <span>
				<Button type="submit">Add Location</Button>
				</span>

			</form>
		</div>
	)
};
export default AddLocationContainer;