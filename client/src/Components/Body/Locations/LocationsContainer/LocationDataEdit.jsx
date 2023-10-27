import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import "./LocationDataEdit.css";
import Button from "../../../UI/Buttons/Button";
import { AppContext } from "../../../../AppContext";
const UserProfileEdit = (props) => {
    /** Saving the location id received from props */
    const locationId = props.locationId;

    const [locationData, setLocationData] = useState({});
    // eslint-disable-next-line
    const { context, setContext, resetContext } = useContext(AppContext);

    useEffect(() => {
        const url =
            `${window.location.protocol}//${window.location.hostname}:4000/api/location/` +
            locationId;

        axios
            .get(url, { withCredentials: true })
            .then((response) => {
                if (
                    response.data.status === "failure" &&
                    response.data.msg === "Tokens Expired"
                ) {
                    alert("Session Expired. Please Login Again");
                    resetContext();
                } else if (response.data.status === "success") {
                    console.log("Fetched location details");
                    setLocationData(response.data.location);
                }
            })
            .catch((error) => {
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
                    console.log("Error fetching location details");
                }
            });
    }, []); // eslint-disable-line

    /** React states to store the location details */
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

    const [locationCoverImage1, setLocationCoverImage1] = useState(null);
    const [locationCoverImage2, setLocationCoverImage2] = useState(null);
    const [locationCoverImage3, setLocationCoverImage3] = useState(null);

    const [locationSliderImage1, setLocationSliderImage1] = useState(null);
    const [locationSliderImage2, setLocationSliderImage2] = useState(null);
    const [locationSliderImage3, setLocationSliderImage3] = useState(null);

    /** As soon as location data is fetched, they are initialized with old values for user's ease */
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

    /** Function to handle operation if user clicks the save button to save the updated location data */
    const handleSave = async (event) => {
        event.preventDefault();

        console.log("Save Location Clicked");

        /** As we are dealing with multipart form data, FormApi is used to create object of data */
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

        try {
            const url =
                `${window.location.protocol}//${window.location.hostname}:4000/api/location/update-location/` +
                locationId;

            /** Sending out request with appropriate multipart headers */
            const response = await axios.post(url, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            if (response.data.status === "success") {
                alert("Location Updated Successfully");
            } else {
                alert("Location Update Failed");
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
                alert("Location Update Failed");
            }
        }
    };

    return (
        <>
            <div className="location-edit-info">
                <h2>Edit Location</h2>
                <form className="location-data-edit">
                    <div>
                        <label htmlFor="location-name">Location Name</label>
                        <input
                            type="text"
                            id="location-name"
                            name="location-name"
                            value={locationName}
                            onChange={(event) =>
                                setLocationName(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-description">
                            Location Description
                        </label>
                        <textarea
                            className="loc-desc"
                            type="text"
                            id="location-description"
                            name="location-description"
                            value={locationDescription}
                            onChange={(event) =>
                                setLocationDescription(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-address">
                            Location Address
                        </label>
                        <input
                            type="text"
                            id="location-address"
                            name="location-address"
                            value={locationAddress}
                            onChange={(event) =>
                                setLocationAddress(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-city">Location City</label>
                        <input
                            type="text"
                            id="location-city"
                            name="location-city"
                            value={locationCity}
                            onChange={(event) =>
                                setLocationCity(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-state">Location State</label>
                        <input
                            type="text"
                            id="location-state"
                            name="location-state"
                            value={locationState}
                            onChange={(event) =>
                                setLocationState(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-country">
                            Location Country
                        </label>
                        <input
                            type="text"
                            id="location-country"
                            name="location-country"
                            value={locationCountry}
                            onChange={(event) =>
                                setLocationCountry(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-pincode">
                            Location Pincode
                        </label>
                        <input
                            type="text"
                            id="location-pincode"
                            name="location-pincode"
                            value={locationPincode}
                            onChange={(event) =>
                                setLocationPincode(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-longitude">
                            Location Longitude
                        </label>
                        <input
                            type="text"
                            id="location-longitude"
                            name="location-longitude"
                            value={locationLongitude}
                            onChange={(event) =>
                                setLocationLongitude(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-latitude">
                            Location Latitude
                        </label>
                        <input
                            type="text"
                            id="location-latitude"
                            name="location-latitude"
                            value={locationLatitude}
                            onChange={(event) =>
                                setLocationLatitude(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-capacity">
                            Location Capacity
                        </label>
                        <input
                            type="text"
                            id="location-capacity"
                            name="location-capacity"
                            value={locationCapacity}
                            onChange={(event) =>
                                setLocationCapacity(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-price">Location Price</label>
                        <input
                            type="text"
                            id="location-price"
                            name="location-price"
                            value={locationPrice}
                            onChange={(event) =>
                                setLocationPrice(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-cover-image-1">
                            Location Cover Image 1
                        </label>
                        <input
                            type="file"
                            id="location-cover-image-1"
                            name="location-cover-image-1"
                            onChange={(event) =>
                                setLocationCoverImage1(event.target.files[0])
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-cover-image-2">
                            Location Cover Image 2
                        </label>
                        <input
                            type="file"
                            id="location-cover-image-2"
                            name="location-cover-image-2"
                            onChange={(event) =>
                                setLocationCoverImage2(event.target.files[0])
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-cover-image-3">
                            Location Cover Image 3
                        </label>
                        <input
                            type="file"
                            id="location-cover-image-3"
                            name="location-cover-image-3"
                            onChange={(event) =>
                                setLocationCoverImage3(event.target.files[0])
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-slider-image-1">
                            Location Slider Image 1
                        </label>
                        <input
                            type="file"
                            id="location-slider-image-1"
                            name="location-slider-image-1"
                            onChange={(event) =>
                                setLocationSliderImage1(event.target.files[0])
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-slider-image-2">
                            Location Slider Image 2
                        </label>
                        <input
                            type="file"
                            id="location-slider-image-2"
                            name="location-slider-image-2"
                            onChange={(event) =>
                                setLocationSliderImage2(event.target.files[0])
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="location-slider-image-3">
                            Location Slider Image 3
                        </label>
                        <input
                            type="file"
                            id="location-slider-image-3"
                            name="location-slider-image-3"
                            onChange={(event) =>
                                setLocationSliderImage3(event.target.files[0])
                            }
                        />
                    </div>
                    <div className="buttons">
                        <Button
                            className="btn1"
                            onClick={() => props.setInEditableMode(false)}
                        >
                            Back
                        </Button>
                        <Button
                            className="btn2"
                            onClick={(event) => handleSave(event)}
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </div>

            {/* If user clicks the edit button, the inEditableMode state will be changed in parent component and
				location edit form component will be rendered */}
        </>
    );
};

export default UserProfileEdit;
