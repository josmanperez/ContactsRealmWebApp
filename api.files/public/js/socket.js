const socket = io("http://localhost:5000");
socket.on("hello", (arg) => {
  alert(arg);
  console.log(arg); // world
});