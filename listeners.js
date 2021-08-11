function processMainPageClick(e){
    console.log("process triggered")
    if(e.target.matches("join-room-button")){
        appLocation="join-room-page"
        loadedView=false
    }else if(e.target.matches("create-new-room-button")){
        appLocation="new-room-page"
        loadedView=false
    }
}
function processNewOrJoinRoomClick(e){

}
function processNewUserClick(e){

}
function processMainPageClick(e){

}
function processNewChatMessage(e){

}
