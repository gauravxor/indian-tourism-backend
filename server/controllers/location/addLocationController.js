const fs 	= require('fs');
const path 	= require('path');
const util  = require('util');

const color		= require('colors');
const multer 	= require('multer');

const { v4: uuidv4 } = require('uuid');

const LocationModel = require('../../models/locationModel');
const AvailabilityModel = require('../../models/availabilityModel');
const AdminModel = require('../../models/adminModel');

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

	console.log(req.userType);
	if(req.userType !== 'admin'){
		return res.status(401).json({
			status: "failure",
			msg: "You are not authorized to perform this action"
		});
	}

	const { name, description, address, city, state, country, pincode, capacity, ticketPrice } = req.body;
	const newLocation = await LocationModel.create({
		name,
		description,
		address,
		city,
		state,
		country,
		pincode,
		capacity,
		ticketPrice
	});

	const locationId = newLocation._id.toString();
    const locationFolderPath = path.join(__dirname, `../../public/images/location/${locationId}`);
    fs.mkdirSync(locationFolderPath, { recursive: true });


	const images = [];
	req.files.forEach(file => {
		const fileExtension = path.extname(file.originalname);
		const newFilename = `${uuidv4()}-${file.fieldname}${fileExtension}`;
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
		const imageAddResult = await LocationModel.findByIdAndUpdate(locationId, {
			$set: { images: images }
		});
		if(imageAddResult !== null){

			// if images are added successfully, then add location to admin locations array
			const adminAddResult = await AdminModel.findByIdAndUpdate(req.userId, {
				$push: { locations: { locationId: locationId } },
				$inc: { locationCount: 1 }
			});
			if(adminAddResult === null){
				return res.status(500).json({
					status: "failure",
					message: 'Error saving location in admin location model'
				});
			}else{
				return res.status(200).json({
					status: "success",
					message: 'Location added successfully',
					locationId: locationId
				});
			}
		}
		else{
			res.status(500).json({
				status: "failure",
				message: 'Error saving location'
			});
		}
	}
	else{
		res.status(500).json({
			status: "failure",
			message: 'Error saving location'
		});
	}
}

module.exports = addLocationController;
