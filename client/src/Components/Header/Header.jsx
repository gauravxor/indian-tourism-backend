import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import LoginModal from "../LoginModal/LoginModal";

const Header = () => {

    const [menuVisible, setMenuVisible] = useState(false);
	const [showModal, setShowModal] 	= useState(false);

    const toggleMenu = () => setMenuVisible(!menuVisible);
	const handleLoginClick = () => setShowModal(!showModal);

    return (
        <div className="landing-page">

            <div className="logo">
                <img src="logo.png" alt="Site Logo" />
            </div>

            <div className="search-bar">
                <input type="text" placeholder="Search for amusement parks and locations"/>
                <div className="filter-dropdown">
                    <select>
                        <option value="all">All</option>
                        <option value="amusement-parks">Amusement Parks</option>
                        <option value="water-parks">Water Parks</option>
                        <option value="zoo">Zoo</option>
                    </select>
                </div>
                <button>Search</button>
            </div>


            <div className="user-profile" onClick={toggleMenu}>
                <img src="23889994.jpg" alt="User Profile" /> </div>
                {menuVisible && (
                    <div className="dropdown-menu">
                        <ul>
                            <li> <button onClick={handleLoginClick}> Login </button> </li>
                            <li> <Link to="/settings">Signup</Link> </li>
							<li> <button>About</button> </li>
                        </ul>
                    </div>)
				}
				{showModal && <LoginModal toggleModal={handleLoginClick} toggleMenu={toggleMenu}/>}
            {/* </div> */}


        </div>
    );
};

export default Header;
