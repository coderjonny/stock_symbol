var http = require("http");
var https = require("https");
var server = http.createServer( (req, res) => {
  res.setHeader('Content-Type', 'application/json');
} );

getNews = (symbol, callbackFunc) => {
  var options = {
    host: 'api.iextrading.com',
    path: `/1.0/stock/${symbol}/news/last/1`,
    headers: {'User-Agent': 'request'}
};
  let data = "";

  https.get(options, (res) => {
    res.on("data", chunk => {
      data += chunk;
    });

    res.on("end", () => {
      if (res.statusCode === 200) {
        try {
          const symbolData = JSON.parse(data)
          const newsLink = symbolData[0].url
          callbackFunc({newsLink})

        } catch (e) {
          console.log('====================================');
          console.log('error parsing JSON', e);
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

}

getLogo = (symbol, callbackFunc) => {
  var options = {
    host: 'api.iextrading.com',
    path: `/1.0/stock/${symbol}/logo`,
    headers: {'User-Agent': 'request'}
  };
  let data = "";

  https.get(options, (res) => {

    console.log("api res.", res.statusCode);

    res.on("data", chunk => {
      data += chunk;
    });

    res.on("end", () => {
      if (res.statusCode === 200) {
        try {
          const symbolData = JSON.parse(data)
          callbackFunc( {logoUrl: symbolData.url } )
        } catch (e) {
          console.log('====================================');
          console.log('error parsing JSON', e);
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

}

getQuote = (symbol, callbackFunc) => {
  const options = {
    host: 'api.iextrading.com',
    path: `/1.0/stock/${symbol}/quote`,
    headers: {'User-Agent': 'request'}
  };

  let data = "";
  https.get(options, (res) => {
    res.on("data", chunk => {
      data += chunk;
    });

    res.on("end", () => {
      if (res.statusCode === 200) {
        try {
          const symbolData = JSON.parse(data)

          const {
            latestPrice, companyName
          } = symbolData

          callbackFunc({
            latestPrice,
            companyName
          })

        } catch (e) {
          console.log('====================================');
          console.log('error parsing JSON', e);
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
