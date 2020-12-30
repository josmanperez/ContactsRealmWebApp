const socket = io("http://localhost:5000");
socket.on("contact", (arg) => {
  console.log(arg);
  if (arg == "new contact created" || "contact updated" || "contact deleted") {
    // Reload the table 
    loadDataTable();
  }
});