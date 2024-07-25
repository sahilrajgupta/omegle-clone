"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const RoomManager_1 = require("./RoomManager");
let GLOBAL_ROOM_ID = 1;
class UserManager {
    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager_1.RoomManager;
    }
    addUser(name, socket) {
        console.log("adduser");
        this.users.push({
            name, socket
        });
        this.queue.push(socket.id);
        socket.emit("lobby");
        this.clearQueue();
        this.initHandlers(socket);
    }
    removeUser(socketId) {
        console.log("removeUser");
        const user = this.users.find(x => x.socket.id === socketId);
        this.users = this.users.filter(x => x.socket.id !== socketId);
        this.queue = this.queue.filter(x => x === socketId);
    }
    clearQueue() {
        if (this.queue.length < 2) {
            return;
        }
        console.log("clearQUeu3e");
        const id1 = this.queue.pop();
        const id2 = this.queue.pop();
        const usr1 = this.users.find(x => x.socket.id === id1);
        const usr2 = this.users.find(x => x.socket.id === id2);
        if (!usr1 || !usr2) {
            return;
        }
        console.log("Creating room");
        const room = this.roomManager.createRoom(usr1, usr2);
        this.clearQueue();
    }
    initHandlers(socket) {
        socket.on("offer", ({ sdp, roomId }) => {
            this.roomManager.onOffer(roomId, sdp, socket.id);
        });
        socket.on("answer", ({ sdp, roomId }) => {
            this.roomManager.onAnswer(roomId, sdp, socket.id);
        });
        socket.on("add-ice-candidate", ({ candidate, roomId, type }) => {
            this.roomManager.onIceCandidates(roomId, socket.id, candidate, type);
        });
    }
    generate() {
        return GLOBAL_ROOM_ID++;
    }
}
exports.UserManager = UserManager;
