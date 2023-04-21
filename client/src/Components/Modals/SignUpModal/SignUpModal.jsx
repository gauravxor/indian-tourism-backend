import "./SignUpModal.css";

import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from '../../../AppContext.js'



const SignUpModal = () => {

	const { context, setContext } = useContext(AppContext);

	const [firstName, setFirstName] 	= useState("");
	const [middleName, setMiddleName] 	= useState("");
	const [lastName, setLastName] 		= useState("");
	const [dob, setDob] 				= useState("");

	const [email, setEmail] 			= useState("");
	const [phone, setPhone] 			= useState("");
	const [password, setPassword] 		= useState("");

	const [country, setCountry] 		= useState("");
	const [address, setAddress] 		= useState("");
	const [state, setState] 			= useState("");
	const [city, setCity] 				= useState("");
	const [pincode, setPincode] 		= useState("");


	const [signUpMessage, setSignUpMessage] = useState("");


	const handleModalClose = () => {
		console.log("Sign Up Modal Closed")
		setContext({ ...context, isSignUpModalOpen: false});
	};


	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("Form Submitted");


		const data = {

			name: {
				firstName: firstName,
				middleName: middleName,
				lastName: lastName,
			},

			contact: {
				email: email,
				phone: phone
			},
			password: password,
			address: {
				addressMain: address,
				country: country,
				state: state,
				city: city,
				pincode: pincode
			},
			dob: dob,
		};

		console.log(data);

		try{
			const response = await axios.post("http://localhost:4000/api/auth/signup", data);
			console.log(response.data);
			if(response.data.status === "success"){
				setSignUpMessage("Sign Up Successful");
				setTimeout(() => {
					setContext({...context, isLoggenIn: true, isSignUpModalOpen: false,
						isOtpModalOpen: true, userEmail: email, userId: response.data.userId});
				}, 2000);
			}
			else{
				console.log("Error in signup");
				setSignUpMessage("Error in signup");
			}
		}
		catch {
			console.log("Error in signup");
			setSignUpMessage("Error in signup");
		}
	};


	return (
		<div className="modal">
			<div className="modal-content">
				<span className="close" onClick={() => handleModalClose()}>&times;</span>

				<h2>Sign Up</h2>
				<form onSubmit={handleSubmit}>

					<label htmlFor="firstName">First Name:</label>
					<input
						type="text"
						id="firstName"
						name="firstName"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
					/> <br/>

					<label htmlFor="middleName">Middle Name:</label>
					<input
						type="text"
					id="middleName"
					name="middleName"
					value={middleName}
					onChange={(e) => setMiddleName(e.target.value)}
					required
					/> <br/>

					<label htmlFor="LastName">Last Name:</label>
					<input
						type="text"
						id="lastName"
						name="lastName"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						required
					/> <br/>


					<label htmlFor="dob">Date of Birth:</label>
					<input
						type="date"
						id="dob"
						name="dob"
						value={dob}
						onChange={(e) => setDob(e.target.value)}
						required
					/> <br/>


					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/> <br/>

					<label htmlFor="phone">Phone:</label>
					<input
						type="tel"
						id="phone"
						name="phone"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						required
					/> <br/>


					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/> <br/>

					<label htmlFor="country">Country:</label>
					<input
						type="text"
						id="country"
						name="country"
						value={country}
						onChange={(e) => setCountry(e.target.value)}
						required
					/> <br/>

					<label htmlFor="address">Address:</label>
					<input
						type="text"
						id="address"
						name="address"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						required
					/> <br/>

					<label htmlFor="state">State:</label>
					<input
						type="text"
						id="state"
						name="state"
						value={state}
						onChange={(e) => setState(e.target.value)}
						required
					/> <br/>

					<label htmlFor="city">City:</label>
					<input
						type="text"
						id="city"
						name="city"
						value={city}
						onChange={(e) => setCity(e.target.value)}
						required
					/> <br/>

					<label htmlFor="pincode">Pincode:</label>
					<input
						type="text"
						id="pincode"
						name="pincode"
						value={pincode}
						onChange={(e) => setPincode(e.target.value)}
						required
					/> <br/>
					<button type="submit">Submit</button>
				</form>
				<div> <h1>{signUpMessage}</h1> </div>
			</div>
		</div>
	);
};

export default SignUpModal;