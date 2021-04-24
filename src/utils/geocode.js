const request = require('request');

const geocode = (address, callback) => {
	const geocodingApiUrl = 'http://www.mapquestapi.com/geocoding/v1/address?key=rAfX8cQcUK9fsgZCUsG1eqjWlATHcDx6&location=' + encodeURIComponent(address);
	// encodes special characters

	request({ url: geocodingApiUrl, json: true }, (error, { body } )	 => {
		if (error) {
			callback('Unable to connect to location services', undefined);
		} else if (body.results[0].locations.length === 0) {
			callback('No location found. Try another search', undefined);
		} else {
			const { latLng, adminArea5 } = body.results[0].locations[0];
			callback(undefined, {
				longitude: latLng.lng,
				latitude: latLng.lat,
				location: adminArea5
			})
		}
	});
};

module.exports = geocode;