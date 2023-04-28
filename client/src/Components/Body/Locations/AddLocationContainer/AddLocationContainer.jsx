import React, {useState} from 'react'
import axios from 'axios';
const AddLocationContainer = () => {

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



	const handleAddLocation = async (event) => {
		event.preventDefault();
		console.log("Add Location Clicked");

		event.preventDefault();

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
			const url = "http://localhost:4000/api/location/add-location/";
			const response = await axios.post(url, data, {
				headers: {
					"Content-Type": "multipart/form-data"
				}, withCredentials: true });

			console.log(response);
			if (response.data.status === "success") {
				alert("Location was succeesfully added to the database");
			}
			else {
				alert("Error adding location to the database");
			}
		}
		catch(error){
			console.log(error);
			alert("Error adding location to the database");
		}
	}



	return (
		<div>
			<h1>Add Location To Database</h1>
			<form onSubmit={handleAddLocation}>
				<label htmlFor="location-name">Location Name</label>
				<input
					type="text"
					id="location-name"
					name="location-name"
					placeholder="Location Name"
					value = {locationName}
					onChange = {(e) => setLocationName(e.target.value)}
				/> <br/>

				<label htmlFor="location-address">Location Address</label>
				<input
					type="text"
					id="location-address"
					name="location-address"
					placeholder="Location Address"
					value = {locationAddress}
					onChange = {(e) => setLocationAddress(e.target.value)}
				/> <br/>

				<label htmlFor="location-description">Location Description</label>
				<input
					type="text"
					id="location-description"
					name="location-description"
					placeholder="Location Description"
					value = {locationDescription}
					onChange = {(e) => setLocationDescription(e.target.value)}
				/> <br/>

				<label htmlFor="location-city" >Location City</label>
				<input
					type="text"
					id="location-city"
					name="location-city"
					placeholder="Location City"
					value = {locationCity}
					onChange = {(e) => setLocationCity(e.target.value)}
				/> <br/>

				<label htmlFor="location-state">Location State</label>
				<input
					type="text"
					id="location-state"
					name="location-state"
					placeholder="Location State"
					value = {locationState}
					onChange = {(e) => setLocationState(e.target.value)}
				/> <br/>

				<label htmlFor="location-country">Location Country</label>
				<input
					type="text"
					id="location-country"
					name="location-country"
					placeholder="Location Country"
					value = {locationCountry}
					onChange = {(e) => setLocationCountry(e.target.value)}
				/> <br/>

				<label htmlFor="location-pincode">Location Pincode</label>
				<input
					type="text"
					id="location-pincode"
					name="location-pincode"
					placeholder="Location Pincode"
					value = {locationPincode}
					onChange = {(e) => setLocationPincode(e.target.value)}
				/> <br/>

				<label htmlFor="location-longitude">Location Longitude</label>
				<input
					type="text"
					id="location-longitude"
					name="location-longitude"
					placeholder="Location Longitude"
					value = {locationLongitude}
					onChange = {(e) => setLocationLongitude(e.target.value)}
				/> <br/>

				<label htmlFor="location-latitude">Location Latitude</label>
				<input
					type="text"
					id="location-latitude"
					name="location-latitude"
					placeholder="Location Latitude"
					value = {locationLatitude}
					onChange = {(e) => setLocationLatitude(e.target.value)}
				/> <br/>

				<label htmlFor="location-capacity">Location Capacity</label>
				<input
					type="number"
					id="location-capacity"
					name="location-capacity"
					placeholder="Location Capacity"
					value = {locationCapacity}
					onChange = {(e) => setLocationCapacity(e.target.value)}
				/> <br/>

				<label htmlFor="location-price">Location Price</label>
				<input
					type="number"
					id="location-price"
					name="location-price"
					placeholder="Location Price"
					value = {locationPrice}
					onChange = {(e) => setLocationPrice(e.target.value)}
				/> <br/>

				<label htmlFor="location-cover-image1">Location Cover Image 1</label>
				<input
					type="file"
					id="location-cover-image1"
					name="location-cover-image1"
					placeholder="Location Cover Image 1"
					onChange = {(e) => setLocationCoverImage1(e.target.files[0])}
				/> <br/>

				<label htmlFor="location-cover-image2">Location Cover Image 2</label>
				<input
					type="file"
					id="location-cover-image2"
					name="location-cover-image2"
					placeholder="Location Cover Image 2"
					onChange = {(e) => setLocationCoverImage2(e.target.files[0])}
				/> <br/>

				<label htmlFor="location-cover-image3">Location Cover Image 3</label>
				<input
					type="file"
					id="location-cover-image3"
					name="location-cover-image3"
					placeholder="Location Cover Image 3"
					onChange = {(e) => setLocationCoverImage3(e.target.files[0])}
				/> <br/>

				<label htmlFor="location-slider-image1">Location Slider Image 1</label>
				<input
					type="file"
					id="location-slider-image1"
					name="location-slider-image1"
					placeholder="Location Slider Image 1"
					onChange = {(e) => setLocationSliderImage1(e.target.files[0])}
				/> <br/>


				<label htmlFor="location-slider-image2">Location Slider Image 2</label>
				<input
					type="file"
					id="location-slider-image2"
					name="location-slider-image2"
					placeholder="Location Slider Image 2"
					onChange = {(e) => setLocationSliderImage2(e.target.files[0])}
				/> <br/>

				<label htmlFor="location-slider-image3">Location Slider Image 3</label>
				<input
					type="file"
					id="location-slider-image3"
					name="location-slider-image3"
					placeholder="Location Slider Image 3"
					onChange = {(e) => setLocationSliderImage3(e.target.files[0])}
				/> <br/> <br/>

				<button type="submit">Add Location</button>
			</form>
		</div>
	)
};

export default AddLocationContainer;