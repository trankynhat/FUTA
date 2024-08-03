const mongoose = require("mongoose");
const User = require("./models/User");
const Trip = require("./models/Trip");
const Ticket = require("./models/Ticket");
const Payment = require("./models/Payment");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect(process.env.DB_MONGOS_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => console.error(err));

const seedData = async () => {
  await User.deleteMany({});
  await Trip.deleteMany({});
  await Ticket.deleteMany({});
  await Payment.deleteMany({});

  const hashedPassword = await bcrypt.hash("password456", 10);
  const user1 = new User({
    username: "john_doe",
    password: hashedPassword,
    fullName: "John Doe",
    phoneNumber: "1234567890",
    email: "john@example.com",
  });

  const trip1 = new Trip({
    departure: "HCMC",
    destination: "Hanoi",
    departure_time: new Date("2024-07-17"),
    availableSeats: 30,
    price: 2000000,
  });

  await user1.save();
  await trip1.save();

  const ticket1 = new Ticket({
    trip: trip1._id,
    user: user1._id,
    seats: 1,
    status: "booked",
  });

  const payment1 = new Payment({
    ticket: ticket1._id,
    paymentMethod: "Credit Card",
    amount: 200000,
    status: "completed",
    bankCode: "NCB",
  });

  await ticket1.save();
  await payment1.save();

  console.log("Data seeded");
  process.exit();
};

seedData();