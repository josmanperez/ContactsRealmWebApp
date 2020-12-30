$(document).ready(function () {
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
});