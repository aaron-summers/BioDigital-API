let settings = require('./settings');
let utf8 = require('utf8');
let request = require('request');
const dotenv = require('dotenv');
dotenv.config();
let express = require('express')
let app = express()

//middleware CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5050");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/*Add routes*/
app.get('/', index)
app.get('/request-access-token', request_access_token)
app.get('/query-collection-myhuman', query_collection_myhuman)

app.listen(settings.APP_PORT, settings.APP_HOST, function () {
    console.log("Server running at http://" + settings.APP_HOST + ":" + settings.APP_PORT + "/");
})

function index(req, res) {

    let html = '';
    let status = 200;

    html += '<pre>';
    html += '<h3>Private Application Authentication</h3>';
    html += '<pre>';
    html += '<a href="/request-access-token">Request Access Token</a>';
    res.type('text/html');
    res.status(status).send(html);
}

function request_access_token(req, res) {

    // ***********************************************************
    // Exchanges basic client credentials for an access token
    // ***********************************************************

    // Construct authentication string:
    //  1. Concatenate the client id, a colon character ":", and the client secret into a single string
    //  2. URL encode the string from step 1
    //  3. Base64 encode the string from step 2  
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

    // Construct an Authorization header with the value of 'Basic <base64 encoded auth string>'
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

    // Start the request
    request(options, (error, response, body) => {

        let html = "";
        // html += "<pre>";
        // html += "<a href=\"/\">Start Over</a>";
        let status = 200;

        if (response.statusCode == 400 || response.statusCode == 500) {

            let response_obj = JSON.parse(body);
            let response_print = JSON.stringify(response_obj, undefined, 2);

            // Handle known error
            html += "<pre>";
            html += "<h3>Known Error:</h3>";
            html += "<pre>";
            html += response_print;

        }
        else if (response.statusCode == 200) {

            let response_obj = JSON.parse(body);
            let response_print = JSON.stringify(response_obj)

            html += response_print;
            // res.send(response_obj)

            // html += "<pre>";
            // html += "<h3>Query Content API with Access Token</h3>";
            // html += "<pre>";
            // html += "<a href=\"/query-collection-myhuman?access_token=" + response_obj.access_token + "\">Query Collection: myhuman</a>";

        }
        else {
            // Handle unknown error
            status = response.statusCode
            html += "<pre>";
            html += "<h3>Unknown Error:</h3>";
            html += "<pre>";
            html += status;
            html += "<pre>";
            html += JSON.stringify(body);
            html += "<pre>";
            html += JSON.stringify(error);
        }

        res.type('json');
        res.status(status).send(html);
    })
}

function query_collection_myhuman(req, res) {

    // ***********************************************************
    //  Query Content API Collection with access token.
    // ***********************************************************       

    let access_token = req.query.access_token;
    let status = 200;
    let html = "";
    html += "<pre>";
    html += "<a href=\"/\">Start Over</a>";

    if (access_token && req.query.access_token != "") {


        // Construct an Authorization header with the value of 'Bearer <access token>'
        let headers = {
            'Accept': 'application/json',
            "Authorization": "Bearer " + access_token,
            'Cache-Control': 'no-cache'
        }

        // Configure the request
        let url = settings.CONTENTAPI_COLLECTIONS_URL + "myhuman";
        let options = {
            url: url,
            method: 'GET',
            headers: headers
        }

        // Start the request
        request(options, function (error, response, body) {

            if (response.statusCode == 400 || response.statusCode == 500) {

                let response_obj = JSON.parse(body);
                let response_print = JSON.stringify(response_obj, undefined, 2);

                // Handle known error
                html += "<pre>";
                html += "<h3>Known Error:</h3>";
                html += "<pre>";
                html += response_print;

            }
            else if (response.statusCode == 200) {

                let response_obj = JSON.parse(body);
                let response_print = JSON.stringify(response_obj, undefined, 2);

                // Handle known error
                html += "<pre>";
                html += "<h3>Success:</h3>";
                html += "<pre>";
                html += response_print;

            }
            else {
                // Handle unknown error
                status = response.statusCode
                html += "<pre>";
                html += "<h3>Unknown Error:</h3>";
                html += "<pre>";
                html += status;
                html += "<pre>";
                html += JSON.stringify(body);
                html += "<pre>";
                html += JSON.stringify(error);
            }

            res.type('json');
            res.status(status).send(html);

        })
    }
    else {
        status = 401;
        html += "<pre>";
        html += "You did not provide the access_token parameter";
        res.type('json');
        res.status(status).send(html);
    }

}