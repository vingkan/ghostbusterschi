'use strict';

let express = require('express');
let app = express();
let request = require('request');
let moment = require('moment');
let config = require('./config');

/* Global Variables */

const PORT = process.argv[2] || 8080;
const DATASET_URL = 'https://data.cityofchicago.org/resource/suj7-cg3j.json';

/* Helper Functions */

function get(url, query) {
	return new Promise((resolve, reject) => {
		request({
			method: 'GET',
			url: url,
			qs: query || {}
		}, (error, response, body) => {
			if (error) {
				reject(error);
			} else {
				resolve(body);
			}
		});
	});	
}

function getISOString(ts) {
	return moment(ts).format(`YYYY-MM-DDTHH:mm:ss`);
}

function convertTime(timestamp, in_range, out_range) {
	let real_range = in_range[1] - in_range[0];
	let real_val = timestamp - in_range[0];
	let real_ratio = real_val / real_range;
	let res_range = out_range[1] - out_range[0];
	let res_val = (real_ratio * res_range) + out_range[0];
	return res_val;
}

function isInRange(timestamp, range) {
	return timestamp >= range[0] && timestamp <= range[1];
}

function reportToUser(error) {
	console.log(error);
	return 'Server Error: ' + error; //JSON.stringify(error);
}

/* API Endpoints */

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

/*app.all('*', (req, res, next) => {
	next();
});*/

app.get('/data', (req, res) => {
	get(DATASET_URL, req.query).then((raw) => {
		let data = JSON.parse(raw);
		res.send(data);
	}).catch((error) => {
		res.send(error);
	});
});

app.get('/hello', (req, res) => {
	res.send('Hello World!');
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`);
	console.log(`Navigate to https://ghostbusterschi.glitch.me`);
});


