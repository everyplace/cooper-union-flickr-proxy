var request = require('request');

exports.json = function(req, res, next) {
  res.set({
    'Content-Type':'application/json',
    'Access-Control-Allow-Origin':'*'
  });

  next();
};

exports.index = function(req, res){
  var path = 'about';
  res.render('template', {
    title: 'Serving a real template',
    name: path,
    description:'Sample links for the Flickr API',
    examples:[{
      url:"/trending?ll=40.7293461,-73.9905962",
      title:"Searching for trending places around Cooper Union"
    },
    {
      url:"/venue/3fd66200f964a52035e41ee3",
      title:"Get information on a venue id, specifically Webster Hall"
    }]
  });
};

exports.venue = function(req, res) {
  //comment again
  var searchObj = req.query;

  foursquare.venues.venue(req.params.id, searchObj, function(err, response){
    res.end(JSON.stringify(response));
  });
};

exports.trending = function(req, res) {
  //comment again
  var searchObj = req.query;

  foursquare.venues.trending(searchObj, function(err, response){
    res.end(JSON.stringify(response));
  });
};


exports.template = function(req, res){
  var path = (req.url.substring(1));
  var config = {
    title: (req.title) ? req.title : path,
    name: (req.name) ? req.name : path,
    page: (req.page) ? req.page : ""
  };

  for (i in attributes) {
    if(req[attributes[i]] !== undefined) {
      config[attributes[i]] = req[attributes[i]];
    }
  }
  console.log(config)
  res.render('template', config);
};
