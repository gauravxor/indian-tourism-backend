import React, { useState } from "react";
import "./LoginModal.css";
import axios from "axios";

const LoginModal = ({toggleModal, toggleMenu}) => {

	const [showModalMain, setShowModalMain] = useState(false);
    const toggleModalMain = (e) => {
		setShowModalMain(!showModalMain);
		toggleModal();

    };


    const [email, setEmail]         = useState("");
    const [password, setPassword]   = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            email: email,
            password: password,
        };

        console.log(data);
        try {
            const response = await axios.post(
                "http://localhost:4000/api/auth/login",
                data
            );
            console.log(response.data); // handle successful response
        }
        catch (error) {
            console.error(error); // handle error
        }
    };
	return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={toggleModalMain}> &times; </span>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input type="email" name="email" value={email}
                        onChange={(e) => setEmail(e.target.value)} required />{" "} <br/>


                    <label>Password:</label>
                    <input type="password" name="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required/>{" "} <br/>

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};


export default LoginModal;
