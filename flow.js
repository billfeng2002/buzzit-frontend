
//listeners
function createEventListeners(){
    document.querySelector("#room-options").addEventListener("click", ()=>{processMainPageClick()})
    console.log("event listener added")
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
//setInterval(processLoop, 1000)
processLoop()
createEventListeners()
console.log(testing)
