import { User } from "./UserManager";

let GLOBAL_ROOM_ID = 1

interface Room{
    usr1: User,
    usr2: User,
}

export class RoomManager{
    private rooms: Map<String, Room>
    constructor(){
        this.rooms = new Map<String, Room>
    }
    createRoom(usr1: User, usr2:User ){
        console.log("createRoom")
        const roomId = this.generate().toString()
        this.rooms.set(roomId.toString(), 
            {usr1,
            usr2}
        )

        usr1.socket.emit("send-offer",{
            roomId
        })
    }

    onOffer(roomId:string, sdp:string, senderSocketid:string){
        console.log("onOffer")
        const room = this.rooms.get(roomId)
        if(!room){
            return;
        }
        const receivingUser = room.usr1.socket.id === senderSocketid ? room.usr2 : room.usr1

        console.log(`User is ${receivingUser}`)
        receivingUser?.socket.emit("offer",{
            roomId,
            sdp
        })
    }
    onAnswer(roomId:string,sdp:string,senderSocketid:string){
        console.log("onAnswer")

        const room = this.rooms.get(roomId)
        if(!room){
            return;
        }
        const receivingUser = room.usr1.socket.id === senderSocketid ? room.usr2 : room.usr1

        console.log(`User is ${receivingUser}`)
        receivingUser?.socket.emit("answer",{
            roomId,
            sdp
        })
    }   

    onIceCandidates(roomId: string, senderSocketid: string, candidate: any, type: "sender" | "receiver") {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.usr1.socket.id === senderSocketid ? room.usr2: room.usr1;
        receivingUser.socket.emit("add-ice-candidate", ({candidate, type}));
    }

    generate(){
        return GLOBAL_ROOM_ID++
    }
}