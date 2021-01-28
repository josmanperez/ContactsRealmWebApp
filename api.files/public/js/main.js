$(document).ready(function () {
  var table = showContactTable(table);

  $('#contactTable tbody').on('click', 'tr', function () {
    var firstName = table.row(this).data().firstName;
    var lastName = table.row(this).data().lastName;
    var id = table.row(this).data()._id;
    $('#formControlUpdate1').val(firstName);
    $('#formControlUpdate2').val(lastName);
    $("#contactId").val(id);
    $('#updateContact').modal('show');
  });
});

function deleteContact(id) {
  $.ajax({
    type: "delete",
    url: 'http://localhost:5000/contacts',
    contentType: 'application/json',
    data: JSON.stringify({ '_id': id }),
    beforeSend: function(xhr) {
      $('#loadingDelete').attr('hidden',false);
      $('#btnDeleteContact').attr('disabled', true);
    },
    success: function (msg) {
      console.log('The user has been sent to be deleted');
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);      
    },
    complete: function() {
      $('#loadingDelete').attr('hidden', true);
      $('#btnDeleteContact').attr('disabled', false);
      $('#updateContact').modal('hide');
    }
  });
}

function saveContact() {
  var firstName = $('#formControlInput1').val()
  var lastName = $('#formControlInput2').val()
  if (firstName === '' || lastName === '') {
    alert('First Name and Last Name are mandatory');
  } else {
    var data = { 'firstName': firstName, 'lastName': lastName };
    $.ajax({
      type: "post",
      url: 'http://localhost:5000/contacts',
      contentType: 'application/json',
      data: JSON.stringify(data),
      beforeSend: function() {
        $('#loadingAdd').attr('hidden', false);
        $('#btnSaveContact').attr('disabled', true);
      },
      success: function (msg) {
        console.log(`The user has been sent to be created. ${msg}`);
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.error(errorThrown);        
      },
      complete: function() {
        $('#addContact').modal('hide');
        $('#loadingAdd').attr('hidden', true);
        $('#btnSaveContact').attr('disabled', false);
        $('#formControlInput1').val('');
        $('#formControlInput2').val('');
      }
    });
  }
}

function updateContact() {
  console.log("update");
  var firstName = $('#formControlUpdate1').val()
  var lastName = $('#formControlUpdate2').val()
  var id = $("#contactId").val()
  if (firstName === '' || lastName === '') {
    alert('First Name and Last Name are mandatory');
  } else {
    var data = { '_id': id, 'firstName': firstName, 'lastName': lastName };
    $.ajax({
      type: "put",
      url: 'http://localhost:5000/contacts',
      contentType: 'application/json',
      data: JSON.stringify(data),
      beforeSend: function() {
        $('#btnUpdateContact').attr('disabled', true);
        $('#loadingUpdate').attr('hidden', false);
      },
      success: function (msg) {
        console.log('The user has been updated.');
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.error(errorThrown);
      },
      complete: function() {
        $('#updateContact').modal('hide');
        $('#loadingUpdate').attr('hidden', true);
        $('#btnUpdateContact').attr('disabled', false);
      }
    });
  }
}

function loadDataTable() {
  $('#contactTable').DataTable().ajax.reload();
}

function showContactTable() {
  // Datatable setup
  return $('#contactTable').DataTable({
    paging: false,
    info: true,
    searching: true,
    order: [[1, "asc"]],
    ajax: {
      url: 'http://localhost:5000/contacts',
      dataSrc: ''
    },
    columns: [
      {
        data: '_id',
        visible: false
      },
      { data: 'firstName' },
      { data: 'lastName' }
    ]
  });
}

function logIn() {
  console.log("login");
  var email = $('#formLogInEmail').val()
  var pass = $('#formLogInPass').val()
  var data = { 'email': email, 'pass': pass };
  $.ajax({
    type: "post",
    url: "http://localhost:5000/users/signin",
    contentType: 'application/json',
    data: JSON.stringify(data),
    beforeSend: function () {
      $('#btnLogIn').attr('disabled', true);
      $('#loadingLogin').attr('hidden', false);
    },
    success: function (msg) {
      console.log(msg);
      $('#username').html(email);
      $('#username').attr('hidden', false);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.error(errorThrown);
    },
    complete: function () {
      $('#loadingLogin').attr('hidden', true);
      $('#btnLogIn').attr('disabled', false);
      $('#signIn').modal('hide');
    }
  });
}

function logOut() {
  $.ajax({
    type: "post",
    url: "http://localhost:5000/users/logout",
    beforeSend: function () {
      $('#btnLogout').attr('disabled', true);
      $('#loadingLogout').attr('hidden', false);
    },
    success: function (msg) {
      console.log(msg);
      $('#username').html('');
      $('#username').attr('hidden', true);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.error(errorThrown);
    },
    complete: function () {
      $('#loadingLogout').attr('hidden', true);
      $('#btnLogout').attr('disabled', false);
      $('#logout').modal('hide');
    }
  });
}