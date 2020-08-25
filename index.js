// National Parks Search App
// using bootstrap and national parks api
const apiKey = 'uL05BYpuIXbI5Td889TELnyuUeU2DfcbR49tmSrj';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function htmlTemplate(name, des, addresses, url, parkCode) {
  //identify physical address
  console.log(parkCode)
  if (addresses[0].type === 'Physical') {
    var i = 0;
  } else {
    i = 1;
  }
  //Identify which address lines are blank and setting the template for the line items, respectively.
  if ((addresses[i].line2.length && addresses[i].line3.length) === 0) {
    return `<li>
      <h3>${name}</h3>
      <p>${des}</p>
      <p>${addresses[i].line1}</br>${addresses[i].city}</br>${addresses[i].stateCode}</br>${addresses[i].postalCode}</p>
      <p><a href="${url}">${url}</a> | Park Code(s): ${parkCode}</p>
      </li>
    `;
  } else if (addresses[i].line2.length === 0){
    return `<li>
      <h3>${name}</h3>
      <p>${des}</p>
      <p>${addresses[i].line1}</br>${addresses[i].line3}</br>${addresses[i].city}</br>${addresses[i].stateCode}</br>${addresses[i].postalCode}</p>
      <p><a href="${url}">${url}</a> | Park Code(s): ${parkCode}</p>
      </li>
    `;
  } else if (addresses[i].line3.length === 0){
    return `<li>
      <h3>${name}</h3>
      <p>${des}</p>
      <p>${addresses[i].line1}</br>${addresses[i].line2}</br>${addresses[i].city}</br>${addresses[i].stateCode}</br>${addresses[i].postalCode}</p>
      <p><a href="${url}">${url}</a> | Park Code(s): ${parkCode}</p>
      </li>
    `;
  } else{
    return `<li> 
    <h3>${name}</h3>
    <p>${des}</p>
    <p>${addresses[i].line1}</br>${addresses[i].line2}</br>${addresses[i].line3}</br>${addresses[i].city}</br>${addresses[i].stateCode}</br>${addresses[i].postalCode}</p>
    <p><a href="${url}">${url}</a> | Park Code(s): ${parkCode}</p>
  </li>
  `;
  }
}

const displayResults = function(responseJson) {
  $('#results-list').empty();  
  responseJson.data.map(park => {$('#results-list').append(htmlTemplate(park.fullName, park.description, park.addresses, park.url, park.parkCode))
  })
  $('#loading-screen').toggleClass('hidden');
  $('#results').removeClass('hidden');
}

function listAPI(url) {
  console.log('lists attempting to be retrieved');
  fetch(url)
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

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

const nationalParksApp = function(query, maxResults=10) {
  console.log((query.length + 1) % 2)
  //multiple park or state codes are exclusively cases in which query-lengths are odd numbered and have no empty spaces
  if ((query.length + 1) % 2 === 0) {
    //cases of either multiple state or park codes
    if((query.length - 5)% 5 === 0){
      var params = {
        stateCode: query,
        limit: maxResults,
        api_key: apiKey
      }
    }
    else if((query.length - 9)%9 === 0) {
      var params = {
        parkCode: query,
        limit: maxResults,
        api_key: apiKey
      }
    } else {
      return alert('state codes are 2 letters in length while park codes are 4.')
    }
  } else {
    //cases of either a single state or park code
    if(query.length - 2 === 0){
      var params = {
        stateCode: query,
        limit: maxResults,
        api_key: apiKey
      }
    }
    else if(query.length - 4 === 0) {
      var params = {
        parkCode: query,
        limit: maxResults,
        api_key: apiKey
      }
    } else {
      return alert('state codes are 2 letters in length while park codes are 4 letters.')
    }
  }
  const queryString = formatQueryParams(params);
  console.log(queryString);
  const url = searchURL + '?' + queryString;
  listAPI(url);
}

const handleParkSearch = function() {
  $('form').submit(event => {
    event.preventDefault();
    $('#results').addClass('hidden');
    let stateCodes = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    let parkCodes = $('#js-park-codes').val();
    if (parkCodes) {
      stateCodes = parkCodes;
    } else {
      parkCodes = '';
    }
    $('#loading-screen').toggleClass('hidden');
    nationalParksApp(stateCodes.replace(' ',''), maxResults);
  })
}

const handleButtonClicks = function() {
  $('form').on('click','#js-park-code', event => {
    console.log('PARK CODES')
  })
}

$(handleParkSearch);