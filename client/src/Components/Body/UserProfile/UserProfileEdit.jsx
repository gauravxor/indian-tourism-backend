import axios from 'axios';
import React, { useState } from 'react';
import './UserProfileEdit.css';
import {cloneDeep } from 'lodash';



const UserProfileEdit = (props) => {

	const userDetails = cloneDeep(props.userDetails);

	const [userImage, setUserImage] 		= useState(null);

	const [firstName, setFirstName] 	= useState(userDetails.name.firstName);
	const [middleName, setMiddleName] 	= useState(userDetails.name.middleName);
	const [lastName, setLastName] 		= useState(userDetails.name.lastName);
	const [dob, setDob] 				= useState(userDetails.dob);
	const [email, setEmail] 			= useState(userDetails.contact.email);
	const [phone, setPhone] 			= useState(userDetails.contact.phone)
	const [country, setCountry] 		= useState(userDetails.address.country);
	const [address, setAddress] 		= useState(userDetails.address.addressMain);
	const [state, setState] 			= useState(userDetails.address.state);
	const [city, setCity] 				= useState(userDetails.address.city);
	const [pincode, setPincode] 		= useState(userDetails.address.pincode);


	const handleSave = async (event) => {
		event.preventDefault();
		const data = new FormData();
		data.append("userImage", userImage);
		data.append("firstName", firstName);
		data.append("middleName", middleName);
		data.append("lastName", lastName);
		data.append("dob", dob);
		data.append("phone", phone);
		data.append("email", email);
		data.append("addressMain", address);
		data.append("city", city);
		data.append("state", state);
		data.append("country", country);
		data.append("pincode", pincode);

		console.log(data);


		try{
			const url = "http://localhost:4000/api/update/user";
			const response = await axios.post(url, data, {
				headers: {
					"Content-Type": "multipart/form-data"
				}, withCredentials: true });

			console.log("Data type of response object = ", + typeof(response));
			console.log(response);
			if (response.data.status === "success") {
				alert("User details updated successfully");
			}
			else {
				alert("Error updating user details");
			}
		}
		catch(error){
			console.log(error);
			alert("Error updating user details");
		}

	}



	return (
		<div>
			<div className="user-info">
				<label htmlFor='userImage'>User Image</label>
				<input
					type="file"
					name="userImage"
					id="userImage"
					onChange={(e) => setUserImage(e.target.files[0])}
				/> <br/>

				<label htmlFor="firstName">First Name</label>
				<input
					type="text"
					name="firstName"
					id="firstName"
					placeholder={firstName}
					value= {firstName}
					onChange={(e) => setFirstName(e.target.value)}
				/> <br/>

				<label htmlFor="middleName">Middle Name</label>
				<input
					type="text"
					name="middleName"
					id="middleName"
					placeholder={middleName}
					value= {middleName}
					onChange={(e) => setMiddleName(e.target.value)}
				/> <br/>

				<label htmlFor="lastName">Last Name</label>
				<input
					type="text"
					name="lastName"
					id="lastName"
					placeholder={lastName}
					value= {lastName}
					onChange={(e) => setLastName(e.target.value)}
				/> <br/>


				<label htmlFor='phone'>Phone</label>
				<input
					type="number"
					name="phone"
					id="phone"
					placeholder={phone}
					value= {phone}
					onChange={(e) => setPhone(e.target.value)}
				/> <br/>

				<label htmlFor='email'>Email</label>
				<input
					type="email"
					name="email"
					id="email"
					placeholder={email}
					value= {email}
					onChange={(e) => setEmail(e.target.value)}
				/> <br/>

				<label htmlFor='addressMain'>Address</label>
				<input
					type="text"
					name="addressMain"
					id="addressMain"
					placeholder={address}
					value= {address}
					onChange={(e) => setAddress(e.target.value)}
				/> <br/>

				<label htmlFor='city'>City</label>
				<input
					type="text"
					name="city"
					id="city"
					placeholder={city}
					value= {city}
					onChange={(e) => setCity(e.target.value)}
				/> <br/>

				<label htmlFor='state'>State</label>
				<input
					type="text"
					name="state"
					id="state"
					placeholder={state}
					value= {state}
					onChange={(e) => setState(e.target.value)}
				/> <br/>

				<label htmlFor='country'>Country</label>
				<input
					type="text"
					name="country"
					id="country"
					placeholder={country}
					value= {country}
					onChange={(e) => setCountry(e.target.value)}
				/> <br/>

				<label htmlFor='pincode'>Pincode</label>
				<input
					type="number"
					name="pincode"
					id="pincode"
					placeholder={pincode}
					value= {pincode}
					onChange={(e) => setPincode(e.target.value)}
				/> <br/>

				<label htmlFor='dob'>Date of Birth</label>
				<input
					type="date"
					name="dob"
					id="dob"
					placeholder={dob}
					value= {dob}
					onChange={(e) => setDob(e.target.value)}
				/> <br/>
			</div>
			<div className="back-button">
				<button onClick={() => props.setInEditableMode(false)}>Back</button>
			</div>
			<div className="save-button">
				<button onClick={(event) => handleSave(event)}>Save</button>
			</div>
		</div>
	);
};

export default UserProfileEdit;
