const yargs = require('yargs');
const axios = require('axios');

//831f6d51b5a3933df44aca3af0951db7


const argv = yargs
.options(
  {
    a:
    {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    },
  })
  .default('a', "los angeles california")
  .help()
  .alias('help', 'h') //actual , alias
  .argv;

var encodedAddress = encodeURIComponent(argv.address);
var geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeURL).then((response) =>
{
  if(response.data.status === 'ZERO_RESULTS')
  {
    throw new Error('Unable to find that address');
  }
  var lat = response.data.results[0].geometry.location.lat;
  var lng = response.data.results[0].geometry.location.lng;
  var weatherURL = `https://api.darksky.net/forecast/831f6d51b5a3933df44aca3af0951db7/${lat},${lng}`

  console.log(response.data.results[0].formatted_address);
  return axios.get(weatherURL);
}).then((response) =>
{
  var temperature = response.data.currently.temperature;
  var apparentTemperature = response.data.currently.apparentTemperature;
  var chancePrecipitate = response.data.currently.precipProbability
  var temperatureHigh = response.data.daily.data[0].temperatureHigh;
  var temperatureLow = response.data.daily.data[0].temperatureLow;

  console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`);
  console.log(`Temperature High: ${temperatureHigh}`);
  console.log(`Temperature Low: ${temperatureLow}`);
  console.log(`${chancePrecipitate}% probability of rain.`);

}).catch((e) =>
{
  if (e.code === 'ENOTFOUND')
  {
    console.log('Unable to connect to API servers');
  }
  else
  {
    console.log(e.message);
  }
});
