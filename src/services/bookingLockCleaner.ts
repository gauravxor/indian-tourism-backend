import { AvailabilityModel } from "@models/availability";
import { TempBookingModel } from "@models/lockBooking";

const lockCleaner = async (): Promise<void> => {
    const lockBookingData = await TempBookingModel.find({});

    if (lockBookingData.length > 0) {
        console.log("SERVER: Lock Cleaner invoked");
        for (const lockBooking of lockBookingData) {
            const currentTime = new Date().getTime();
            const lockTime = new Date(lockBooking.timeOfExpiry).getTime();
            const diffInMinutes = (lockTime - currentTime) / 1000 / 60;
            console.log(
                `Lock Cleaner: Difference in minutes = ${diffInMinutes}`
            );

            if (diffInMinutes < 0) {
                console.log("Lock Cleaner: Expired Lock data found");
                try {
                    const locationAvailabilityData =
                        await AvailabilityModel.findOne({
                            locationId: lockBooking.locationId,
                        });

                    if (!locationAvailabilityData) {
                        console.log(
                            "Lock Cleaner: Location availability data does not exist"
                        );
                    } else {
                        let isDateFound = false;
                        const availabilityData =
                            locationAvailabilityData.calendarMonths;
                        const dateOfVisit = lockBooking.dateOfVisit;

                        for (const month of availabilityData) {
                            if (
                                Number(month.month) ===
                                dateOfVisit.getMonth() + 1
                            ) {
                                for (const day of month.days) {
                                    const currentDate = new Date(
                                        day.calendarDate
                                    ).getDate();
                                    if (currentDate === dateOfVisit.getDate()) {
                                        isDateFound = true;
                                        day.availableTickets +=
                                            lockBooking.noOfTickets;
                                        break;
                                    }
                                }
                                if (isDateFound) break;
                            }
                        }

                        const availabilityDataSaveResult =
                            await locationAvailabilityData.save();

                        if (isDateFound && availabilityDataSaveResult) {
                            console.log(
                                "Lock Cleaner: Availability model updated"
                            );
                        }
                    }

                    const deleteResult = await TempBookingModel.deleteOne({
                        lockId: lockBooking.lockId,
                    });

                    if (deleteResult.deletedCount === 0) {
                        console.log("Lock Cleaner: No lock booking deleted");
                    } else {
                        console.log("Lock Cleaner: Booking lock deleted");
                    }
                } catch (error) {
                    console.error(
                        "Lock Cleaner: Error processing lock booking",
                        error
                    );
                }
            }
        }
    }
};

export default lockCleaner;
