const socket = io("http://localhost:5000");

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "3000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

socket.on("add:contact", arg => {
  loadDataTable();
  toastr.success(`${arg.contact.firstName} ${arg.contact.lastName}`,arg.message);
});

socket.on("update:contact", arg => {
  loadDataTable();
  toastr.warning(`${arg.contact.firstName} ${arg.contact.lastName}`,arg.message);
});

socket.on("delete:contact", arg => {
  loadDataTable();
  toastr.error(arg.message);
});

socket.on("disconnect", (reason) => {
  console.error("Socked has been disconnected");
  if (reason === "io server disconnect") {
    socket.connect();
  }
});