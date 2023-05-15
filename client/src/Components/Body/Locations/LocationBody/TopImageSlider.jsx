import React, { useState, useContext } from 'react'
import './LocationBody.css';
import left_btn from "./image/left_arrow.png"
import right_btn from "./image/right_arrow.png";
import { AppContext } from '../../../../AppContext';
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
	//Implementation of hiding slider buttons if any modal window opened
	// eslint-disable-next-line
    const { context, setContext, resetContext } = useContext(AppContext);
	const {
		isLoginModalOpen,
		isSignUpModalOpen,
		isOtpModalOpen,
		isAddLocationModalOpen,
		isForgotPasswordModalOpen,
		isPaymentModalOpen,
	} = context;
	const isActive =
		isLoginModalOpen ||
		isSignUpModalOpen ||
		isOtpModalOpen ||
		isAddLocationModalOpen ||
		isForgotPasswordModalOpen ||
		isPaymentModalOpen;
		const sliderBtnClass = (isActive?'slider-btn-disable':'slider-btn');
     /////////////////////////

	if(imageData !== undefined){
		return (

			<div className="slider-container">
				<button className={`${sliderBtnClass} prev-btn`} onClick={handlePrevClick}>
				<img className="btn_img" src={right_btn} alt="right-btn-img"></img>
				</button>
				<img src={`${window.location.protocol}//${window.location.hostname}:4000${imageData[currentIndex].urls}`} alt={imageData[currentIndex].imageType} className="slider-image" />
				<button className={`${sliderBtnClass} next-btn`} onClick={handleNextClick}>
				<img className="btn_img" src={left_btn} alt="left-btn-img"></img>
				</button>
			</div>
		);
	}
}

export default TopImageSlider;
