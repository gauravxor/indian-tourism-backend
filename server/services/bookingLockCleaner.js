const LockBookingModel = require('../models/lockBookingModel');

const lockCleaner = async () => {
	console.log("Cleaning lock booking data".yellow);
	const lockBookingData = await LockBookingModel.find({});
	if(JSON.stringify(lockBookingData) === JSON.stringify([])) {
		console.log("No lock booking data found".green);
	}
	else{
		lockBookingData.forEach(async (lockBooking) => {
			const currentTime = new Date();
			const lockTime = lockBooking.timeOfExpiry;
			const diff = currentTime - lockTime;
			const diffInMinutes = diff / 1000 / 60;
			if(diffInMinutes > 15) {
				const deleteLockBookingResult = await LockBookingModel.deleteOne({ lockId: lockBooking.lockId });
				if(deleteLockBookingResult === null) {
					console.log("Error deleting lock booking data".red);
				}
				else{
					console.log("Lock booking data deleted successfully".green);
				}
			}
		});
	}
}

module.exports = lockCleaner;
