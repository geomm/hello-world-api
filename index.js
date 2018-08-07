/*
* This is a simple "Hello World" API,
* that listens to a port 4000 and when someone posts anything to the route /hello,
* the API returns a welcome message in JSON.
*
*/

// Dependencies
const http = require('http');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;

// Server
const server = http.createServer(function(req, res){

	// parseURL & collect clean path, queryString from url object
	const parseUrl = url.parse(req.url, true); // true here means that query string(if any) should be parsed
	const urlPath = parseUrl.pathname;
	const urlCleanPath = urlPath.replace(/^\/+|\/+$/g,'');
	const urlQueryStringObj = parseUrl.query;

	// collect method & headers from req object
	const method = req.method.toLowerCase();
	const headers = req.headers;

	// Payload if any (streams in node.js)
	let buffer;
	const decoder = new stringDecoder('utf-8');
	
	// Server request 'data' handler (streams in node.js)
	req.on('data', function(data){
		buffer += decoder.write(data);
	});

	// Server request 'end' handler (streams in node.js)
	req.on('end', function(){
		buffer += decoder.end();

		// request data as object 
		const reqData = {
			'urlCleanPath' : urlCleanPath,
			'urlQueryStringObj': urlQueryStringObj,
			'method': method,
			'headers': headers,
			'payload': buffer !== 'undefined' ? buffer : 'none'
		}

		// chosen route is a Routes object
		const chosenRoute = typeof(routes[urlCleanPath]) !== 'undefined' ? routes[urlCleanPath] : routes.notFound;

		// route object (data, callback)
		chosenRoute(reqData, function(statusCode, payload){ // this is the response payload

			// indicate types and define defaults in case of a type mismatch
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			payload = typeof(payload) == 'object' ? payload : {};

			/* add reqData after the welcome message to the payload in order to appear in JSON 
			response if someone uses the route /hello */
			if(reqData.urlCleanPath === 'hello'){
				payload.reqData = reqData;
			}

			// Server response
			res.setHeader('Content-Type','application/JSON');
			res.writeHead(statusCode);
			res.end(JSON.stringify(payload));

			// Server log
			console.log(`>> status code: ${statusCode}\npayload: ${JSON.stringify(payload)}\nrequest data:`, reqData);

		});
	
	});

});

server.listen(4000, function(){
	console.log('this server listens to the port 4000');
});


// The routes object
const routes = {
	hello : (data, callback) => {
		callback(200, {'welcome-message':'Hello there! Goodtimes!'});
	},
	notFound : (data, callback) => {
		callback(404, {'route':'Not Found'});
	} 
}
