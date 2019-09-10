let settings = require('./settings');
let utf8 = require('utf8');
let request = require('request');
const dotenv = require('dotenv');
dotenv.config();
let express = require('express')
let app = express()

//middleware CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/*Add routes*/
app.get('/', index)
app.get('/browse', browse)
// app.ger('/browse/categories/systems', systems)
// app.get('/query-collection-myhuman', query_collection_myhuman)

app.listen(settings.APP_PORT, settings.APP_HOST, function () {
    console.log("Server running at http://" + settings.APP_HOST + ":" + settings.APP_PORT + "/");
})

function index(req, res) {

    let html = '';
    let status = 200;
    // html += '<pre>';
    // html += '<h3>Private Application Authentication</h3>';
    // html += '<pre>';
    // html += '<a href="/request-access-token">Request Access Token</a>';
    res.type('json');
    res.status(status).send(html);
}

function browse(req, res) {

    let auth_str = settings.CLIENT_ID + ":" + settings.CLIENT_SECRET;
    auth_str = utf8.encode(auth_str);
    let buffer = new Buffer(auth_str);
    auth_str = buffer.toString('base64');

    // For Private application authentication, you must specifiy
    // grant_type=client_credentials and the service scope.  For the 
    // Content API, scope=contentapi
    let post_data_string = JSON.stringify({
        "grant_type": settings.GRANT_TYPE,
        "scope": settings.SCOPE
    });

    // Construct an Authorization header:b'Basic <base64 auth string>'
    let headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json',
        "Authorization": "Basic " + auth_str
    }

    // Configure the request
    let url = settings.OAUTH_TOKEN_URL;
    let options = {
        url: url,
        method: 'POST',
        headers: headers,
        form: post_data_string
    }

    //exchange credentials for access token
    request(options, (error, response, body) => {

        let html = "";
        let data = "";
        let credResponse = JSON.parse(body);
        let status = credResponse.statusCode
        console.log(response.statusCode)

        html += body;
        let humanUrl = settings.CONTENTAPI_COLLECTIONS_URL + "myhuman";
        let contentOptions = {
            url: humanUrl,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                "Authorization": "Bearer " + credResponse.access_token,
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