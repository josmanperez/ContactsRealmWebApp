$(document).ready(function () {

  // Datatable setup
  $('#contactTable').DataTable({
    paging: false,
    info: true,
    searching: false,
    ajax: {
      url: 'http://localhost:5000/contacts',
      dataSrc: ''
    },
    columns: [
      { data: 'firstName' },
      { data: 'lastName' }
    ]
  });

  // Add contact 
  $("#saveContact").on('click', function () {
    alert("click");
  })
});