require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');


app.use('/', bookingRoutes);

app.use((req, res) => {
    res.status(404).render('error', { message: 'Strona nie znaleziona' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Wewnętrzny błąd serwera' });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Połączono z MongoDB');
        app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
    })
    .catch(err => console.error(err));
