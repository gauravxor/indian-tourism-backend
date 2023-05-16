const colors = require('colors');

const LockBookingModel = require('../models/lockBookingModel');

const lockCleaner = async () => {
	const lockBookingData = await LockBookingModel.find({});

	/** If lock booking data collection is not empty */
	if(!(JSON.stringify(lockBookingData) === JSON.stringify([]))) {
		lockBookingData.forEach(async (lockBooking) => {
			const currentTime = new Date();
			const lockTime = lockBooking.timeOfExpiry;
			const diff = currentTime - lockTime;
			const diffInMinutes = diff / 1000 / 60;
			if(diffInMinutes > 10) {
				console.log("Lock Cleaner : Expired Lock data found".yellow);
				const deleteLockBookingResult = await LockBookingModel.deleteOne({ lockId: lockBooking.lockId });
				if(deleteLockBookingResult === null) {
					console.log("Lock Cleaner : Error deleting lock booking data".red);
				}
				else{
					console.log("Lock Clenaer : Booking Lock data deleted".green);
				}
			}
		});
	}
}

module.exports = lockCleaner;
