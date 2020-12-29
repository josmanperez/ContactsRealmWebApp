$(document).ready(function () {
  $('#contactTable').DataTable({
    ajax: {
      url: 'http://localhost/test.json',
      dataSrc: ''
    },
    columns: [
      {
        data: '_id',
        visible: false
      },
      {
        data: '_partition',
        visible: false
      },
      { data: 'firstName' },
      { data: 'lastName' }
    ]
  });
});

