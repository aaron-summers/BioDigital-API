let settings = require('../settings');
let utf8 = require('utf8');
let request = require('request');

function get_access_token() {
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
    return new Promise(function (resolve, reject) {
        request(options, (error, response, body) => {
            if (error) {
                reject(error)
            } else {
                resolve(body)
            }
        })
    })
}

module.exports = {
    get_access_token: get_access_token
}