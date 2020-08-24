// National Parks Search App
// using bootstrap and national parks api
const apiKey = 'uL05BYpuIXbI5Td889TELnyuUeU2DfcbR49tmSrj';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

const nationalParksApp = function(query, maxResults=10) {
  const params = {
    method: 'GET',
    headers: {
      'X-Api-Key': apiKey
    },
    parameters: {
      'stateCode': query,
      'limit': maxResults
    }
  }
  console.log(params);
  listAPI(searchURL, params);
}

const listAPI = function(...args) {
  console.log('lists attempting to be retrieved');
  fetch(...args)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);    
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

const displayResults = function(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  responseJson.data[0].map(park => {
    $('#results-list').append(`<li><h3>${park.fullName}</h3><p>${park.description}</p><a href='${park.url}'>park website</a></li>`)
  })
  $('#results').removeClass('hidden');
}

const handleParkSearch = function() {
  $('form').submit(event => {
    event.preventDefault();
    console.log('submission detected');
    const stateCodes = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    nationalParksApp(stateCodes, maxResults);
  })
}

$(handleParkSearch);