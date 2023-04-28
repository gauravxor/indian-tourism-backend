import React, { useState } from 'react'
import './LocationBody.css';

function TopImageSlider(props) {

	const imageData = props.imageData;
	const [currentIndex, setCurrentIndex] = useState(0);

	const handlePrevClick = () => {
		if (currentIndex === 0) {
			setCurrentIndex(imageData.length - 1);
		}
		else {
			setCurrentIndex(currentIndex - 1);
		}
	};

	const handleNextClick = () => {
		if (currentIndex === imageData.length - 1) {
			setCurrentIndex(0);
		}
		else {
			setCurrentIndex(currentIndex + 1);
		}
	};


	if(imageData !== undefined){
		return (

			<div className="slider-container">
			<img src={`http://localhost:4000${imageData[currentIndex].urls}`} alt={imageData[currentIndex].imageType} className="slider-image" />
			<button className="slider-btn prev-btn" onClick={handlePrevClick}>
				&#8249;
			</button>
			<button className="slider-btn next-btn" onClick={handleNextClick}>
				&#8250;
			</button>
			</div>
		);
	}
}

export default TopImageSlider;
