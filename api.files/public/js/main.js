$(document).ready(function () {
  var table = showContactTable(table);

  $('#contactTable tbody').on('click', 'tr', function () {
    var firstName = table.row(this).data().firstName;
    var lastName = table.row(this).data().lastName;
    $('#formControlUpdate1').val(firstName);
    $('#formControlUpdate2').val(lastName);
    $('#updateContact').modal('show');

  });
});

function loadDataTable() {
  $('#contactTable').DataTable().ajax.reload();
}

function showContactTable() {
  // Datatable setup
  return $('#contactTable').DataTable({
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
}

function saveContact() {
  var firstName = $('#formControlInput1').val()
  var lastName = $('#formControlInput2').val()
  if (firstName === '' || lastName === '') {
    alert('First Name and Last Name are mandatory');
  } else {
    var data = {'firstName' : firstName, 'lastName': lastName};
    $.ajax({
      type: "post",
      url: 'http://localhost:5000/contacts',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (msg) {
        console.log(`The user has been created. ${msg}`);
        $('#addContact').modal('hide');
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
        $('#addContact').modal('hide');
      }
    });
  }
}

function updateContact() {
  var firstName = $('#formControlUpdate1').val()
  var lastName = $('#formControlUpdate2').val()
  if (firstName === '' || lastName === '') {
    alert('First Name and Last Name are mandatory');
  } else {
  }
}