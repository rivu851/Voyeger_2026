require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");


const connectDB = require("./config/database");
const { connectClodinary } = require("./config/cloudinary");
const authroutes = require("./routes/authroute");
const placeroutes = require("./routes/placeroute");
const ownerHotelRoutes = require("./routes/ownerhotelroutes");
const hotelRouter = require("./routes/hotelroute");
const orderRouter = require("./routes/orderRoute");
const bookingrouter = require("./routes/bookingroute");
const souvenirrouter = require("./routes/souvenirroute");
const locationRoutes = require("./routes/location");
const monumentRoutes = require("./routes/monumentroutes");
const frameRoutes = require("./routes/frameroute");
const emergencyrouter = require("./routes/emergencyroutes");
const { startCleanupScheduler } = require("./utils/cleanup");

// Connect to Database & Cloudinary
connectDB();
connectClodinary();

// Start cleanup scheduler for old location records
startCleanupScheduler();

const app = express();

// 🔓 CORS Setup - Allow All Origins (Use this for development or Vercel deployment)
app.use(
  cors({
    origin: true, // Reflects the request origin
    credentials: true, // Allows cookies to be sent
  })
);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.send("Voyager API Server is Running");
});
app.get("/api/ping", (req, res) => {
  res.status(200).json({ message: "Voyager API is alive 🚀" });
});

app.use("/api/users", authroutes);
app.use("/api/places", placeroutes);
app.use("/api/orders", orderRouter);
app.use("/api/bookings", bookingrouter);
app.use("/api/souvenirs", souvenirrouter);
app.use("/api/location", locationRoutes);
app.use("/api/owner/hotel", ownerHotelRoutes);
app.use("/api/monuments", monumentRoutes);
app.use("/api/frames", frameRoutes);
app.use("/api/emergency", emergencyrouter);


//convert coordinate into adress using open street map's nominatim reverse geocoding API
app.use("/api/loc-get-details", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "lat & lon required" });
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          "User-Agent": "EmergencyApp/1.0 (contact: rajdeep3002@gmail.com)",
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Reverse geocode failed:", err);
    res.status(500).json({ error: "Reverse geocoding failed" });
  }
});
// app.use("/api/hotels", hotelRouter); // Uncomment if needed

// Start Server
const PORT = process.env.PORT || 5000;


app.get("/track/:userId", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
