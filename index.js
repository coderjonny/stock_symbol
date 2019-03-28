var http = require("http");
var server = http.createServer( (req, res) => {
  res.setHeader('Content-Type', 'application/json');
} );
const { getLogo, getNews, getQuote } = require('./api')

server.on("request", (request, response) => {
  var body = [];
  let postData = "";

  request.on("data", chunk => {
    postData += chunk;
  });

  request.on("end", () => {
      body = Buffer.concat(body).toString();
      const {symbol} = JSON.parse(postData)
      let responseObject = { }
      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');

      response.on('err', err => {
        console.log(err)
      })

      const addResponseData = (data) => {
        responseObject = {
          ...responseObject,
          ...data
        }
      }

      const endResponse = (symbolData) => {
        response.write(JSON.stringify(symbolData));
        response.end();
      }

      if (symbol) {
        getQuote(symbol, (quotePrice) => {
            addResponseData(quotePrice)
            getLogo(symbol, (logoData) => {
                addResponseData(logoData)
                getNews(symbol, (newsData) => {
                  addResponseData(newsData)
                  endResponse(responseObject)
                })
            })
          }
        )
      } else {
        endResponse({err: 'no symbol passed'})
      }

    }).on("error", () => {
      response.statusCode = 400;
      response.end();
    });

  response.on("error", err => {
    console.log(err);
  });

});

server.listen(8080, () => {
  console.log(" server listening at 8080 ");
});
