const fs = require('fs');
const path = require('path');
const util = require('util');
const { v4: uuidv4 } = require('uuid');
const color = require('colors');
const multer = require('multer');

const LocationModel = require('../../models/locationModel');
const AdminModel = require('../../models/adminModel');

const updateLocationController = async (req, res, next) => {

	if(req.userType !== 'admin'){
		return res.status(401).json({
			status: "failure",
			msg: "You are not authorized to perform this action"
		});
	}
	else{
		const locationId = req.params.locationId;
		const adminId = req.userId;
		const adminSearchResult = await AdminModel.findOne({
			_id: adminId,
			'locations.locationId': locationId
		});

		if(adminSearchResult === null){
			return res.status(401).json({
				status: "failure",
				msg: "You are not the admin of this location"
			});
		}

		try{
			const location = await LocationModel.findById(locationId);

			if(!location) {
				res.status(404).json({
					status: "failure",
					message: 'Location not found'
				});
				return;
			}

			const { name, description, address, city, state, country, pincode, capacity, ticketPrice } = req.body;

			const updatedLocation = {
				name: name ? name : location.name,
				description: description ? description : location.description,
				address: address ? address : location.address,
				city: city ? city : location.city,
				state: state ? state : location.state,
				country: country ? country : location.country,
				pincode: pincode ? pincode : location.pincode,
				capacity: capacity ? capacity : location.capacity,
				ticketPrice: ticketPrice ? ticketPrice : location.ticketPrice
			};

			const locationFolderPath = path.join(__dirname, `../../public/images/location/${locationId}`);
			fs.mkdirSync(locationFolderPath, { recursive: true });

			const images = location.images.slice();
			const imageFiles = req.files;

			if(imageFiles && imageFiles.length > 0) {
				imageFiles.forEach((file) => {
					const fileExtension = path.extname(file.originalname);
					const newFilename = `${uuidv4()}-${fileExtension}`;
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
				status: "success",
				message: 'Location updated successfully'
			});
		}
		catch (err) {
			console.log(err);
			res
			.status(500).
			json({
				status: "failure",
				message: 'Error updating location'
			});
		}
	}
}

module.exports = updateLocationController;
