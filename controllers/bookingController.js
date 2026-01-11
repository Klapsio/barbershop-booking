const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

const BARBERS = ['Jakub', 'Magda', 'Igor', 'Zuza']; 
const ALL_HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

exports.getHome = (req, res) => {
    res.render('index', { barbers: BARBERS });
};

exports.getBookForm = async (req, res) => {
    const { date = new Date().toISOString().split('T')[0], barber = BARBERS[0] } = req.query;
    

    const bookedHours = await Booking.find({ date, barber }).select('hour');
    const bookedHourSet = new Set(bookedHours.map(b => b.hour));
    
    const availableHours = ALL_HOURS.filter(h => !bookedHourSet.has(h));
    
    res.render('book', { 
        date, 
        barber,
        barbers: BARBERS,
        availableHours 
    });
};

exports.postBooking = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('error', { message: 'Nieprawidłowe dane' });
    }

    const { date, hour, barber, clientName, phone } = req.body;

    try {
    
        const existing = await Booking.findOne({ date, hour, barber });
        if (existing) {
            return res.status(400).render('error', { 
                message: `Fryzjer ${barber} jest już zarezerwowany na godzinę ${hour} w dniu ${date}` 
            });
        }

        await Booking.create({ date, hour, barber, clientName, phone });
        res.redirect('/bookings');
    } catch (err) {
        if (err.code === 11000) { 
            return res.status(400).render('error', { 
                message: 'Ta kombinacja data+godzina+fryzjer jest już zajęta' 
            });
        }
        throw err;
    }
};

exports.getBookings = async (req, res) => {
    const { sort = 'date', barber } = req.query;
    let query = {};
    if (barber) query.barber = barber; 
    
    const bookings = await Booking.find(query).sort(sort);
    res.render('bookings', { 
        bookings, 
        barbers: BARBERS,
        selectedBarber: barber || 'all'
    });
};

exports.deleteBooking = async (req, res) => {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.redirect('/bookings');
};




exports.getEditForm = async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    res.render('edit', { booking, barbers: BARBERS });
};

exports.updateBooking = async (req, res) => {
    const { date, hour, barber, clientName, phone } = req.body;
    await Booking.findByIdAndUpdate(req.params.id, {
        date, hour, barber, clientName, phone
    });
    res.redirect('/bookings');
};
