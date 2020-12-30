const socket = io("http://localhost:5000");
socket.on("contact", (arg) => {
  console.log(arg);
  if (arg == "new contact created") {
    // Reload the table 
    loadDataTable();
  }
});