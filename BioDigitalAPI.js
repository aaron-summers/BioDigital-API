let settings = require('./settings');
let utf8 = require('utf8');
let request = require('request');
// const dotenv = require('dotenv');
// dotenv.config();
let express = require('express')
let app = express()
const https = require('https');
const auth = require('./Auth/TokenExchange')

//middleware CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/*Add routes*/
app.get('/browse', browse)
// app.get('/browse/categories/systems', systems)
// app.get('/query-collection-myhuman', query_collection_myhuman)

app.listen(settings.APP_PORT, settings.APP_HOST, function () {
    console.log("Server running at http://" + settings.APP_HOST + ":" + settings.APP_PORT + "/");
})


function browse(req, res) {

    let promiseData = auth.get_access_token()

    promiseData.then(JSON.parse).then(function(result) {
        // console.log(result.access_token)
        let data = "";
        let humanUrl = settings.CONTENTAPI_COLLECTIONS_URL + "myhuman";
        let contentOptions = {
            url: humanUrl,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                "Authorization": "Bearer " + result.access_token,
                'Cache-Control': 'no-cache'
            }
        }

        //myhuman content api request
        request(contentOptions, (err, myhumanRes, myhumanBody) => {
            if (myhumanRes.statusCode == 200) {
                let contentRes = JSON.parse(myhumanBody);
                // let jsonContent = JSON.stringify(contentRes);

                data += contentRes;

            } else {
                let contentRes = JSON.parse(myhumanBody);
                data += contentRes;
            }
            res.type('json');
            res.send(myhumanBody);
        })       
    })
}
