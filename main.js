const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
let nextToken = '';
let prevToken = '';
let currentQuery = '';

// Rendering to DOM

function renderResult(result) {
  let vid = `${result.id.videoId}`;
  console.log(vid);
  return `
    <div class="thumbnail js-thumbnail">
      <img src=${result.snippet.thumbnails.medium.url} name=${vid}>
      <p>${result.snippet.title}</p>
    </div>
  `;
}

function renderPlayer(vId) {
  return `
    <iframe src="https://www.youtube.com/embed/${vId}?autoplay=1" frameborder="0" allowfullscreen></iframe>
    <div class="channelSuggestionContainer">
    <p class="channelText">More from this Channel</p>
    <div class="channelSuggestion">
      <div class="suggestionImg">
        <img src="https://ak1.picdn.net/shutterstock/videos/22446301/thumb/1.jpg">
        <div class="infoContainer">
        <span class="suggestionInfo">Video Suggestion 1 Title and Info</span>
        </div>
      </div>
    </div>
    <div class="channelSuggestion">
      <div class="suggestionImg">
        <img src="https://ak1.picdn.net/shutterstock/videos/22446301/thumb/1.jpg">
        <div class="infoContainer">
        <span class="suggestionInfo">Video Suggestion 2 Title and Info</span>
        </div>
      </div>
    </div>
    <div class="channelSuggestion">
      <div class="suggestionImg">
        <img src="https://ak1.picdn.net/shutterstock/videos/22446301/thumb/1.jpg">
        <div class="infoContainer">
        <span class="suggestionInfo">Video Suggestion 3 Title and Info</span>
        </div>
      </div>
      <div class="moreSuggestions">
        <button class="more">More Videos></button>
      </div>
    </div>
  `;
}

function playInLightBox() {
  $(document).on('click', '.thumbnail', function() {
    let currentVid = $(this).find('img').attr('name');
    $('.js-modal').addClass('show');
    closeModal();
    $('.modal-container').html(renderPlayer(currentVid));
  });
} 

function closeModal() {
  $(document).on('click', '.modal-close', function() {
  $('iframe').attr('src', ' ');
  $('.js-modal').removeClass('show');
  $('body').removeClass('tint');
  });
}

function displaySearchData(data) {
  const results = data.items.map((item, index) => renderResult(item));
    nextToken = `${data.nextPageToken}`;
    prevToken = `${data.prevPageToken}`;
  $('.js-search-results').html(results);
  $('.js-controls').addClass('show');
  $('.resultHeader').addClass('show');
  watchNext();
  watchPrevious();
}

function getDataFromApi(searchTerm, callback) {
  let query = {
    q: `${searchTerm}`,
    part: 'snippet',
    key: 'AIzaSyCuHHZWRF_QJHzwFZsALdOepEvVrhyT1gg',
    maxResults: 6
  }
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
} 


function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    currentQuery = query;
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, displaySearchData);
    playInLightBox();
  });
}

// Next Button Functionality

function getNextFromApi(token, callback) {
  let query = {
    q: `${currentQuery}`,
    part: 'snippet',
    key: 'AIzaSyCuHHZWRF_QJHzwFZsALdOepEvVrhyT1gg',
    maxResults: 6,
    pageToken: `${token}`
  }
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
} 

function watchNext () {
  $('.js-next').on('click', function() {
    let tokenNext = nextToken;
    getNextFromApi(tokenNext, displaySearchData);
    console.log(currentQuery);
  });
}

// Previous Button Functionality

function getPrevFromApi(token, callback) {
  let query = {
    q: `${currentQuery}`,
    part: 'snippet',
    key: 'AIzaSyCuHHZWRF_QJHzwFZsALdOepEvVrhyT1gg',
    maxResults: 6,
    pageToken: `${token}`
  }
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
} 

function watchPrevious () {
  $('.js-previous').on('click', function() {
    let tokenPrev = prevToken;
    console.log(tokenPrev);
    getNextFromApi(tokenPrev, displaySearchData);
    console.log(currentQuery);
  });
}

$(watchSubmit);