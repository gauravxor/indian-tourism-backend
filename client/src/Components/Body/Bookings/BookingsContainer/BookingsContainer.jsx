import React, { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import "./BookingsContainer.css";
import BookingCard from "../BookingCard/BookingCard.jsx";

import { AppContext } from "../../../../AppContext.js";

function BookingsContainer() {
    // eslint-disable-next-line
    const { context, setContext, resetContext } = useContext(AppContext);

    const [bookings, setBookings] = useState([]);

    /** As soon as we have the userId, fetch all the bookings under that UserId */
    useEffect(() => {
        const userId = context.userId;
        console.log("The user id is = " + userId);

        const url = `${window.location.protocol}//${window.location.hostname}:4000/api/user/bookings/${userId}`;

        axios
            .get(url, { withCredentials: true })
            .then((response) => {
                /** Check if token is expired */
                if (
                    response.data.status === "failure" &&
                    response.data.message === "Tokens Expired"
                ) {
                    alert("Session Expired. Please Login Again");
                    resetContext();
                } /** Check if we received a valid response */ else if (
                    response.data.status === "success"
                ) {
                    console.log("Successfully fetched bookings");
                    setBookings(response.data.userBookings);
                } else {
                    console.log("Faild to fetch bookings");
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
                    console.log("Faild to fetch bookings");
                }
            });
    }, [context.userId]); // eslint-disable-line

    return (
        <div className="bookings-card-container">
            {bookings.map((booking) => (
                <BookingCard key={uuidv4()} bookingData={booking} />
            ))}
        </div>
    );
}

export default BookingsContainer;
