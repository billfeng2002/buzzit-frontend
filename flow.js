let userId=0
let roomId=0
let appLocation="room-select"
let roomStatus=""
let currentQuestion={}
let isOwner=false


function hideAllUIExcept(divId){
    document.querySelector("#room-options").style.visibility="hidden"
    document.querySelector("#create-join-room").style.visibility="hidden"
    document.querySelector("#user-create-box").style.visibility="hidden"
    document.querySelector("#room-view").style.visibility="hidden"
    document.querySelector(`#${divId}`).style.visibility="visible"
}

function joinRoomView(){

}

function processLoop(){
    if(appLocation=="room-select"){

    }else if(appLocation==""){

    }
}