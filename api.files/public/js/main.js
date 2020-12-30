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