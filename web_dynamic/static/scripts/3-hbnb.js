$(document).ready(function () {
    const selectedAmenities = {};
    $('input[type="checkbox"]').change(function () {
      if ($(this).is(':checked')) {
        selectedAmenities[$(this).data('id')] = $(this).data('name');
      } else {
        delete selectedAmenities[$(this).data('id')];
      }
      $('.amenities h4').text(Object.values(selectedAmenities).join(', '));
    });
  
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });
  
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify({}),
      contentType: 'application/json',
      success: function (data) {
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
  });
  