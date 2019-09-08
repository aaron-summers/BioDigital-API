
let argv = require('minimist')(process.argv.slice(2));
const dotenv = require('dotenv');
dotenv.config();

exports.APP_HOST = argv.host || '127.0.0.1';
exports.APP_PORT = argv.port || '5000';

// BioDigital OAuth endpoint for requesting an access token
exports.OAUTH_TOKEN_URL = 'https://apis.biodigital.com/oauth2/v1/token/';

// BioDigital Content API endpoint for collection requests
exports.CONTENTAPI_COLLECTIONS_URL = 'https://apis.biodigital.com/services/v1/content/collections/';

// Your API / Developer key you received when you registered your
// application at https://developer.biodigital.com
exports.CLIENT_ID = process.env.API_KEY;

// Your API / Developer secret you received when you registered your
// application at https://developer.biodigital.com
exports.CLIENT_SECRET = process.env.SECRET_KEY;

// The type of authorization being requested
exports.GRANT_TYPE = 'client_credentials';

// The service scope in which your authorization will be used
exports.SCOPE = 'contentapi';