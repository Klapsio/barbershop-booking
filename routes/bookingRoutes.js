const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { body } = require('express-validator');

router.get('/', bookingController.getHome);
router.get('/book', bookingController.getBookForm);
router.get('/bookings', bookingController.getBookings);

router.post('/book',
    [
        body('clientName').trim().notEmpty().withMessage('Imię jest wymagane'),
        body('phone').trim().notEmpty().withMessage('Telefon jest wymagany'),
        body('barber').trim().notEmpty().withMessage('Wybierz fryzjera')
    ],
    bookingController.postBooking
);

router.get('/booking/delete/:id', bookingController.deleteBooking);
router.get('/booking/edit/:id', bookingController.getEditForm);
router.post('/booking/edit/:id', bookingController.updateBooking);


module.exports = router;