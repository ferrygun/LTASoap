'use strict'
const request = require('request');

function LTA(callback) {
	let formData = '<v:Envelope xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="http://www.w3.org/2001/XMLSchema" xmlns:c="http://schemas.xmlsoap.org/soap/encoding/" xmlns:v="http://schemas.xmlsoap.org/soap/envelope/"><v:Header /><v:Body><n0:getAddressLookup id="o0" c:root="1" xmlns:n0="http://ws.mobile.mytransport.sg/"><arg0 i:type="d:string">orchard</arg0></n0:getAddressLookup></v:Body></v:Envelope>';
	let contentLength = formData.length;

	let headers = {
		'Host':'m.mytransport.sg',
        'Content-Type':'text/xml;charset=utf-8',
        'Content-Length': contentLength,
        'SOAPAction':'getAddressLookup', 
		'User-Agent': 'ksoap2-android/2.6.0+',
		'W-Kiwi': 'v2.0'
	}
			
	let options = {
		url: 'https://m.mytransport.sg/mtc/api/soap?wsdl',
		method: 'POST',
		headers: headers,
		body: formData,
	}
	//console.log(options);

	let requestWithEncoding = function(options, callback) {
		let req = request.post(options);

		req.on('response', function(res) {
			let chunks = [];
			res.on('data', function(chunk) {
				chunks.push(chunk);
			});

			res.on('end', function() {
				let buffer = Buffer.concat(chunks);
				let encoding = res.headers['content-encoding'];
				if (encoding == 'gzip') {
					zlib.gunzip(buffer, function(err, decoded) {
						callback(err, decoded && decoded.toString());
					});
				} else if (encoding == 'deflate') {
					zlib.inflate(buffer, function(err, decoded) {
						callback(err, decoded && decoded.toString());
					})
				} else {
					callback(null, buffer.toString());
				}
			});
		});

		req.on('error', function(err) {
			callback(err);
		});
	}

	requestWithEncoding(options, function(err, data) {
		if (err) {
			console.log('err:' + err);
			callback('error');
		} else 
			//console.log(data);
			callback(data);
	})
}

LTA(function(returnValue) {
	console.log(returnValue);
});
