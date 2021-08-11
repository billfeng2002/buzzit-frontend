let userId = 0
let roomId = 0
let roomCode=""
let appLocation = "main-page"
let loadedView = false
let roomStatus = ""
let currentQuestion = {}
let isOwner = false

function processMainPageClick(e){
    console.log("process triggered")
    
    if(e.target.matches("#join-room-button")){
        appLocation="join-room-page"
        loadedView=false
        isOwner=false
        joinRoomView()
    }else if(e.target.matches("#create-new-room-button")){
        appLocation="new-room-page"
        loadedView=false
        isOwner=true
        newRoomView()
    }
}
function processNewOrJoinRoomSubmit(e){
    e.preventDefault()
    if(isOwner){
        
    }else{
        let processing=0
        if(processing==0){
            processing=1
            console.log("submitted")
            roomCode=e.target.querySelector("#room-code-input").value
            
            let fetchOptions={
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": 'application/json'
                },
                body: JSON.stringify({"room_code": roomCode})
            }
            fetch("http://127.0.0.1:3000/check_room_exists", fetchOptions).then(r=> r.json()).then(j=>{
                if(j["message"]=="found"){
                    roomId=j["room_id"]
                    newUserView()
                }else{
                    processing=0
                    alert("Room not found! Try again.")
                }
            }).catch(()=>{
                alert("Check your intenet connection and try again!")
            })

        }
    }
}
function processNewUserClick(e){

}

function processNewChatMessage(e){

}

function newQuestion(questionInfo){

}

function updateRoomTopic(newTopic){

}


//listeners
function createEventListeners(){
    document.querySelector("#room-options").addEventListener("click", processMainPageClick)
    document.querySelector("#room-submission-form").addEventListener("submit", processNewOrJoinRoomSubmit)
    console.log("event listeners added")
}

function hideAllUIExcept(divId) {
    document.querySelector("#room-options").style.visibility = "hidden"
    document.querySelector("#create-join-room").style.visibility = "hidden"
    document.querySelector("#user-create-box").style.visibility = "hidden"
    document.querySelector("#room-view").style.visibility = "hidden"
    document.querySelector(`#${divId}`).style.visibility = "visible"
}

function mainScreenView() {
    hideAllUIExcept("room-options")
    loadedView = true
}

function joinRoomView() {
    hideAllUIExcept("create-join-room")
    document.querySelector("#create-join-room h1").textContent = "Enter Room Code:"
    loadedView = true
}

function newRoomView() {
    hideAllUIExcept("create-join-room")
    document.querySelector("#create-join-room h1").textContent = "Enter New Room Code:"
    loadedView = true
}

function newUserView(){
    hideAllUIExcept("user-create-box")
    loadedView = true
}

function userRoomView(){
    hideAllUIExcept()
}

function ownerRoomView(){

}


function processLoop() {
    if (!loadedView) {
        if (appLocation == "main-page") {
            mainScreenView()
            console.log("loaded main page")
        } else if (appLocation == "new-room-page") {
            newRoomView()
            console.log("loaded new room page")
        }else if (appLocation=="join-room-page"){
            joinRoomView()
            console.log("join new room page loaded")
        }else if (appLocation=="new-user-page"){

        }
    }
}
setInterval(processLoop, 1000)
processLoop()
createEventListeners()
