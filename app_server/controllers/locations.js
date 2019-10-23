const request = require('request');
const apiOptions = {
  server: 'http://localhost:3000'
};
// in production phase, the URL change
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = 'https://pure-temple-67771.herokuapp.com';
}

const renderHomepage = (req, res, responseBody) => {
  //console.log(responseBody);
  let message = null;
  if (!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = "No places found nearby";
    }
  }
  res.render('locations-list', {
    title: 'Home',
    pageHeader: {
      title: 'Loc8r, a better place to live',
      strapline: 'Find places to work with wifi near you!!!'
    },
    locations: responseBody,
    message
  });
};

/* GET homepage*/
const homelist = (req, res) => {
  //console.log(apiOptions.server);
  const path = '/api/locations';
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {},
    qs: {
      lng: 0.7992599,
      lat: 51.378091,
      maxDistance: 200000
    }
  };
  //console.log("req opt "+ requestOptions.url);
  request(
    requestOptions,
    (err, { statusCode }, body) => {
      // console.log("request result: \n");
      // console.log(err);
      // console.log(response);
      // console.log(body);
      let data = [];
      if (statusCode === 200 && body.length) {
        data = body.map((item) => {
          item.distance = formatDistance(item.distance);
          //console.log(item);
          return item;
        });
      }
      renderHomepage(req, res, data);
    }
  );

};

const formatDistance = (distance) => {

  let thisDistance = 0;
  let unit = 'm';
  if (distance > 1000) {
    thisDistance = parseFloat(distance / 1000).toFixed(1);
    //console.log(thisDistance);
    unit = 'km';
  } else {
    thisDistance = Math.floor(distance);
  }
  //console.log(thisDistance);
  return thisDistance + unit;
};


const locationInfo = (req, res) => {
  //console.log(req.params);
  const path = `/api/locations/${req.params.locationid}`;
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {}
  };
  //console.log("request: \n");
  //console.log(requestOptions);
  request(
    requestOptions,
    (err, response, body) => {
      const data = body;
      data.coords = {
        lng: body.coords[0],
        lat: body.coords[1]
      };
      //console.log(data);
      renderDetailPage(req, res, data);
    }
  );
};

const renderDetailPage = (req, res, location) => {
  res.render('location-info',
    {
      title: location.name,
      pageHeader: {
        title: location.name,
      },
      sidebar: {
        context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
        callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
      },
      location
    });
};

const reviewForm = (req, res) => {
  //console.log("richiesta della pagina di rewiew");
  const path = `/api/locations/${req.params.locationid}`;
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {}
  };
  //console.log("request: \n");
  //console.log(requestOptions);
  request(
    requestOptions,
    (err, response, body) => {
      //console.log(body.name);
      //const name = body.name;
      renderReviewForm(req, res, body);
    }
  );

};

const renderReviewForm = function (req, res, { name }) {
  res.render('location-review-form', {
    title: `Review ${name} on Loc8r`,
    pageHeader: { title: `Review ${name}` },
    error: req.query.err
  });
};

const addReview = (req, res) => {
  // console.log("parms ");
  // console.log(req.params);
  //console.log("body");
  //console.log(req.body);
  const form = JSON.parse(JSON.stringify(req.body))
  console.log(form);
  const locationid = req.params.locationid;
  const path = `/api/locations/${locationid}/reviews`;
  const postdata = {
    author: form.name,
    rating: parseInt(form.rating, 10),
    reviewText: form.review
  };
  console.log("object:");
  //console.log(postadata);
  console.log("\n");
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'POST',
    json: postdata
  };
  console.log(requestOptions);
  // control data field
  if (!postdata.author || !postdata.rating || !postdata.reviewText) {
    res.redirect(`/location/${locationid}/review/new?err=val`);
  } else {
    request(
      requestOptions,
      (err, { statusCode }, { name }) => {
        if (statusCode === 201) {
          res.redirect(`/location/${locationid}`);
        } else if (statusCode === 400
          && name && name === 'ValidationError') {
          res.redirect(`/location/${locationid}/review/new?err=val`);
        } else {
          console.log(body);
          showError(req, res, statusCode);
        }
      }
    );
  }
};

module.exports = {
  homelist,
  locationInfo,
  reviewForm,
  addReview
}