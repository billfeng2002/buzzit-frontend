function reset() {
    userId = 0
    roomId = 0
    roomCode = ""
    appLocation = "main-page"
    loadedView = false
    roomStatus = ""
    currentQuestion = {}
    isOwner = false
}

function processMainPageClick(e) {
    console.log("process triggered")

    if (e.target.matches("#join-room-button")) {
        appLocation = "join-room-page"
        loadedView = false
        isOwner = false
        joinRoomView()
    } else if (e.target.matches("#create-new-room-button")) {
        appLocation = "new-room-page"
        loadedView = false
        isOwner = true
        newRoomView()
    }
}

function processNewOrJoinRoomSubmit(e) {
    e.preventDefault()
    if (isOwner) {
        e.target.querySelector("#room-code-input").readOnly = true;
        e.target.querySelector('#room-code-submit').value = "Searching";
        e.target.querySelector('#room-code-submit').disabled = true;

        console.log("submitted")
        roomCode = e.target.querySelector("#room-code-input").value

        let fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify({ "room_code": roomCode })
        }
        fetch("http://127.0.0.1:3000/rooms", fetchOptions).then(r => r.json()).then(j => {
            if (j["message"] == "room created") {
                roomId = j["room_id"]
                newUserView()
            } else {
                e.target.querySelector("#room-code-input").readOnly = false;
                e.target.querySelector('#room-code-submit').value = "Continue";
                e.target.querySelector('#room-code-submit').disabled = false;
                alert("Room code already taken! Try again a different code.")
            }
        }).catch(() => {
            e.target.querySelector("#room-code-input").readOnly = false;
            e.target.querySelector('#room-code-submit').value = "Continue";
            e.target.querySelector('#room-code-submit').disabled = false;
            alert("Check your intenet connection and try again!")
        })

    } else {
        e.target.querySelector("#room-code-input").readOnly = true;
        e.target.querySelector('#room-code-submit').value = "Searching";
        e.target.querySelector('#room-code-submit').disabled = true;

        console.log("submitted")
        roomCode = e.target.querySelector("#room-code-input").value

        let fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify({ "room_code": roomCode })
        }
        fetch("http://127.0.0.1:3000/check_room_exists", fetchOptions).then(r => r.json()).then(j => {
            if (j["message"] == "found") {
                roomId = j["room_id"]
                newUserView()
            } else {
                e.target.querySelector("#room-code-input").readOnly = false;
                e.target.querySelector('#room-code-submit').value = "Continue";
                e.target.querySelector('#room-code-submit').disabled = false;
                alert("Room not found! Try again.")
            }
        }).catch(() => {
            e.target.querySelector("#room-code-input").readOnly = false;
            e.target.querySelector('#room-code-submit').value = "Continue";
            e.target.querySelector('#room-code-submit').disabled = false;
            alert("Check your intenet connection and try again!")
        })


    }
}

function processNewUserSubmit(e) {
    e.preventDefault()
    e.target.querySelector("#name-input").readOnly = true;
    e.target.querySelector('#name-submit').value = "Working...";
    e.target.querySelector('#name-submit').disabled = true;
    
    console.log("submitted")
    user_name = e.target.querySelector("#name-input").value
    if (isOwner) {
        let fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify({ "room_id": roomId, "name":user_name, "owner":true})
        }
        fetch("http://127.0.0.1:3000/users", fetchOptions).then(r => r.json()).then(j => {
            if (j["message"] == "user created") {
                userId = j["user_id"]
                userName=user_name
                ownerRoomView()
            } else {
                e.target.querySelector("#name-input").readOnly = false;
                e.target.querySelector('#name-submit').value = "Enter Room";
                e.target.querySelector('#name-submit').disabled = false;
                alert("Name is already taken! Try again a different name.")
            }
        }).catch(() => {
            e.target.querySelector("#name-input").readOnly = false;
            e.target.querySelector('#name-submit').value = "Enter Room";
            e.target.querySelector('#name-submit').disabled = false;
            alert("Check your intenet connection and try again!")
        })

    } else {
        let fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify({ "room_id": roomId, "name":user_name})
        }
        fetch("http://127.0.0.1:3000/users", fetchOptions).then(r => r.json()).then(j => {
            if (j["message"] == "user created") {
                userId = j["user_id"]
                userRoomView()
            } else {
                e.target.querySelector("#name-input").readOnly = false;
                e.target.querySelector('#name-submit').value = "Enter Room";
                e.target.querySelector('#name-submit').disabled = false;
                alert("Name is already taken! Try again a different name.")
            }
        }).catch(() => {
            e.target.querySelector("#name-input").readOnly = false;
            e.target.querySelector('#name-submit').value = "Enter Room";
            e.target.querySelector('#name-submit').disabled = false;
            alert("Check your intenet connection and try again!")
        })

    }
}

function processNewChatMessage(e) {

}

function newQuestion(questionInfo) {

}

function updateRoomTopic(newTopic) {

}


//listeners
function createEventListeners() {
    document.querySelector("#room-options").addEventListener("click", processMainPageClick)
    document.querySelector("#room-submission-form").addEventListener("submit", processNewOrJoinRoomSubmit)
    document.querySelector("#name-submission-form").addEventListener("submit", processNewUserSubmit)
    console.log("event listeners added")
}

function processLoop() {
    if (!loadedView) {
        if (appLocation == "main-page") {
            mainScreenView()
            console.log("loaded main page")
        } else if (appLocation == "new-room-page") {
            newRoomView()
            console.log("loaded new room page")
        } else if (appLocation == "join-room-page") {
            joinRoomView()
            console.log("join new room page loaded")
        } else if (appLocation == "new-user-page") {
            newUserView()
        } else if (appLocation == "user-room-view"){
            userRoomView()
        } else if (appLocation=="owner-room-view"){
            ownerRoomView()
        }
    }else{
        if(appLocation=="user-room-view"){

        } else if (appLocation=="owner-room-view"){

        }
    }


}
setInterval(processLoop, 1000)
processLoop()
createEventListeners()
