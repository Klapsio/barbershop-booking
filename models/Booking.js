const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    date: { type: String, required: true },
    hour: { type: String, required: true },
    barber: { type: String, required: true },
    clientName: { type: String, required: true },
    phone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

bookingSchema.index({ date: 1, hour: 1, barber: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);