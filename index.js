var http = require("http");
var https = require("https");
var server = http.createServer( (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  // console.log('create server , req', req);
  
  // res.end(JSON.stringify({ a: 1 }, null, 3));


  console.log(res);
  
} );

getQuote = (symbol) => {
  // const symbolUrl = `https://api.iextrading.com/1.0/stock/${symbol}/quote`
  var options = {
    host: 'api.iextrading.com',
    path: `/1.0/stock/${symbol}/quote`,
    headers: {'User-Agent': 'request'}
};
  let data = "";

  const getReq = https.get(options, res => {

    console.log("api res.", res.statusCode);

    res.on("data", chunk => {
      data += chunk;
    });

    res.on("end", () => {
      if (res.statusCode === 200) {
        try {
          const symbolData = JSON.parse(data)
          console.log("api call  ended!", symbolData.companyName);
        } catch (e) {
          console.log('====================================');
          console.log('error parsing JSON');
          console.log('====================================');
        }
      } else {
        console.log('====================================');
        console.log('status', res.statusCode );
        console.log('====================================');
      }
    });
  }).on('error', err => {
    console.log('====================================');
    console.log('error: ', err);
    console.log('====================================');
  });

};

server.on("request", (request, response) => {
  var body = [];

  const { headers, url, method } = request;

  let postData = "";

  request.on("data", chunk => {
    postData += chunk;
  });

  request
    .on("end", () => {
      //'end' event is raised once per request,
      const {symbol} = JSON.parse(postData)

      if (symbol) {
        return getQuote(symbol)
      }
    })
    .on("error", () => {
      response.statusCode = 400;
      response.end();
    });

  response.on("error", err => {
    console.err(err);
  });
});

server.listen(8080, () => {
  console.log(" server listening at 8080 ");
});
