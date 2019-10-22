const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations');
const ctrlOthers = require('../controllers/other');

const ctrlMain = require('../controllers/main');

/* location page*/
router.get('/', ctrlLocations.homelist);
router.get('/location', ctrlLocations.locationInfo);
router.get('/location/review/new', ctrlLocations.addReview);

/* other page */
router.get('/about', ctrlOthers.about);


/* GET home page. */
router.get('/', ctrlMain.index );

module.exports = router;
