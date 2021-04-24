console.log('Client side javascript files is loaded');

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-one');
const messageTwo = document.querySelector('#message-two');

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const location = search.value;
  console.log(location);

  messageOne.textContent = 'Loading...';

  fetch(`/weather?address=${location}`)
  .then((response) => response.json())
  .then((data) => {
    if (data.error) {
      console.log('Error: ', data.error);
      messageOne.textContent = data.error;
    } else {
      console.log('Forecast: ', data.forecast, ' Location: ', data.location);
      messageOne.textContent = data.forecast;
      messageTwo.textContent = data.location;
    }  
  });
});