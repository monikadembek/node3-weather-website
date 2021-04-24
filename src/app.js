const path = require('path');

// express exposes single function and we call it to create new exress application
const express = require('express');

const hbs = require('hbs');

const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');

// path to the directory the current script lives in
console.log(__dirname); 
// path to the file itself
console.log(__filename);

const app = express(); // we start app, done only once

// --- Define paths for Expres config ---
// creates path from provided arguments
const publicDirectoryPath = path.join(__dirname, '../public');
console.log(publicDirectoryPath);

// by default templates should be put in 'views' directory
// but we can change that name
const viewsPath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// --- Setup handlebars engine and views location ---
// sets template engine to use in express
// in this case handlebars
// now we can use it to create dynamic templates
app.set('view engine', 'hbs');
// customizing the views directory pointing express to directory with new name
app.set('views', viewsPath);

// registering handlebar partials - reusable parts of template
// takes path to the directory where partials live
hbs.registerPartials(partialsPath);

// --- setup static directory to serve
// serving up the directory, customizing the server to serve up the folder
// this is a static call serving index.html for root route
// it serves the entire content from that directory, 
// so we have access to all html files from it
app.use(express.static(publicDirectoryPath));

// app.get() - lets us configure what a server should do when someone 
// tries to get a resource at a specific url
// first argument is route, 
// second - function which describes what we wanna do when sb visits this route
// function takes 2 arguments: 
// request - object containing all the information about the incoming request to the server
// response - a bunch of methods allowing us to customize what are we gonna send back 
// to the requester

// setting up the routes:
// app.com - root route
// app.com/help - help route
// app.com/about

// this route will never run because we serve the static files for root route
/*
app.get('', (req, res) => {
  // this allows to send sth back to the requester, will be displayed in browser
  // sending html code
  res.send('<h1>Weather</h1>');
}); */

/*
app.get('/help', (req, res) => {
  // sending JSON data (object or array)
  // express detects that we want to send an object 
  // and it will automaticaly stringify if for us and send it to the requester correctly
  res.send([{
    name: 'Andrew',
    age: 27
  }, 
  {
    name: 'Mina',
    age: 27,
  }]);
});


app.get('/about', (req, res) => {
  res.send('<h1>About</h1>');
});
*/

app.get('', (req, res) => {
  // render() - renders one of the views,
  // first argument is the view to render
  // in this case one of the handlebars templates
  // second argument is object containing all the values you want the view to access
  // we inject those values into the template creating dynamic html document
  // values provided in the template can be accessesd in html with: {{title}}
  // when a user calls root route express will get the index template, 
  // convert it to html and send it back to the requester
  res.render('index', {
    title: 'Weather',
    name: 'Andrew Mead'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Andrew Mead'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    message: 'This is some help messages rendered dynamically',
    name: 'Andrew Mead'
  });
});

app.get('/weather', (req, res) => {
  const city = req.query.address;
  if (!city) {
    return res.send({
      error: 'You must provide the address'
    });
  }
  
  geocode(city, (error, {latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({
        error
      });
    } 
    
    // console.log('Data from geocode', data);
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({
          error
        });
      }
  
      res.send({
        forecast: forecastData,
        location,
        address: city
      });
    });
  });


  
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term'
    });
  }

  console.log(req.query); // object with query string values
  res.send({
    products: []
  });
});

// matching specific pattern
// matches any page that starts with /help/
app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    errorText: 'Help article not found',
    name: 'Andrew Mead'
  });
});

// * wildcard character - match anything that hasn't been matched by prev routes
app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    errorText: 'Page not found',
    name: 'Andrew Mead'
  });
});

// start server up and have it listen at specific port, method used only once
// in local development environment - we use port 3000 
// default port for http websites is 80
// second optional parameter is callback function which runs when server is up and running
// process of starting server is asynchronous process
app.listen(3000, () => {
  // this will never come up in browser
  console.log('Server is up on port 3000'); 
});

// with web server node process is running as long as we will stop it
// its job is to stay up and running listening and processing 
// new incoming requests
// crtl+c shuts it down
// we need to restart the server after any changes, or use nodemon

// for now our server is only accessible on our machine and we can access it
// on localhost:3000, if we visit it we will get the messege from res.send()
// when we visited that url in the browser it went off to the server
// the express server found the matching route - the root, 
// and processed the request using our handler
// the handler used response.send() to send back the text response
