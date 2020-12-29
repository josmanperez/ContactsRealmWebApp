$(document).ready(function () {
  $.get('http://localhost:5000/contacts', function(data, status) {
    console.log(data);
  })
});

