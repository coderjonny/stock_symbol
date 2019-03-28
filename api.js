var https = require("https");

const getNews = (symbol, callbackFunc) => {
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

const getLogo = (symbol, callbackFunc) => {
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

const getQuote = (symbol, callbackFunc) => {
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

module.exports = {
    getLogo,
    getNews,
    getQuote
}