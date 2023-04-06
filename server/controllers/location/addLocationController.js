const fs 	= require('fs');
const path 	= require('path');
const util  = require('util');

const color		= require('colors');
const multer 	= require('multer');

const { v4: uuidv4 } = require('uuid');

const LocationModel = require('../../models/locationModel');
const AvailabilityModel = require('../../models/availabilityModel');


const generateDaysArray = (year, month, capacity) => {
	const numDays = new Date(year, month, 0).getDate();
	const daysArray = [];
	for (let i = 1; i <= numDays; i++)
	{
		daysArray.push({
			calendarDate: new Date(year, month - 1, i),
			availableTickets: capacity
		});
	}
	return daysArray;
};



const addLocationController = async (req, res, next) => {
	const { name, description, address, city, state, country, pincode, capacity } = req.body;
	const newLocation = await LocationModel.create({
		name,
		description,
		address,
		city,
		state,
		country,
		pincode,
		capacity,
	});

	const locationId = newLocation._id.toString();
    const locationFolderPath = path.join(__dirname, `../../public/images/location/${locationId}`);
    fs.mkdirSync(locationFolderPath, { recursive: true });


	const images = [];
	req.files.forEach(file => {
		const fileExtension = path.extname(file.originalname);
		const newFilename = `${uuidv4()}${fileExtension}`;
		const imageUrl = `/public/images/location/${locationId}/${newFilename}`;
		const filePath = path.join(locationFolderPath, newFilename);
		images.push({
			imageType: file.fieldname,
			urls: imageUrl,
		});
		fs.writeFileSync(filePath, file.buffer);
	});


	// Get current year and month
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth() + 1;

	// Create month schemas for remaining months in current year
	const monthsArray = [];
	for(let i = currentMonth; i <= 12; i++) {
		monthsArray.push({
			month: i.toString(),
			year: currentYear,
			days: generateDaysArray(currentYear, i, capacity),
		});
	}

	// Create availability entry with default values
	const availabilityEntry = await AvailabilityModel.create({
		locationId: locationId,
		maxCapacity: capacity,
		calendarMonths: monthsArray,
	});

	if(availabilityEntry !== null){
		// console.log(images);
		const imageAddResult = await LocationModel.findByIdAndUpdate(locationId, {
			$set: { images: images }
		});
		// console.log(imageAddResult);
		if(imageAddResult !== null){
			res.status(200).json({
				message: 'Location added successfully',
				locationId: locationId
			});
		}
		else{
			res.status(500).json({
				message: 'Error saving location'
			});
		}
	}
	else{
		res.status(500).json({
			message: 'Error saving location'
		});
	}
}

module.exports = addLocationController;
