import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';


const UserProfileEdit = ( props ) => {

	const locationId = props.locationId;

	console.log("Location id: " + locationId);
	const url = `http://localhost:4000/api/location/` + locationId;

	const [locationData, setLocationData] = useState({});

	useEffect(() => {
		console.log("Fetching location details");
		axios.get(url, { withCredentials: true })
		.then((response) => {
			if (response.data.status === "success") {
				setLocationData(response.data.location);
			}
		})
		.catch((error) => {
			console.log(error);
			console.log("Error fetching location details");
		})
	}, []);

	const [locationName, setLocationName] = useState(locationData.name);
	const [locationAddress, setLocationAddress] = useState(locationData.address);
	const [locationDescription, setLocationDescription] = useState(locationData.description);
	const [locationCity, setLocationCity] = useState(locationData.city);
	const [locationState, setLocationState] = useState(locationData.state);
	const [locationCountry, setLocationCountry] = useState(locationData.country);
	const [locationPincode, setLocationPincode] = useState(locationData.pincode);
	const [locationLongitude, setLocationLongitude] = useState(locationData.longitude);
	const [locationLatitude, setLocationLatitude] = useState(locationData.latitude);
	const [locationCapacity, setLocationCapacity] = useState(locationData.capacity);
	const [locationPrice, setLocationPrice] = useState(locationData.ticketPrice);
	const [locationCoverImage1, setLocationCoverImage1]   = useState(null);
	const [locationCoverImage2, setLocationCoverImage2]   = useState(null);
	const [locationCoverImage3, setLocationCoverImage3]   = useState(null);
	const [locationSliderImage1, setLocationSliderImage1] = useState(null);
	const [locationSliderImage2, setLocationSliderImage2] = useState(null);
	const [locationSliderImage3, setLocationSliderImage3] = useState(null);

	useEffect(() => {
		setLocationName(locationData.name);
		setLocationAddress(locationData.address);
		setLocationDescription(locationData.description);
		setLocationCity(locationData.city);
		setLocationState(locationData.state);
		setLocationCountry(locationData.country);
		setLocationPincode(locationData.pincode);
		setLocationLongitude(locationData.longitude);
		setLocationLatitude(locationData.latitude);
		setLocationCapacity(locationData.capacity);
		setLocationPrice(locationData.ticketPrice);
	}, [locationData]);


	const handleSave = async (event) => {
		event.preventDefault();
		console.log("Save Location Clicked");
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
		data.append("coverImage1", locationCoverImage1);
		data.append("coverImage2", locationCoverImage2);
		data.append("coverImage3", locationCoverImage3);
		data.append("sliderImage1", locationSliderImage1);
		data.append("sliderImage2", locationSliderImage2);
		data.append("sliderImage3", locationSliderImage3);


		console.log(data);

		try{
			const url = `http://localhost:4000/api/location/update-location/` + locationId;
			const response = await axios.post(url, data, {
				headers: {
					"Content-Type": "multipart/form-data"
				}, withCredentials: true });

			if (response.data.status === "success") {
				alert("Location Updated Successfully");
				console.log(response.data);
			}
			else{
				alert("Location Update Failed");
				console.log(response.data);
			}
		}
		catch(error){
			console.log(error);
			alert("Location Update Failed");
		}
	}

	return (
		<div>
			<div className="location-edit-info">

				<label htmlFor="location-name">Location Name</label>
				<input
					type="text"
					id="location-name"
					name="location-name"
					value={locationName}
					onChange={(event) => setLocationName(event.target.value)}
				/><br/>

				<label htmlFor="location-description">Location Description</label>
				<textarea
					type="text"
					id="location-description"
					name="location-description"
					value={locationDescription}
					onChange={(event) => setLocationDescription(event.target.value)}
				/><br/>

				<label htmlFor="location-address">Location Address</label>
				<input
					type="text"
					id="location-address"
					name="location-address"
					value={locationAddress}
					onChange={(event) => setLocationAddress(event.target.value)}
				/><br/>

				<label htmlFor="location-city">Location City</label>
				<input
					type="text"
					id="location-city"
					name="location-city"
					value={locationCity}
					onChange={(event) => setLocationCity(event.target.value)}
				/><br/>

				<label htmlFor="location-state">Location State</label>
				<input
					type="text"
					id="location-state"
					name="location-state"
					value={locationState}
					onChange={(event) => setLocationState(event.target.value)}
				/><br/>

				<label htmlFor="location-country">Location Country</label>
				<input
					type="text"
					id="location-country"
					name="location-country"
					value={locationCountry}
					onChange={(event) => setLocationCountry(event.target.value)}
				/><br/>

				<label htmlFor="location-pincode">Location Pincode</label>
				<input
					type="text"
					id="location-pincode"
					name="location-pincode"
					value={locationPincode}
					onChange={(event) => setLocationPincode(event.target.value)}
				/><br/>

				<label htmlFor="location-longitude">Location Longitude</label>
				<input
					type="text"
					id="location-longitude"
					name="location-longitude"
					value={locationLongitude}
					onChange={(event) => setLocationLongitude(event.target.value)}
				/><br/>

				<label htmlFor="location-latitude">Location Latitude</label>
				<input
					type="text"
					id="location-latitude"
					name="location-latitude"
					value={locationLatitude}
					onChange={(event) => setLocationLatitude(event.target.value)}
				/><br/>

				<label htmlFor="location-capacity">Location Capacity</label>
				<input
					type="text"
					id="location-capacity"
					name="location-capacity"
					value={locationCapacity}
					onChange={(event) => setLocationCapacity(event.target.value)}
				/><br/>

				<label htmlFor="location-price">Location Price</label>
				<input
					type="text"
					id="location-price"
					name="location-price"
					value={locationPrice}
					onChange={(event) => setLocationPrice(event.target.value)}
				/><br/>

				<label htmlFor="location-cover-image-1">Location Cover Image 1</label>
				<input
					type="file"
					id="location-cover-image-1"
					name="location-cover-image-1"
					onChange={(event) => setLocationCoverImage1(event.target.files[0])}
				/><br/>

				<label htmlFor="location-cover-image-2">Location Cover Image 2</label>
				<input
					type="file"
					id="location-cover-image-2"
					name="location-cover-image-2"
					onChange={(event) => setLocationCoverImage2(event.target.files[0])}
				/><br/>

				<label htmlFor="location-cover-image-3">Location Cover Image 3</label>
				<input
					type="file"
					id="location-cover-image-3"
					name="location-cover-image-3"
					onChange={(event) => setLocationCoverImage3(event.target.files[0])}
				/><br/>

				<label htmlFor="location-slider-image-1">Location Slider Image 1</label>
				<input
					type="file"
					id="location-slider-image-1"
					name="location-slider-image-1"
					onChange={(event) => setLocationSliderImage1(event.target.files[0])}
				/><br/>

				<label htmlFor="location-slider-image-2">Location Slider Image 2</label>
				<input
					type="file"
					id="location-slider-image-2"
					name="location-slider-image-2"
					onChange={(event) => setLocationSliderImage2(event.target.files[0])}
				/><br/>

				<label htmlFor="location-slider-image-3">Location Slider Image 3</label>
				<input
					type="file"
					id="location-slider-image-3"
					name="location-slider-image-3"
					onChange={(event) => setLocationSliderImage3(event.target.files[0])}
				/><br/>
			</div>

			<div className="back-button">
				<button onClick={() => props.setInEditableMode(false)}>Back</button>
			</div>

			<div className="save-button">
				<button onClick={(event) => handleSave(event)}>Save</button>
			</div>

		</div>
	)
}

export default UserProfileEdit;
