import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import Button 			from "../../UI/Buttons/Button";
import { AppContext }	from '../../../AppContext.js'

import "./SignUpModal.css";

const SignUpModal = () => {

	const { context, setContext } = useContext(AppContext);

	/** React states to store the user input data */
	const [firstName, setFirstName] 	= useState("");
	const [middleName, setMiddleName] 	= useState("");
	const [lastName, setLastName] 		= useState("");
	const [dob, setDob] 				= useState("");
	const [gender, setGender] 			= useState("");

	const [email, setEmail] 			= useState("");
	const [phone, setPhone] 			= useState("");
	const [password, setPassword] 		= useState("");

	const [country, setCountry] 		= useState("");
	const [address, setAddress] 		= useState("");
	const [state, setState] 			= useState("");
	const [city, setCity] 				= useState("");
	const [pincode, setPincode] 		= useState("");

	/** To store the user sign up status message */
	const [signUpMessage, setSignUpMessage] = useState("");

	/** Function to handle modal close click */
	const handleModalClose = () => {
		console.log("Sign Up Modal Closed")
		setContext({ ...context, isSignUpModalOpen: false});
	};


	const handleSubmit = async (e) => {
		e.preventDefault();

		console.log("Sign up form submitted");
		setSignUpMessage("Signing Up...");
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
			gender: gender,
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

		try{
			const url = "http://localhost:4000/api/auth/signup";
			const response = await axios.post(url, data);
			if(response.data.status === "success"){
				setSignUpMessage("Sign Up Successful");

				/** Wait for 2 seconds and then close the signup modal and show OTP modal */
				setTimeout(() => {
					setContext({...context, isLoggenIn: false, isSignUpModalOpen: false,
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

	useEffect(() => {
		setTimeout(() => {
			setSignUpMessage("");
		}, 3000);
	}, [signUpMessage]);


	return (
		<div className="modal">
			<div className="modal__content">
				{/* Modal Close Button */}
				<Button className="close" onClick={() => handleModalClose()}>&times;</Button>

				{/* Modal Content */}
				<h2>Sign Up here</h2>
				<form onSubmit={handleSubmit}>

					<label htmlFor="firstName" placeholder="Enter your first name">First Name:</label><br/>
					<input
						type="text"
						id="firstName"
						name="firstName"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
					/> <br/><br/>

					<label htmlFor="middleName" placeholder="Enter your middle name">Middle Name:</label><br/>
					<input
						type="text"
					id="middleName"
					name="middleName"
					value={middleName}
					onChange={(e) => setMiddleName(e.target.value)}
					/> <br/><br/>

					<label htmlFor="LastName" placeholder="Enter your last name">Last Name:</label><br/>
					<input
						type="text"
						id="lastName"
						name="lastName"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						required
					/> <br/><br/>

					<label htmlFor="gender">Gender : </label>
					<div className='gender'>
						<label htmlFor="male">Male</label>
						<input
							type="radio"
							id="male"
							name="gender"
							value={gender}
							onChange={(e) => setGender("male")}
							required
						/>
						<label htmlFor="female">Female</label>
						<input
							type="radio"
							id="female"
							name="gender"
							value={gender}
							onChange={(e) => setGender("female")}
							required
						/>
						<label htmlFor="others">Others</label>
						<input
							type="radio"
							id="others"
							name="gender"
							value={gender}
							onChange={(e) => setGender("others")}
						/>
					</div><br/>

					<label htmlFor="dob">Date of Birth:</label><br/>
					<input
						type="date"
						id="dob"
						name="dob"
						value={dob}
						onChange={(e) => setDob(e.target.value)}
						required
					/> <br/><br/>

					<label htmlFor="email" placeholder="xyz@gmail.com">Email:</label><br/>
					<input
						type="email"
						id="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/> <br/><br/>

					<label htmlFor="phone">Phone:</label><br/>
					<input
						type="tel"
						id="phone"
						name="phone"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						required
					/> <br/><br/>

					<label htmlFor="password">Password:</label><br/>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/> <br/><br/>

					<label htmlFor="country">Country:</label><br/>
					<input
						type="text"
						id="country"
						name="country"
						value={country}
						onChange={(e) => setCountry(e.target.value)}
						required
					/> <br/><br/>

					<label htmlFor="address">Address:</label><br/>
					<input
						type="text"
						id="address"
						name="address"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						required
					/> <br/><br/>

					<label htmlFor="state">State:</label><br/>
					<input
						type="text"
						id="state"
						name="state"
						value={state}
						onChange={(e) => setState(e.target.value)}
						required
					/> <br/><br/>

					<label htmlFor="city">City:</label><br/>
					<input
						type="text"
						id="city"
						name="city"
						value={city}
						onChange={(e) => setCity(e.target.value)}
						required
					/> <br/><br/>

					<label htmlFor="pincode">Pincode:</label><br/>
					<input
						type="text"
						id="pincode"
						name="pincode"
						value={pincode}
						onChange={(e) => setPincode(e.target.value)}
						required
					/> <br/><br/>
					<Button type="submit">Submit</Button>
				</form>

				<div>
					<h1>{signUpMessage}</h1>
				</div>
			</div>
		</div>
	);
};

export default SignUpModal;