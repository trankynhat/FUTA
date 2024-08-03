const mongoose = require('mongoose');
const User = require('./models/User');
const Trip = require('./models/Trip');
const Ticket = require('./models/Ticket');
const Payment = require('./models/Payment');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.DB_MONGOS_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const seedUsers = async (numUsers) => {
    const users = [];

    for (let i = 0; i < numUsers; i++) {
        const password = await bcrypt.hash('password456', 10);
        users.push({
            username: faker.internet.userName(),
            password: password,
            fullName: faker.person.fullName(),
            phoneNumber: faker.phone.number(),
            email: faker.internet.email(),
        });
    }
    await User.insertMany(users);
    console.log(`${numUsers} users inserted`);
};
const seedTrips = async (numTrips) => {
    const trips = [];

    for (let i = 0; i < numTrips; i++) {
        trips.push({
            departure: faker.location.city(),
            destination: faker.location.city(),
            departure_time: faker.date.future(),
            availableSeats: parseFloat(faker.finance.amount({ min: 20, max: 50, dec: 0 })),
            price: parseFloat(faker.finance.amount({ min: 100000, max: 1000000, dec: 0 })),
        });
    }
    await Trip.insertMany(trips);
    console.log(`${numTrips} trips inserted`);
};

const seedTickets = async (numTickets) => {
    const users = await User.find();
    const trips = await Trip.find();
    const tickets = [];

    for (let i = 0; i < numTickets; i++) {
        tickets.push({
            user: users[Math.floor(Math.random() * users.length)]._id,
            trip: trips[Math.floor(Math.random() * trips.length)]._id,
            seats: parseFloat(faker.finance.amount({ min: 1, max: 5, dec: 0 })),
            status: faker.helpers.arrayElement(['booked', 'cancelled']),
        });
    }
    await Ticket.insertMany(tickets);
    console.log(`${numTickets} tickets inserted`);
};

const seedPayments = async (numPayments) => {
    const tickets = await Ticket.find().populate('trip');
    const payments = [];

    for (let i = 0; i < numPayments; i++) {
        const ticket = tickets[Math.floor(Math.random() * tickets.length)];
        const amount = ticket.seats * ticket.trip.price;
        payments.push({
            ticket: ticket._id,
            amount: amount,
            paymentMethod: 'Credit Card',
            status: faker.helpers.arrayElement(['completed', 'failed']),
            bankCode: faker.helpers.arrayElement(['NCB', 'ACB', 'Agribank', 'BIDV', 'Vietcombank']),
        });
    }
    await Payment.insertMany(payments);
    console.log(`${numPayments} payments inserted`);
};

const seedDatabase = async () => {
    await User.deleteMany({});
    await Trip.deleteMany({});
    await Ticket.deleteMany({});
    await Payment.deleteMany({});

    await seedUsers(100);
    await seedTrips(100);
    await seedTickets(100);
    await seedPayments(100);

    console.log('Data seeded');
    process.exit();
};

seedDatabase();