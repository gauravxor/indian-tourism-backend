import React, { useState } from 'react'
import './LocationBody.css';
import left_btn from "./image/left_arrow.png"
import right_btn from "./image/right_arrow.png"
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
				<button className="slider-btn prev-btn" onClick={handlePrevClick}>
				<img className="btn_img" src={right_btn} alt="right-btn-img"></img>
				</button>
				<img src={`http://localhost:4000${imageData[currentIndex].urls}`} alt={imageData[currentIndex].imageType} className="slider-image" />
				<button className="slider-btn next-btn" onClick={handleNextClick}>
				<img className="btn_img" src={left_btn} alt="left-btn-img"></img>
				</button>
			</div>
		);
	}
}

export default TopImageSlider;
