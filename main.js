const socket = io("https://peerjs-call-107766433db5.herokuapp.com", {
  transports: ["polling", "websocket"],
  withCredentials: true,
});

$("#div-user").hide();

socket.on("DANH_SACH_ONLINE", (arrUserInfo) => {
  $("#div-user").show();
  $("#div-signup").hide();
  arrUserInfo.forEach((user) => {
    const { name, peerId } = user;
    $("#ulUser").append(`<li id= "${peerId}">${name}</li>`);
  });
  socket.on("CO_NGUOI_DUNG_MOI", (user) => {
    const { name, peerId } = user;
    $("#ulUser").append(`<li id= "${peerId}">${name}</li>`);
  });

  socket.on("AI_DO_NGAT_KET_NOI", (peerId) => {
    $(`#${peerId}`).remove();
  });
});

socket.on("DANG_KY_THAT_BAI", () => alert("Name already exists"));

function openStream() {
  const config = { audio: false, video: true };
  return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTab, stream) {
  const video = document.getElementById(idVideoTab);
  video.srcObject = stream;
  video.play();
}

// openStream().then((stream) => playStream("localStream", stream));

const peer = new Peer({
  key: "peerjs",
  host: "peerjs-call-107766433db5.herokuapp.com",
  secure: true,
  port: 443,
});

peer.on("open", function (id) {
  $("#my-peer").append(id);
  $("#btnSignUp").click(() => {
    const username = $("#txtUsername").val();
    socket.emit("NGUOI_DUNG_DANG_KY", { name: username, peerId: id });
  });
});

$("#btnCall").click(() => {
  const id = $("#remoteId").val();
  openStream().then((stream) => {
    playStream("localStream", stream);
    call = peer.call(id, stream);
    call.on("stream", (remoteStream) =>
      playStream("remoteStream", remoteStream)
    );
  });
});

peer.on("call", (call) => {
  openStream().then((stream) => {
    call.answer(stream);
    playStream("localStream", stream);
    call.on("stream", (remoteStream) =>
      playStream("remoteStream", remoteStream)
    );
  });
});

$("#ulUser").on("click", "li", function () {
  const id = $(this).attr("id");
  openStream().then((stream) => {
    playStream("localStream", stream);
    call = peer.call(id, stream);
    call.on("stream", (remoteStream) =>
      playStream("remoteStream", remoteStream)
    );
  });
});
