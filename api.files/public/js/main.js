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

  // $("#btnSaveContact").click(function() {
  //   alert($("#formControlInput1").value);

  // });
});

function saveContact() {
  var firstName = $('#formControlInput1').val()
  var lastNAme = $('#formControlInput2').val() 
  if (firstName === '' || lastNAme === '') {
    alert('First Name and Last Name are mandatory');
  } else {
    $.$.post("url", data,
      function (data, textStatus, jqXHR) {
        
      },
      "dataType"
    );
  }
}