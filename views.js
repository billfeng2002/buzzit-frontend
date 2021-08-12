function hideAllUIExcept(divId) {
    document.querySelector("#room-options").style.visibility = "hidden"
    document.querySelector("#create-join-room").style.visibility = "hidden"
    document.querySelector("#user-create-box").style.visibility = "hidden"
    document.querySelector("#room-view").style.visibility = "hidden"
    document.querySelector(`#${divId}`).style.visibility = "visible"
}

function mainScreenView() {
    hideAllUIExcept("room-options")
    appLocation='main-page'
    loadedView = true
}

function joinRoomView() {
    hideAllUIExcept("create-join-room")
    appLocation='join-room-page'
    document.querySelector("#create-join-room h1").textContent = "Enter Room Code:"
    loadedView = true
}

function newRoomView() {
    hideAllUIExcept("create-join-room")
    appLocation='new-room-page'
    document.querySelector("#create-join-room h1").textContent = "Enter New Room Code:"
    loadedView = true
}

function newUserView() {
    hideAllUIExcept("user-create-box")
    appLocation='new-user-page'
    loadedView = true
}

function userRoomView() {
    hideAllUIExcept("room-view")
    document.querySelector("#question-view").style.visibility="visible"
    document.querySelector("#room-owner-view").style.visibility="hidden"
    getAndUseUserRoomInfo()
    //setInterval(updateChat,500)
    updateChat()
}

function ownerRoomView() {
    hideAllUIExcept("room-view")
    document.querySelector("#question-view").style.visibility="hidden"
    document.querySelector("#room-owner-view").style.visibility="visible"
    //setInterval(updateChat,500)
    updateChat()
}