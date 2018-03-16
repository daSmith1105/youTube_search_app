const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
let nextToken = '';
let prevToken = '';
let currentQuery = '';

// Rendering to DOM

function renderResult(result) {
  $('#ariaResults').prop('hidden', false);
  let vid = `${result.id.videoId}`;
  console.log(vid);
  return `
    <div class="thumbnail js-thumbnail">
      <a href="#">
      <img src=${result.snippet.thumbnails.medium.url} name=${vid} alt=${result.snippet.title}>
      <p>${result.snippet.title}</p>
      </a>
    </div>
  `;
}

function renderPlayer(vId) {
  return `
    <iframe src="https://www.youtube.com/embed/${vId}?autoplay=1" frameborder="0" aria-label="featured video" allowfullscreen></iframe>
    <div class="channelSuggestionContainer">
      <p class="channelText">More from this Channel</p>
            <div class="moreSuggestions">
              <button class="more button">Search More Videos</button>
            </div>
          </div>`;
}

function playInLightBox() {
  $(document).on('click', '.thumbnail', function() {
    let currentVid = $(this).find('img').attr('name');
    $('.js-search-results').addClass('hide');
    $('.js-controls').removeClass('show');
    $('.js-modal').addClass('show');
    closeModal();
    $('.modal-container').html(renderPlayer(currentVid));
    $('.js-controls').addClass('show');
  });
} 

function closeModal() {
  $(document).on('click', '.modal-close', function() {
  $('iframe').attr('src', ' ');
  $('.js-modal').removeClass('show');
  $('body').removeClass('tint');
  $('.js-search-results').removeClass('hide');
  });
}

function displaySearchData(data) {
  const results = data.items.map((item, index) => renderResult(item));
    nextToken = `${data.nextPageToken}`;
    prevToken = `${data.prevPageToken}`;
  $('.js-search-results').html(results);
  $('#ariaResults').prop('hidden', false);
  $('.input').blur();
  $(document).find('.thumbnail:first').focus();
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
  $('.input').focus();
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
    $('#ariaResults').prop('hidden', true);
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
    $('#ariaResults').prop('hidden', true);
    let tokenPrev = prevToken;
    console.log(tokenPrev);
    getNextFromApi(tokenPrev, displaySearchData);
    console.log(currentQuery);
  });
}

$(watchSubmit);