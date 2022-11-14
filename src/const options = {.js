const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'guoZvZ5ITGggEWWo85bhuHZ51rrJpxFo',
    'X-RapidAPI-Host': 'shazam-core.p.rapidapi.com'
  }
};

fetch('https://shazam-core.p.rapidapi.com/v1/charts/world', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));