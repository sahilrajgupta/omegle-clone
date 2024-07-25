"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
let GLOBAL_ROOM_ID = 1;
class RoomManager {
    constructor() {
        this.rooms = new Map;
    }
    createRoom(usr1, usr2) {
        console.log("createRoom");
        const roomId = this.generate().toString();
        this.rooms.set(roomId.toString(), { usr1,
            usr2 });
        usr1.socket.emit("send-offer", {
            roomId
        });
    }
    onOffer(roomId, sdp, senderSocketid) {
        console.log("onOffer");
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.usr1.socket.id === senderSocketid ? room.usr2 : room.usr1;
        console.log(`User is ${receivingUser}`);
        receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.emit("offer", {
            roomId,
            sdp
        });
    }
    onAnswer(roomId, sdp, senderSocketid) {
        console.log("onAnswer");
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.usr1.socket.id === senderSocketid ? room.usr2 : room.usr1;
        console.log(`User is ${receivingUser}`);
        receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.emit("answer", {
            roomId,
            sdp
        });
    }
    onIceCandidates(roomId, senderSocketid, candidate, type) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.usr1.socket.id === senderSocketid ? room.usr2 : room.usr1;
        receivingUser.socket.emit("add-ice-candidate", ({ candidate, type }));
    }
    generate() {
        return GLOBAL_ROOM_ID++;
    }
}
exports.RoomManager = RoomManager;
