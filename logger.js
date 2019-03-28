const fs = require('fs');

const logger = (data) => {
    fs.writeFile("./tmp/test", JSON.stringify(data), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 
}

module.exports = {
    logger
}