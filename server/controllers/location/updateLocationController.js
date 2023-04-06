const fs = require('fs');
const path = require('path');
const util = require('util');
const { v4: uuidv4 } = require('uuid');
const color = require('colors');
const multer = require('multer');

const LocationModel = require('../../models/locationModel');
const updateLocationController = async (req, res, next) => {

	const locationId = req.params.locationId;

	try{
		const location = await LocationModel.findById(locationId);

		if(!location) {
			res.status(404).json({
				 message: 'Location not found'
			});
			return;
		}

		const { name, description, address, city, state, country, pincode, capacity } = req.body;

		const updatedLocation = {
			name: name ? name : location.name,
			description: description ? description : location.description,
			address: address ? address : location.address,
			city: city ? city : location.city,
			state: state ? state : location.state,
			country: country ? country : location.country,
			pincode: pincode ? pincode : location.pincode,
			capacity: capacity ? capacity : location.capacity,
		};

		const locationFolderPath = path.join(__dirname, `../../public/images/location/${locationId}`);
		fs.mkdirSync(locationFolderPath, { recursive: true });

		const images = location.images.slice();
		const imageFiles = req.files;

		if(imageFiles && imageFiles.length > 0) {
			imageFiles.forEach((file) => {
				const fileExtension = path.extname(file.originalname);
				const newFilename = `${uuidv4()}${fileExtension}`;
				const imageUrl = `/public/images/location/${locationId}/${newFilename}`;
				const filePath = path.join(locationFolderPath, newFilename);

				images.forEach((image, index) => {
					if (image.imageType === file.fieldname) {
						fs.unlinkSync(path.join(__dirname, '../../', image.urls));
						images.splice(index, 1);
					}
				});

				images.push({
					imageType: file.fieldname,
					urls: imageUrl,
				});

				fs.writeFileSync(filePath, file.buffer);
			});
		}

		const updatedLocationData = {
			...updatedLocation,
			images,
			updatedAt: new Date(),
		};

		const updatedResult = await LocationModel.findByIdAndUpdate(
			locationId,
			updatedLocationData, { new: true }
		);

		res.status(200).json({
			message: 'Location updated successfully'
		});
	}
	catch (err) {
		console.log(err);
		res
		.status(500).
		json({
			message: 'Error updating location'
		});
	}
};

module.exports = updateLocationController;
