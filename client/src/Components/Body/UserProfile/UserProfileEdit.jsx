import axios from "axios";
import React, { useState, useContext } from "react";
import "./UserProfileEdit.css";
import { cloneDeep } from "lodash";
import classes from "../../UI/Buttons/Button.module.css";
import { AppContext } from "../../../AppContext";

const UserProfileEdit = (props) => {
    const userDetails = cloneDeep(props.userDetails);

    // eslint-disable-next-line
    const { context, setContext, resetContext } = useContext(AppContext);

    const [userImage, setUserImage] = useState(null);

    /** React states to store the updated user data. They are initialized with old data for ease of user */
    const [firstName, setFirstName] = useState(userDetails.name.firstName);
    const [middleName, setMiddleName] = useState(userDetails.name.middleName);
    const [lastName, setLastName] = useState(userDetails.name.lastName);
    const [dob, setDob] = useState(userDetails.dob);
    const [gender, setGender] = useState(userDetails.gender);
    const [email, setEmail] = useState(userDetails.contact.email);
    const [phone, setPhone] = useState(userDetails.contact.phone);
    const [country, setCountry] = useState(userDetails.address.country);
    const [address, setAddress] = useState(userDetails.address.addressMain);
    const [state, setState] = useState(userDetails.address.state);
    const [city, setCity] = useState(userDetails.address.city);
    const [pincode, setPincode] = useState(userDetails.address.pincode);

    /** Function to handle the saving of updated user data */
    const handleSave = async (event) => {
        event.preventDefault();

        /** Since the API post request will contain multipart form data, we are using FormApi to save data */
        const data = new FormData();
        data.append("userImage", userImage);
        data.append("firstName", firstName);
        data.append("middleName", middleName);
        data.append("lastName", lastName);
        data.append("dob", dob);
        data.append("gender", gender);
        data.append("phone", phone);
        data.append("email", email);
        data.append("addressMain", address);
        data.append("city", city);
        data.append("state", state);
        data.append("country", country);
        data.append("pincode", pincode);

        console.log(data);

        try {
            const url = `${window.location.protocol}//${window.location.hostname}:4000/api/update/user`;

            /** Calling the Update API with proper headers for multipart data */
            const response = await axios.post(url, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            if (
                response.data.status === "failure" &&
                response.data.msg === "Tokens Expired"
            ) {
                alert("Session Expired. Please Login Again");
                resetContext();
            } else if (response.data.status === "success") {
                console.log("User details updated successfully");
                alert("User details updated successfully");
            } else {
                console.log("Error updating user details");
                alert("Error updating user details");
            }
        } catch (error) {
            const response = error.response.data;
            if (response.msg === "User not logged in") {
                console.log("User not logged in");
                resetContext();
                alert("Session Expired. Please Login Again!");
            } else if (response.msg === "Duplicate session") {
                console.log("Duplicate session");
                resetContext();
                alert("Duplicate session. Please Login Again!");
            } else {
                console.log(error);
                alert("Error updating user details");
            }
        }
    };

    return (
        <div className="main">
            <form className="user-info-edit">
                <label htmlFor="userImage">User Image</label>
                <input
                    type="file"
                    name="userImage"
                    id="userImage"
                    onChange={(e) => setUserImage(e.target.files[0])}
                />{" "}
                <br />
                <label htmlFor="firstName">First Name</label>
                <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder={firstName}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />{" "}
                <br />
                <label htmlFor="middleName">Middle Name</label>
                <input
                    type="text"
                    name="middleName"
                    id="middleName"
                    placeholder={middleName}
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                />{" "}
                <br />
                <label htmlFor="lastName">Last Name</label>
                <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder={lastName}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />{" "}
                <br />
                <label htmlFor="Gender">Gender</label>
                <div className="gender">
                    <label htmlFor="male">Male</label>
                    <input
                        type="radio"
                        id="male"
                        name="gender"
                        value={gender}
                        onChange={(e) => setGender("male")}
                    />
                    <label htmlFor="female">Female</label>
                    <input
                        type="radio"
                        id="female"
                        name="gender"
                        value={gender}
                        onChange={(e) => setGender("female")}
                    />
                    <label htmlFor="others">Others</label>
                    <input
                        type="radio"
                        id="others"
                        name="gender"
                        value={gender}
                        onChange={(e) => setGender("others")}
                    />
                    <br />
                </div>
                <label htmlFor="phone">Phone</label>
                <input
                    type="number"
                    name="phone"
                    id="phone"
                    placeholder={phone}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />{" "}
                <br />
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder={email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />{" "}
                <br />
                <label htmlFor="addressMain">Address</label>
                <input
                    type="text"
                    name="addressMain"
                    id="addressMain"
                    placeholder={address}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />{" "}
                <br />
                <label htmlFor="city">City</label>
                <input
                    type="text"
                    name="city"
                    id="city"
                    placeholder={city}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />{" "}
                <br />
                <label htmlFor="state">State</label>
                <input
                    type="text"
                    name="state"
                    id="state"
                    placeholder={state}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                />{" "}
                <br />
                <label htmlFor="country">Country</label>
                <input
                    type="text"
                    name="country"
                    id="country"
                    placeholder={country}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />{" "}
                <br />
                <label htmlFor="pincode">Pincode</label>
                <input
                    type="number"
                    name="pincode"
                    id="pincode"
                    placeholder={pincode}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                />{" "}
                <br />
                <label htmlFor="dob">Date of Birth</label>
                <input
                    type="date"
                    name="dob"
                    id="dob"
                    placeholder={dob}
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                />{" "}
                <br />
            </form>

            {/* Back button to allow user go back one step, in case if they don't want to save the changes */}
            <div className="btn">
                <div className="back-button">
                    <button
                        className={`${props.className} ${classes.button} `}
                        onClick={() => props.setInEditableMode(false)}
                    >
                        Back
                    </button>
                </div>

                {/* Save button to save the changes made by the user */}
                <div className="save-button">
                    <button
                        className={`${props.className} ${classes.button} `}
                        onClick={(event) => handleSave(event)}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfileEdit;
