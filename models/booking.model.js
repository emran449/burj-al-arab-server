const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"]
        },
        email: {
            type: String,
            required: [true, "Please enter your email"]
        },
        checkIn: {type: Date},
        checkOut: {type: Date},
        guests: {type: Number, default: 1}
    },
    { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);