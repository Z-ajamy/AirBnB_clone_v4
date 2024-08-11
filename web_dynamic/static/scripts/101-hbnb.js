$(document).ready(function () {
    const selectedAmenities = {};
    const selectedStates = {};
    const selectedCities = {};
  
    $('input[type="checkbox"]').change(function () {
      const category = $(this).closest('div').attr('class');
      const id = $(this).data('id');
      const name = $(this).data('name');
  
      if ($(this).is(':checked')) {
        if (category === 'amenities') {
          selectedAmenities[id] = name;
        } else if (category === 'locations') {
          if ($(this).parent().parent().attr('class') === 'locations') {
            selectedStates[id] = name;
          } else {
            selectedCities[id] = name;
          }
        }
      } else {
        if (category === 'amenities') {
          delete selectedAmenities[id];
        } else if (category === 'locations') {
          if ($(this).parent().parent().attr('class') === 'locations') {
            delete selectedStates[id];
          } else {
            delete selectedCities[id];
          }
        }
      }
  
      updateFiltersText();
    });
  
    function updateFiltersText() {
      const amenitiesText = Object.values(selectedAmenities).join(', ');
      const locationsText = [...Object.values(selectedStates), ...Object.values(selectedCities)].join(', ');
  
      $('.amenities h4').text(amenitiesText);
      $('.locations h4').text(locationsText);
    }
  
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });
  
    function fetchPlaces (amenityIds = [], stateIds = [], cityIds = []) {
      $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        type: 'POST',
        data: JSON.stringify({ amenities: amenityIds, states: stateIds, cities: cityIds }),
        contentType: 'application/json',
        success: function (data) {
          $('.places .container').empty();
          for (const place of data) {
            const article = $('<article>');
            const titleBox = $('<div>').addClass('title_box');
            const title = $('<h2>').text(place.name);
            const price = $('<div>').addClass('price_by_night').text(`$${place.price_by_night}`);
            titleBox.append(title, price);
  
            const information = $('<div>').addClass('information');
            const maxGuest = $('<div>').addClass('max_guest').text(`${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}`);
            const numberRooms = $('<div>').addClass('number_rooms').text(`${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}`);
            const numberBathrooms = $('<div>').addClass('number_bathrooms').text(`${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}`);
            information.append(maxGuest, numberRooms, numberBathrooms);
  
            const description = $('<div>').addClass('description').html(place.description);
  
            article.append(titleBox, information, description);
            $('.places .container').append(article);
          }
        }
      });
    }
  
    function fetchReviews() {
      $.get('http://0.0.0.0:5001/api/v1/reviews/', function (data) {
        $('.reviews-container').empty();
        for (const review of data) {
          const reviewDiv = $('<div>').addClass('review');
          const reviewer = $('<h3>').text(review.name);
          const content = $('<p>').text(review.text);
          reviewDiv.append(reviewer, content);
          $('.reviews-container').append(reviewDiv);
        }
      });
    }
  
    $('button').click(function () {
      fetchPlaces(Object.keys(selectedAmenities), Object.keys(selectedStates), Object.keys(selectedCities));
    });
  
    $('#toggle_reviews').click(function () {
      const state = $(this).data('state');
      if (state === 'show') {
        fetchReviews();
        $(this).text('hide');
        $(this).data('state', 'hide');
      } else {
        $('.reviews-container').empty();
        $(this).text('show');
        $(this).data('state', 'show');
      }
    });
  });
  