const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

// !!! coords are separeted in the request: lng, lat
const locationsCreate = (req, res) => {
    //console.log(req.body.facilities);
    //console.log(req.body.address);
    Loc.create({
        name: req.body.name,
        address: req.body.address,
        facilities: req.body.facilities.split(","),
        coords: {
            type: "Point",
            coordinates:
            [
                parseFloat(req.body.lng),
                parseFloat(req.body.lat)
            ]
        },
        openingTimes: [{
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2
        }]
    }, (err, location) => {
        if (err) {
            res
                .status(400)
                .json(err);
        } else {
            res
                .status(201)
                .json(location);
        }
    });
};


const locationsListByDistance = async (req, res) => {
    const lng = parseFloat(req.query.lng);
    const lat = parseFloat(req.query.lat);
    let maxD = 20000;
    if(req.query.maxDistance){
        maxD = parseInt(req.query.maxDistance);    
    } 
    const near = {
        type: "Point",
        coordinates: [lng, lat]
    };
    const geoOptions = {
        distanceField: "distance.calculated",
        key: 'coords',
        spherical: true,
        maxDistance: maxD,
        limit: 10
    };
    if (!lng || !lat) {
        return res
            .status(404)
            .json({
                "message": "lng and lat query parameters are required"
            });
    }
    try {
        const results = await Loc.aggregate([
            {
                $geoNear: {
                    near,
                    distanceField: "distance",
                    maxDistance: maxD
                }
            }
        ]);
        //console.log(results);
        //console.log('\n');
        const locations = results.map(result => {
            return {
                id: result._id,
                name: result.name,
                address: result.address,
                rating: result.rating,
                facilities: result.facilities,
                // remove m
                distance: `${result.distance.toFixed()}`
            }
        });
        //console.log(locations);
        res
            .status(200)
            .json(locations);
    } catch (err) {
        console.log(err);
        res
            .status(404)
            .json(err);
    }
};

const locationsReadOne = (req, res) => {
    Loc
        .findById(req.params.locationid)
        .exec((err, location) => {
            if (!location) {
                return res
                    .status(404)
                    .json({
                        "message": "location not found"
                    });
            } else if (err) {
                return res
                    .status(404)
                    .json(err);
            }
            res
                .status(200)
                .json(location);
        });
};

const locationsUpdateOne = (req, res) => {
    // console.log( parseFloat(req.body.lng));
    // console.log( parseFloat(req.body.locations));
    if (!req.params.locationid) {
        return res
            .status(404)
            .json({
                "message": "Not found, locationid is required"
            });
    }
    Loc
        .findById(req.params.locationid)
        // with the - before the attribute, select all attributes except it 
        .select('-reviews -rating')
        .exec((err, location) => {
            if (!location) {
                return res
                    .json(404)
                    .status({
                        "message": "locationid not found"
                    });
            } else if (err) {
                return res
                    .status(400)
                    .json(err);
            }
            location.name = req.body.name;
            location.address = req.body.address;
            location.facilities = req.body.facilities.split(',');
            location.coords = {
                type: "Point", 
                coordinates:
                [
                    parseFloat(req.body.lng),
                    parseFloat(req.body.lat)
                ]
        };
            location.openingTimes = [{
                days: req.body.days1,
                opening: req.body.opening1,
                closing: req.body.closing1,
                closed: req.body.closed1,
            }, {
                days: req.body.days2,
                opening: req.body.opening2,
                closing: req.body.closing2,
                closed: req.body.closed2,
            }];
           // console.log(location);
            location.save((err, loc) => {
                if (err) {
                    console.log('err save'+err);
                    res
                        .status(404)
                        .json(err);
                } else {
                    res
                        .status(200)
                        .json(loc);
                }
            });
        }
        );
};

const locationsDeleteOne = (req, res) => {
    console.log("enta??");
    const {locationid} =req.params;
    if (locationid){
        Loc
            // its possible split the request in find and delate
            .findByIdAndRemove(locationid)
            .exec((err, location)=>{
                if (err){
                    return res  
                        .status(404)
                        .json(err);
                } else {
                    return res
                    .status(204)
                    .json(null);
                }
            })
    } else {
        return res
            .status(404)
            .json({
                "message":"No Location"
            });
    }
};

module.exports = {
    locationsListByDistance,
    locationsCreate,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne
};