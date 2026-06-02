const express = require('express');
const emergencyrouter = express.Router();

const {
  createPoliceStations,
  createNearbyHospitals,
    nearbyServices
} = require('../controller/emergencyPoliceHospitalControllers');

// Route to create police stations
emergencyrouter.post('/create/police-stations', createPoliceStations);

// Route to create nearby hospitals
emergencyrouter.post('/create/nearby-hospitals', createNearbyHospitals);

//Routes to get nearby hospitals and police stations
emergencyrouter.post('/get-nearby-services', nearbyServices);


module.exports = emergencyrouter;
