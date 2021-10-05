// Refer : https://nodejs.dev/learn/making-http-requests-with-nodejs
const https = require('https');

function bufferArrayToJson(bufferArray) {
	return JSON.parse(bufferArray.join(''));
}

function objectIsEmpty(object) {
	return [...Object.keys(object)].length === 0;
}

module.exports = {
	get: (hostname, path, header) => {
		return new Promise((resolve, reject) => {
			let buffer = [];
			const options = {
				hostname,
				port: 443,
				path,
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'user-agent': 'Mozilla/5.0',
					...header,
				},
			};

			try {
				const request = https.request(options, _res => {
					_res.on('data', d => {
						buffer.push(d);
					});
					_res.on('end', () => {
						resolve(bufferArrayToJson(buffer));
					});
				});
				request.end();
			} catch (err) {
				reject('https request is error');
				console.log(err);
			}
		});
	},
	post: (hostname, path, data) => {
		const jsonToString = !objectIsEmpty(data) ? JSON.stringify(data) : '';
		const contentLength = jsonToString.length;

		return new Promise((resolve, reject) => {
			let buffer = [];
			const options = {
				hostname,
				port: 443,
				path,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': contentLength,
					Accept: 'application/json',
				},
			};

			try {
				const request = https.request(options, _res => {
					_res.on('data', d => {
						buffer.push(d);
					});
					_res.on('end', () => {
						resolve(bufferArrayToJson(buffer));
					});
				});
				request.write(jsonToString);
				request.end();
			} catch (err) {
				reject('https request is error');
				console.log(err);
			}
		});
	},
};
