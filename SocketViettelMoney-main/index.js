const express = require("express");
const cors = require("cors");
const app = express();
const _findIndex = require("lodash/findIndex"); // npm install lodash --save
const { default: axios } = require("axios");
const server = require("http").Server(app);
const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 6969;
const io = require("socket.io")(server);

const apiChatBot = "http://124.158.5.212:31001/api/chatbox/human";

app.use(cors());

server.listen(port, () => console.log("Server running in port " + port));

const sendMessageToBot = async (message) => {
  const res = await axios.post(
    apiChatBot,
    {
      user_id_source: message?.userIdFrom,
      user_id_destination: message?.userIdTo,
      room_id: 1,
      message: message?.message,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (res?.data?.status === 200) {
    console.log(res?.data?.data?.message);
    if (res?.data?.data?.message?.intent !== "None") {
      const getUser =
        res?.data?.data?.message?.intent === "want_to_transfer"
          ? message?.userIdFrom
          : message?.userIdTo;

      io.sockets.emit(`newMessage${getUser}`, {
        userIdFrom: "BOT",
        userIdTo: getUser,
        message: {
          type: "text",
          value: res?.data?.data?.message?.message,
        },
      });
    }
  }
};

const userOnline = []; //danh sách user dang online
io.on("connection", function (socket) {
  console.log(socket.id + ": connected");
  //lắng nghe khi người dùng thoát
  socket.on("disconnect", function () {
    console.log(socket.id + ": disconnected");
    $index = _findIndex(userOnline, ["id", socket.id]);
    userOnline.splice($index, 1);
    io.sockets.emit("updateUesrList", userOnline);
  });
  //lắng nghe khi có người gửi tin nhắn
  socket.on("newMessage", (data) => {
    //gửi lại tin nhắn cho người dùng gửi lên
    io.sockets.emit(`newMessage${data?.userIdTo}`, data);
    sendMessageToBot(data);
  });
  //lắng nghe khi có người login
  socket.on("login", (data) => {
    // kiểm tra xem tên đã tồn tại hay chưa
    if (userOnline.indexOf(data) >= 0) {
      socket.emit("loginFail"); //nếu tồn tại rồi thì gửi socket fail
    } else {
      // nếu chưa tồn tại thì gửi socket login thành công
      socket.emit("loginSuccess", data);
      userOnline.push({
        id: socket.id,
        name: data,
      });
      io.sockets.emit("updateUesrList", userOnline); // gửi danh sách user dang online
    }
  });
});

app.get("/", (req, res) => {
  res.send("Home page. Server running okay.");
});
