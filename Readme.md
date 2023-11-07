<div align="center"><h1>Indian Tourism API Documentation</h1></div>
<b>All the APIs uses JSON Web Tokens (JWT) for authentication, which are automatically stored as HTTP Cookies. No manual token handling is required.</b>
<div align="center"><h2>User Authentication Endpoints</h2></div>

|     | API Endpoint                              | Method | Auth | Description             |
| --- | ----------------------------------------- | ------ | ---- | ----------------------- |
| 1.  | [/api/auth/login](#login)                 | POST   | NO   | Send a login request    |
| 2.  | [/api/auth/signup](#signup)               | POST   | NO   | Send a singup request   |
| 3.  | [/api/auth/logout](#logout)               | POST   | YES  | Logout the current user |
| 4.  | [/api/auth/forgot-password](#forgot-pass) | POST   | NO   | Reset the password      |

<div align="center"><h2>User Operation Endpoints</h2></div>

|     | API Endpoint                                            | Method | Auth | Description              |
| --- | ------------------------------------------------------- | ------ | ---- | ------------------------ |
| 1.  | [/api/update/user](#user-update)                        | POST   | YES  | Update User Details      |
| 2.  | [/api/user/details/{userId}](#user-details)             | GET    | YES  | Get user details         |
| 3.  | [/api/user/bookings/{userId}](#user-bookings)           | GET    | YES  | Get user's bookings      |
| 4.  | [/api/book/cancellations/{userId}](#user-cancellations) | GET    | YES  | Get user's cancellations |

<div align="center"><h2>Location Endpoints</h2></div>

|     | API Endpoint                                                   | Method | Auth | Description                     |
| --- | -------------------------------------------------------------- | ------ | ---- | ------------------------------- |
| 1.  | [/api/location/add-location/](#add-location)                   | POST   | YES  | Add new location                |
| 2.  | [/api/location/update-location/{locationId}](#update-location) | GET    | YES  | Update location data            |
| 3.  | [/api/location/](#random-location)                             | GET    | NO   | Get random locations            |
| 4.  | [/api/location/search/kolkata](#search-location)               | GET    | NO   | Search for a locations          |
| 5.  | [/api/location/get-availability/{locationId}](#location-avail) | GET    | NO   | Get Location's availablity data |

<div align="center"><h2>Booking Endpoints</h2></div>

|     | API Endpoint                                      | Method | Auth | Description                    |
| --- | ------------------------------------------------- | ------ | ---- | ------------------------------ |
| 1.  | [/api/book/lock/](#lock-booking)                  | POST   | YES  | Temporarily lock a booking     |
| 2.  | [/api/book/lock/details/{lockId}](#lock-details)  | GET    | YES  | Get booking lock details       |
| 3.  | [/api/book/final](#finalize-booking)              | POST   | YES  | Finalize the locked booking    |
| 4.  | [/api/book/cancel](#cancel-booking)               | POST   | YES  | Cancel a booking               |
| 5.  | [/api/book/cancel/approve](#approve-cancellation) | POST   | YES  | Approve a cancellation request |

<div align="center"><h2>One Time Password (OTP) Endpoints</h2></div>

|     | API Endpoint                        | Method | Auth | Description                                     |
| --- | ----------------------------------- | ------ | ---- | ----------------------------------------------- |
| 1.  | [/api/auth/resend-otp](#send-otp)   | POST   | YES  | Send email verification or password reset OTP   |
| 2.  | [/api/auth/verify-otp](#verify-otp) | POST   | \*   | Resend email verification or password reset OTP |

---

<div align="center"><h2> API Usage Instructions </h2></div>

<!-- Login API -->
<details>
<summary id="login"><h3>Creating a login request<h3></summary>

Send a `POST` request to the `/api/auth/login` endpoint.

```http
POST http://example.com/api/auth/login
Content-Type: application/json

{
    "email": "email@domain.com",
    "password": "yourPassword"
}
```

</details>

<!-- Signup API -->
<details>
<summary id="signup"><h3>Creating a signup request<h3></summary>

Send a `POST` request to the `/api/auth/signup` endpoint.

```http
POST http://example.com/api/auth/signup
Content-Type: application/json

{
    "email": "email@domain.com",
    "password": "yourPassword"
}
```

The request body should also contain the following information

`middleName`, `email`, `phone`, `addressMain`, `country`, `state`, `city`, `pincode`, `dob` with their values in **string** format.

</details>

<!-- LOGOUT API -->
<details>
<summary id="logout"><h3>Making a logout request<h3></summary>

Send a `POST` request to the `/api/auth/logout` endpoint.

```http
POST http://example.com/api/auth/logout
Content-Type: application/json

{
    "email": "email@domain.com",
}
```

</details>

<!-- FORGOT-PASSWORD -->
<details>
<summary id="forgot-pass"><h3>Resetting the password<h3></summary>

Send a `POST` request to the `/api/auth/forgot-password` endpoint.

```http
POST http://example.com/api/auth/forgot-password
Content-Type: application/json

{
    "email": "email@domain.com",
}
```

</details>

<!-- UPDATE USER ENDPOINT -->
<details>
<summary id="user-update"><h3>Updating user details<h3></summary>

Send a `POST` request to the `/api/update/user` endpoint.

```http
POST http://example.com/api/update/user
Content-Type: multipart/form-data

{
    "firstName": "modified-first-name",
    "lastName" : "modified-last-name",
    "email": "email@domain.com",
}
```

The multipart form data can also contain the following fields
`middleName`, `email`, `phone`, `addressMain`, `country`, `state`, `city`, `pincode`, `dob` in **string** format.

</details>

<!-- USER DETAILS ENDPOINT -->
<details>
<summary id="user-details"><h3>Fetching user details<h3></summary>

Send a `GET` request to the `/api/user/details/{userId}` endpoint.

```http
GET http://example.com/api/user/details/{userId}
```

</details>

<!-- USER BOOKINGS ENDPOINT -->
<details>
<summary id="user-bookings"><h3>Fetching all the locations booked by a user<h3></summary>

Send a `GET` request to the `/api/user/bookings/{userId}` endpoint.

```http
GET http://example.com/api/user/bookings/{userId}
```

</details>

<!-- USER CANCELLATIONS ENDPOINT -->
<details>
<summary id="user-cancellations"><h3>Fetching all the bookings cancelled by a user<h3></summary>

Send a `GET` request to the `/api/user/cancellations/{userId}` endpoint.

```http
GET http://example.com/api/user/cancellations/{userId}
```

</details>

<!-- ADD NEW LOCATION ENDPOINT -->
<details>
<summary id="add-location"><h3>Request to add a new location<h3></summary>

Send a `POST` request to the `/api/location/add-location` endpoint.

```http
POST http://example.com/api/location/add-location
Content-Type: application/json

{
    "name" : "name-of-the-location"
    "description" : "description-of-the-location"
    "address" : "address-of-the-location"
}
```

The request body JSON should also contain all these fields.
`city`, `state`, `country`, `pincode`, `latitude`, `longitude`, `ticketPrice` containing string data,

`cover-iamge1`, `cover-iamge2`, `cover-iamge3`, `slider-image1`, `slider-image2` and `slider-image3` containing image data.

</details>

<!-- UPDATE LOCATION ENDPOINT -->
<details>
<summary id="update-location"><h3>Updating a location data<h3></summary>

Send a `POST` request to the `/api/location/update-location/{locationId}` endpoint.

```http
POST http://example.com/api/location/update-location/{locationId}
Content-Type: application/json

{
    "name" : "updated-name"
    "description" : "updated-description"
    "address" : "updated-address"
}
```

The request body JSON MAY contain all these fields.
`city`, `state`, `country`, `pincode`, `latitude`, `longitude`, `ticketPrice` containing updatedstring data,
`cover-iamge1`, `cover-iamge2`, `cover-iamge3`, `slider-image1`, `slider-image2` and `slider-image3` containing updated image data.

</details>

<!-- RANDOM LOCATION -->
<details>
<summary id="random-location"><h3>Fetching random location's data<h3></summary>

Send a `GET` request to the `/api/location/` endpoint.

```http
GET http://example.com/api/location/
```

</details>

<!-- SEARCH LOCATION -->
<details>
<summary id="search-location"><h3>Search locations using search string<h3></summary>

Send a `GET` request to the `/api/location/search/{seaerchString}` endpoint.

```http
GET http://example.com/api/location/{searchString}
```

</details>

<!-- LOCATION AVAILABILITY DATA -->
<details>
<summary id="location-avail"><h3>Get location's availability data<h3></summary>

Send a `GET` request to the `/api/location/get-availability/{locationId}` endpoint.

```http
GET http://example.com/api/location/get-availability/{locationId}
```

</details>

<!-- LOCK BOOKNG ENDPOINT-->
<details>
<summary id="lock-booking"><h3>Temporarily lock a booking<h3></summary>

Send a `POST` request to the `/api/book/lock` endpoint.

```http
POST http://example.com/api/location/get-availability/{locationId}
Content-Type: application/json

{
    "locationId" : location-id,
    "noOfTickets" : 3,
    "bookingDate" : "01-01-0001"
}
```

</details>

<!-- GET BOOKING LOCK DETAILS -->
<details>
<summary id="lock-details"><h3>Fetch the booking lock details</h3></summary>

Send a `GET` request to the `/api/book/lock/details/{lockId}` endpoint.

```http
GET http://example.com/api/book/lock/details/{lockId}
```

</details>

<!-- FINALIZE THE BOOKING -->
<details>
<summary id="finalize-booking"><h3>Finalizing the booking using the lock ID</h3></summary>

Send a `POST` request to the `/api/book/final` endpoint.

```http
POST http://example.com/api/book/final
Content-Type: application/json

{
    "lockId" : 123,
    "paymentId": "random-payment-id"
}
```

</details>

<!-- CANCELLATION REQUEST -->
<details>
<summary id="cancel-booking"><h3>Submit a cancellation request to the admin</h3></summary>

Send a `POST` request to the `/api/book/cancel` endpoint.

```http
POST http://example.com/api/book/cancel
Content-Type: application/json

{
    "bookingId" : 123,
	"userId" : 1234
}
```

</details>

<!-- CANCELLATION APPROVAL -->
<details>
<summary id="approve-cancellation"><h3>Approving the ticket cancellation request</h3></summary>

Send a `POST` request to the `/api/book/cancel/approve` endpoint.

```http
POST http://example.com/api/book/cancel/approve
Content-Type: application/json

{
    "bookingId" : 123,
    "adminId" : 1234
}
```

</details>

<!-- RESEND OTP -->
<details>
<summary id="send-otp"><h3>Send OTP for email verification or password reset</h3></summary>

Send a `POST` request to the `/api/auth/resend-otp` endpoint.

```http
POST http://example.com/api/auth/resend-otp
Content-Type: application/json

{
	"email": "lipapad224@wiroute.com",
	"otpType": "passwordReset"
}
```

**otpType** key can accept two values.

Use `passwordReset` when the OTP is to validate user for password reset.

Use `emailVerification` the email of the user needs to be verified (during first signup)

</details>

<!-- VALIDATE OTP -->
<details>
<summary id="verify-otp"><h3>Verify the OTP sent to the user's email id</h3></summary>

Send a `POST` request to the `/api/auth/verify-otp` endpoint.

```http
POST http://example.com/api/auth/verify-otp
Content-Type: application/json

{
 	"email": "email@domain.com",
 	"otp": "anOtP",
	"otpType": "passwordReset"
}

```

**otpType** key can accept two values.

Use `passwordReset` when you want to validate the OTP sent to reset the password.

Use `emailVerification` when you want to validate the OTP sent to verify the user's email id.

</details>

---
