var request = require('request'),
    Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: process.env.FLICKR_KEY,
      secret: process.env.FLICKR_SECRET
    };


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
      url:"/search?text=Cooper Union",
      title:"Search for 100 photos with any text describing Cooper Union"
    },
    {
      url:"/search?text=Cooper Union&count=1",
      title:"Search for 1 photos with any text describing Cooper Union (count can be up to 500)"
    }]
  });
};

exports.search = function(req, res){


  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    // we can now use "flickr" as our API object,
    // but we can only call public methods and access public data
    if(("text" in req.query)&&(req.query.text.length>0)){

      flickr.photos.search({
        text:req.query.text,
        page: 1,
        per_page: req.query.count || 100
      }, function(err, result) {

        for(var i in result.photos.photo){
          var photo = result.photos.photo[i];
          result.photos.photo[i].sizes={
            large:"https://c1.staticflickr.com/" + photo.farm+"/"+photo.server+"/"+photo.id+"_"+photo.secret+"_b.jpg",
            small:"https://c1.staticflickr.com/" + photo.farm+"/"+photo.server+"/"+photo.id+"_"+photo.secret+"_m.jpg"
          }
          result.photos.photo[i].url = "https://www.flickr.com/photos/"+photo.owner+"/"+photo.id;
        }

        res.end(JSON.stringify(result));
      });
    } else {
      res.end(JSON.stringify({"error":"no text search term"}));
    }


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
