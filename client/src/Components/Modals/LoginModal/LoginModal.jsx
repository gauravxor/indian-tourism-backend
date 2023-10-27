import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import Button from "../../UI/Buttons/Button";
import { defaultUserLogo } from "../../../fileUrls";

import { AppContext } from "../../../AppContext.js";
import "./LoginModal.css";

const resendOtp = async (userEmail) => {
    const data = {
        email: userEmail,
        otpType: "emailVerification",
    };
    console.log(data);

    try {
        const url = `${window.location.protocol}//${window.location.hostname}:4000/api/auth/resend-otp`;
        const response = await axios.post(url, data);
        console.log(response.data);
        return response.data.status;
    } catch (error) {
        const response = error.response.data;
        if (response.msg === "User not logged in") {
            console.log("User not logged in");
            alert("Session Expired. Please Login Again!");
        } else if (response.msg === "Duplicate session") {
            console.log("Duplicate session");
            alert("Duplicate session. Please Login Again!");
        } else {
            console.log(error);
        }
    }
};

const LoginModal = () => {
    const { context, setContext, resetContext } = useContext(AppContext);

    /** To store the user login email id */
    const [email, setEmail] = useState("");

    /** To store the user login password */
    const [password, setPassword] = useState("");

    /** To store if the user is admin or not */
    const [isAdmin, setIsAdmin] = useState(false);

    /** To store the login message to be displayed to user */
    const [loginMessage, setLoginMessage] = useState("");

    /** To store the email validation message */
    const [emailError, setEmailError] = useState("");

    /** User email id validation */
    useEffect(() => {
        /** RFC 2822 standard email validation regualr expression string */
        if (email !== "") {
            // eslint-disable-next-line
            var mailFormat = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
            email.match(mailFormat)
                ? setEmailError("")
                : setEmailError("Invalid Email");
        }
    }, [email]);

    /** Function to handle things when user clicks the SUBMIT button in login form */
    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (emailError !== "") {
            setLoginMessage("Please enter a valid email");
            return;
        }

        const data = {
            email: email,
            password: password,
            isAdmin: isAdmin.toString(),
        };

        try {
            const url = `${window.location.protocol}//${window.location.hostname}:4000/api/auth/login`;
            const response = await axios.post(url, data);
            if (
                response.data.status === "failure" &&
                response.data.msg === "Tokens Expired"
            ) {
                alert("Session Expired. Please Login Again");
                resetContext();
            } else if (response.data.status === "success") {
                setLoginMessage("Login Successful");

                /** Wait for 2 seconds and then close the login modal */
                setTimeout(() => {
                    setContext({
                        ...context,
                        isLoggedIn: true,
                        isLoginModalOpen: false,
                        isUserAdmin: isAdmin,
                        userEmail: email,
                        userId: response.data.userId,
                    });
                }, 2000);
            } /** If the user is having a duplicate session */ else if (
                response.data.msg === "Duplicate Session"
            ) {
                setLoginMessage(
                    "Existing session found. Please Logout to continue."
                );

                setTimeout(() => {
                    setContext({
                        ...context,
                        isLoggedIn: true,
                        isLoginModalOpen: false,
                        isUserAdmin: isAdmin,
                        userEmail: email,
                        userId: response.data.userId,
                    });
                }, 2000);
            } /** If the user has not verified the email yet */ else if (
                response.data.msg === "Email not verified"
            ) {
                setLoginMessage(
                    "Email not verified. Please verify your email to continue."
                );
                const isOtpResent = await resendOtp(email);
                if (isOtpResent === "success") {
                    console.log("OTP resent successfully");
                    console.log("User id is: " + JSON.stringify(response.data));
                    setContext({
                        ...context,
                        isLoggedIn: false,
                        isUserAdmin: isAdmin,
                        userEmail: email,
                        userId: response.data.userId,
                        isOtpModalOpen: true,
                        isLoginModalOpen: false,
                    });
                }
            } else {
                setLoginMessage("Invalid Credentials or user does not exist");
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
                console.log("Error in login");
                setLoginMessage("Invalid Credentials or user does not exist");
            }
        }
    };

    const handleModalClose = () => {
        console.log("Login Modal Closed");
        setContext({ ...context, isLoginModalOpen: false });
    };

    const handlePasswordReset = () => {
        console.log("Password Reset Clicked");
        setContext({
            ...context,
            isForgotPasswordModalOpen: true,
            isLoginModalOpen: false,
        });
    };

    return (
        <div className="modal">
            <div className="modal_content">
                <div className="heade"></div>
                <Button className="close" onClick={() => handleModalClose()}>
                    &times;
                </Button>

                <div className="login">
                    <img
                        src={defaultUserLogo}
                        alt="dummy img"
                        className="image"
                    />
                    <form onSubmit={handleLoginSubmit}>
                        <div className="control">
                            <label>Email Id:</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <br />
                            <br />
                            {emailError && (
                                <>
                                    <br />
                                    <div className="errorContainer">
                                        {emailError}
                                    </div>
                                </>
                            )}
                            <br />

                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="checkbox">
                            <label>Is Admin:</label>
                            <br />
                            <input
                                type="checkbox"
                                name="isAdmin"
                                className="isadmin"
                                value={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            />
                        </div>
                        <br />
                        <br />
                        <Button className="actions" type="submit">
                            Login
                        </Button>
                    </form>
                    <div className="forgot-password">
                        <Button
                            type="button"
                            onClick={() => handlePasswordReset()}
                        >
                            Forgot Password?
                        </Button>
                    </div>

                    <div className="message">{loginMessage}</div>

                    <div className="footer"></div>
                </div>
            </div>
        </div>
    );
};
export default LoginModal;
