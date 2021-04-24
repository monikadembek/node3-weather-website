const request = require('request');

// first argument is options object
// second argument is callback which will run when response comes back, 
// when we get the data or error
// json: true - request will parse the response as json, 
// JSON.parse parsing not necessary

const forecast = (lat, long, callback) => {
	const url = `http://api.weatherstack.com/current?access_key=d8c528749d194a901a9bc33070ce69dd&query=${lat},${long}&units=m`;

  console.log('url: ', url);

	request({ url, json: true }, (error, { body }) => {
		if (error) {
			callback('Unable to connect to weather service', undefined);
		} else if (body.error) {
			callback('Unable to find location', undefined);
		} else {
      const { weather_descriptions, temperature: temp, feelslike } = body.current;
			callback(undefined, `${weather_descriptions[0]}. It is currently ${temp} degrees out, but it feels like ${feelslike} deegrees.`);
		}
	})
}; 

module.exports = forecast;