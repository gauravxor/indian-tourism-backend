import React, { useState, useContext } from "react";
import "./LocationCard.css";
import { BsArrowRightCircle, BsArrowLeftCircle } from "react-icons/bs";
import { AppContext } from "../../../../AppContext";
import { useNavigate } from 'react-router-dom';
import Button from '../../../UI/Buttons/Button';

const Card = (props) => {

	const locationId = props.locationId;
	const name = props.name;
	const description = props.description;
	const images = props.images;
	const price = props.price;

	const navigate = useNavigate();

	const {context, setContext} = useContext(AppContext);

	const [currentImage, setCurrentImage] = useState(0);

	const handleClick = (direction) => {
		if (direction === "left")
			setCurrentImage(currentImage === 0 ? images.length - 1 : currentImage - 1);
		else
		if (direction === "right")
			 setCurrentImage(currentImage === images.length - 1 ? 0 : currentImage + 1);
	}

	const handleKnowMoreClick = () => {
		console.log("In handle know more click function");
		setContext( {...context, locationId: locationId, isSearchClicked: false});
		navigate(`/locations/${locationId}`);
	}

	const handleEditClick = (event) => {
		console.log("In handle edit click function");
		event.preventDefault();
		props.setEditLocationId(locationId);
		props.setInEditableMode(true);
	}
	const btnClass = (context.isUserAdmin?'btn-1':'empty');

	return (<>
	<div className="cards">
		{!props.inEditableMode && (
			<div className="location-card">

				<div className="image-section">
					<img src={`${window.location.protocol}//${window.location.hostname}:4000` + images[currentImage].urls} alt={images[currentImage].imageType} />
					{images.length > 1 && (
						<div className="arrow-buttons">
							<div className="arrow-left">
								<BsArrowLeftCircle onClick={() => handleClick("left")} />
							</div>
							<div className="arrow-right">
								<BsArrowRightCircle onClick={() => handleClick("right")} />
							</div>
						</div>
					)}
				</div>

				<div className="name-section"> {name} </div>
				<div className="description-section"> <b>Description : </b> {description} </div>
				<div className="price-section"> ₹{price} </div>

				<div className="button-section">
					<Button className={btnClass} onClick={() => handleKnowMoreClick()}> Know More </Button>
					{context.isUserAdmin === true && (
							<Button className='btn-2' onClick={(event) => handleEditClick(event)}> Edit </Button>
					)}
				</div>
			</div>
		)}
		</div>
	</>);
};

export default Card;
