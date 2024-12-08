const express = require('express')
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
const cors = require('cors');
const Booking = require('./models/booking.model');
require('dotenv').config()
// console.log(process.env.DB_USER)

const port = 5000


const app = express();

app.use(bodyParser.json());
app.use(cors());

var admin = require("firebase-admin");

var serviceAccount = require("./configs/burj-al-arab-403a2-firebase-adminsdk-r39ek-fab3fdea32.json");
const { getAuth } = require('firebase-admin/auth');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ch7zo.mongodb.net/burjAlArab?retryWrites=true&w=majority&appName=Cluster0`;

app.post('/addBooking', async (req, res) => {
    try {
        const product = await Booking.create(req.body);
        res.status(200).json({ message: product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/bookings', async (req, res) => {
    const bearer = req.headers.authorization;
    try {
        const bookings = await  Booking.find({ email: req.query.email });
        if (bearer && bearer.startsWith('Bearer ')) {
            const idToken = bearer.split(' ')[1];
            // console.log({ idToken });
            // idToken comes from the client app
            getAuth()
                .verifyIdToken(idToken)
                .then((decodedToken) => {
                    const tokenEmail = decodedToken.email;
                    // console.log({ tokenEmail });
                    // console.log( req.query.email );
                     if  (tokenEmail == req.query.email) {
                        res.status(200).json(bookings);
    
                    }
                    else {
                        res.status(403).json({ message: 'Access denied' });
                    }
                    // ...
                })
                .catch((error) => {
                    res.status(401).json({ message: 'Not authenticated' });
                });
        }
        else {
            res.status(401).json({ message: 'Not authenticated' });
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    





});

// Connect to MongoDB database

mongoose.connect(uri)
    .then(() => {
        console.log('Connected to database!!!');
    })
    .catch(() => {
        console.log('Connection failed!!!')
    });

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})