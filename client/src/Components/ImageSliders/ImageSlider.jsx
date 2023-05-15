import React, { useState, useRef, useEffect, useContext } from "react";
import classes from "./ImageSlider.module.css";
import { AppContext } from "../../AppContext";

const LeftArrowStyles = {
	position: "absolute",
	top: "50%",
	transform: "translate(0, -50%)",
	left: "10px",
	fontSize: "65px",
	color: "black",
	opacity: 0.8,
	zIndex: 0,
	cursor: "pointer",
};

const Title = {
	position: "absolute",
	top: "86%",
	left: "90px",
	transform: "translate(30%, -40%)",
	color: "white",
	fontSize: "18px",
	zIndex: 0,
	backgroundColor: "black",
	fontWeight: "600",
	padding: "2px",
	borderRadius: "3px",
	cursor: "pointer",
};

const RightArrowStyles = {
	position: "absolute",
	top: "50%",
	transform: "translate(0, -50%)",
	right: "20%",
	fontSize: "65px",
	color: "black",
	opacity: 0.8,
	zIndex: 0,
	cursor: "pointer",
};

const leftArrowStyles = {
	position: "absolute",
	top: "50%",
	transform: "translate(0, -50%)",
	left: "10px",
	fontSize: "65px",
	color: "black",
	opacity: 0.8,
	zIndex: 1,
	cursor: "pointer",
	writeable: true,
};

const title = {
	position: "absolute",
	top: "86%",
	left: "90px",
	transform: "translate(30%, -40%)",
	color: "white",
	fontSize: "18px",
	zIndex: 1,
	backgroundColor: "black",
	fontWeight: "600",
	padding: "2px",
	borderRadius: "3px",
	cursor: "pointer",
	writeable: true,
};

const rightArrowStyles = {
	position: "absolute",
	top: "50%",
	transform: "translate(0, -50%)",
	right: "20%",
	fontSize: "65px",
	color: "black",
	opacity: 0.8,
	zIndex: 1,
	cursor: "pointer",
	writeable: true,
};

const dotStyles = {
	margin: "0 12px",
	cursor: "pointer",
	fontSize: "20px",
};

const slidesContainerStyles = {
	display: "flex",
	height: "100%",
	transition: "transform ease-out 0.3s",
};

const slidesContainerOverflowStyles = {
	overflow: "hidden",
	width: "100%",
};

const ImageSlider = ({ slides, parentWidth }) => {
	const [currIndex, setcurrIndex] = useState(0);
	const timerRef = useRef(null);

	const sliderStyles = {
		height: "100%",
		position: "relative",
	};

	const slideStyles = {
		width: "100%",
		height: "100%",
		marginLeft: "15px",
		borderRadius: "10px",
		backgroundPosition: "center",
		backgroundSize: "cover",
		backgroundImage: `url(${slides[currIndex].url})`,
		cursor: "pointer",
	};

	// eslint-disable-next-line
	const gotoNext = () => {
		const islastSlide = currIndex === slides.length - 1;
		const newIndex = islastSlide ? 0 : currIndex + 1;
		setcurrIndex(newIndex);
	};

	const gotoPrevious = () => {
		const isFirstSlide = currIndex === 0;
		const newIndex = isFirstSlide ? slides.length - 1 : currIndex - 1;
		setcurrIndex(newIndex);
	};

	const getSlideStylesWithBackground = (slideIndex) => ({
		...slideStyles,
		backgroundImage: `url(${slides[slideIndex].url})`,
		width: `${parentWidth}px`,
	});

	const getSlidesContainerStylesWithWidth = () => ({
		...slidesContainerStyles,
		width: parentWidth * slides.length,
		transform: `translateX(${-(currIndex * parentWidth)}px)`,
	});

	const gotoSlide = (index) => {
		setcurrIndex(index);
	};

	useEffect(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
		timerRef.current = setTimeout(() => {
			gotoNext();
		}, 2000);
		return () => clearTimeout(timerRef.current);
	}, [gotoNext]);

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

	return (
		<div style={sliderStyles}>
			<div>

				<div
					style={isActive ? LeftArrowStyles : leftArrowStyles}
					onClick={gotoPrevious}
				>⮜
				</div>

				<div style={slideStyles}></div>
				<div style={isActive ? Title : title}>
					{slides[currIndex].title}
				</div>
				<div
					style={isActive ? RightArrowStyles : rightArrowStyles}
					onClick={gotoNext}
					>⮞
				</div>

			</div>
			<div style={slidesContainerOverflowStyles}></div>
			<div style={getSlidesContainerStylesWithWidth()}>
				{slides.map((_, slideIndex) => (
					<div
						key={slideIndex}
						style={getSlideStylesWithBackground(slideIndex)}
					></div>
				))}
			</div>

			<div className={classes.dtcontstyle}>
				{slides.map((slide, slideIndex) => (
					<div
						style={dotStyles}
						className={classes.dtstyle}
						key={slideIndex}
						onClick={() => gotoSlide(slideIndex)}
					>●
					</div>
				))}
			</div>

		</div>
	);
};
export default ImageSlider;
