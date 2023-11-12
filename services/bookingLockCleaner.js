const AvailabilityModel = require('../models/availabilityModel');
const LockBookingModel = require('../models/lockBookingModel');

const lockCleaner = async () => {
    const lockBookingData = await LockBookingModel.find({});

    /** If lock booking data collection is not empty */
    if (!(JSON.stringify(lockBookingData) === JSON.stringify([]))) {
        console.log('SERVER : Lock Cleaner invoked'.yellow);
        lockBookingData.forEach(async (lockBooking) => {
            const currentTime = new Date();
            const lockTime = lockBooking.timeOfExpiry;
            const diff = lockTime - currentTime;
            const diffInMinutes = diff / 1000 / 60;
            /** For testing purpose we are keeping the expiry time to 1 minutes */
            console.log(`Lock Cleaner : Difference in minutes =  ${diffInMinutes}`);
            if (diffInMinutes < 0) {
                console.log('Lock Cleaner : Expired Lock data found'.yellow);

                const locationAvailabilityData = await AvailabilityModel.findOne({
                    locationId: lockBooking.locationId,
                });
                if (locationAvailabilityData === null) {
                    console.log('Lock Cleaner : Location availability data does not exist'.red);
                } else {
                    let isDateFound = false;
                    const availabilityData = locationAvailabilityData.calendarMonths;
                    const dateOfVisit = lockBooking.dateOfVisit;
                    console.log('Lock Cleaner : Performing data check'.yellow);
                    for (let i = 0; i < availabilityData.length && !isDateFound; i += 1) {
                        /** Month will have the object where "days" key is an array of dates */
                        const month = availabilityData[i];

                        /** If the month of booking req date is equal to the current month object */
                        if (month.month == dateOfVisit.getMonth() + 1) {
                            for (let j = 0; j < month.days.length; j += 1) {
                                const currentDate = new Date(month.days[j].calendarDate).getDate();
                                if (currentDate === dateOfVisit.getDate()) {
                                    isDateFound = true;
                                    month.days[j].availableTickets += lockBooking.noOfTickets;
                                    break;
                                }
                            }
                        }
                    }
                    const availabilityDataSaveResult = await locationAvailabilityData.save();

                    if (isDateFound === true && availabilityDataSaveResult !== null) {
                        console.log('Lock Cleaner : Availability model updated'.green);
                    }
                }

                const deleteLockBookingResult = await LockBookingModel.deleteOne({
                    lockId: lockBooking.lockId,
                });
                if (deleteLockBookingResult === null) {
                    console.log('Lock Cleaner : Error deleting lock booking data'.red);
                }
                else {
                    console.log('Lock Clenaer : Booking Lock data deleted'.green);
                }
            }
        });
    }
};

module.exports = lockCleaner;
