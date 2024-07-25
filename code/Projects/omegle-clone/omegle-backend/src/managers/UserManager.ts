import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";

export interface User {
    socket: Socket
    name: String
}

let GLOBAL_ROOM_ID = 1

export class UserManager {
    private users: User[];

    private queue: string[];
    private roomManager: RoomManager;

    constructor() {
        this.users = []
        this.queue = []
        this.roomManager = new RoomManager
    }
    addUser(name: String, socket: Socket) {
        console.log("adduser")
        this.users.push({
            name, socket
        })
        this.queue.push(socket.id)
        socket.emit("lobby")
        this.clearQueue()
        this.initHandlers(socket);
    }
    removeUser(socketId: String) {
        console.log("removeUser")
        const user = this.users.find(x=>x.socket.id===socketId)

        this.users = this.users.filter(x => x.socket.id !== socketId)
        this.queue = this.queue.filter(x => x === socketId)
    }

    clearQueue() {
        
        if (this.queue.length < 2) {
            return;
        }
        console.log("clearQUeu3e")
        const id1 = this.queue.pop()
        const id2 = this.queue.pop()
        const usr1 = this.users.find(x => x.socket.id === id1)
        const usr2 = this.users.find(x => x.socket.id === id2)
        if (!usr1||!usr2) {
            return
        }
        console.log("Creating room")
        const room = this.roomManager.createRoom(usr1, usr2)
        this.clearQueue()

    }

    initHandlers(socket:Socket){
        socket.on("offer",({sdp,roomId}:{sdp:string,roomId:string})=>{
            this.roomManager.onOffer(roomId,sdp,socket.id);
        })
        socket.on("answer",({sdp,roomId}:{sdp:string,roomId:string})=>{
            this.roomManager.onAnswer(roomId,sdp,socket.id);
        })
        socket.on("add-ice-candidate", ({candidate, roomId, type}) => {
            this.roomManager.onIceCandidates(roomId, socket.id, candidate, type);
        });
    }


    generate() {
        return GLOBAL_ROOM_ID++;
    }


}