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
        e.target.querySelector('#room-code-submit').value = "Working";
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
            body: JSON.stringify({ "room_id": roomId, "name": user_name, "owner": true })
        }
        fetch("http://127.0.0.1:3000/users", fetchOptions).then(r => r.json()).then(j => {
            if (j["message"] == "user created") {
                userId = j["user_id"]
                userName = user_name
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
            body: JSON.stringify({ "room_id": roomId, "name": user_name })
        }
        fetch("http://127.0.0.1:3000/users", fetchOptions).then(r => r.json()).then(j => {
            if (j["message"] == "user created") {
                userId = j["user_id"]
                userName = user_name
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
    let enterKeycode = 13
    if (e.keyCode == enterKeycode) {
        e.preventDefault()
        console.log(e.target.value)
        if (e.target.value == "") {
            return
        }
        data = { "room_id": roomId, "user_id": userId, "value": e.target.value }
        let fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify(data)
        }
        e.target.value = ""
        fetch("http://localhost:3000/messages", fetchOptions).then(r => r.json()).then(j => {
            if (j["message"] == "message sent") {
                updateChat()
            } else {
                alert("Message failed to send. Check your connection with the server.")
            }
        })
    }


}

function processNewResponse(e) {
    let target = e.target
    if (target.matches(".option-button")) {
        //get rid of all other options and disable button
        let optionsDisplay = document.querySelector("#options-display")
        let options = optionsDisplay.childNodes

        let numOptions = options.length
        for (let i = numOptions - 1; i >= 0; i--) {
            if (options[i] != target) {
                optionsDisplay.removeChild(options[i])
            }
        }
        target.disabled = true

        data = { "question_id": lastQuestionId, "user_id": userId, "option_id": target.dataset.id }
        let postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify(data)
        }

        fetch("http://localhost:3000/responses", postOptions).then(r => r.json()).then(j => {
            if (j["message"] == "response submitted") {
                console.log("response submitted!")
            } else {
                alert("response did not save")
            }

        })
    }
}

function processDeleteUser(e) {
    let target = e.target
    if (target.matches(".kick-member")) {
        let userId = target.dataset.id
        deleteOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Accept": 'application/json'
            }
        }
        fetch("http://localhost:3000/users/" + userId, deleteOptions).then(r => r.json()).then(j => {
            updateUserList()
            console.log("user deleted")
        }).catch(() => {
            alert("failed to delete user")
        })
    }
}

function processNewQuestion(e) {
    e.preventDefault()
    let questionVal = e.target.querySelector("#form-question-input").value
    let image = e.target.querySelector("#form-image-input").value
    let options = []
    let optionNodes = e.target.querySelectorAll(".option-row")
    let numOptions = optionNodes.length

    for (let i = 0; i < numOptions; i++) {
        let value = optionNodes[i].querySelector("input[type='text']").value
        let checked = optionNodes[i].querySelector("input[type='checkbox']").checked
        options.push({ "value": value, "is_correct": checked })
    }
    data = {
        "value": questionVal,
        "image_url": image,
        "room_id": roomId,
        "options": options
    }

    let postOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Accept": 'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch("http://localhost:3000/questions", postOptions).then(r => r.json()).then(j => {
        if (j["message"] == "success") {
            currentQuestion["id"] = j["question_id"]
            currentQuestion["value"] = questionVal
            currentQuestion["img"] = image
            currentQuestion["options"] = options
            roomStatus = "accepting"
            updateRoomSettings()
            resetNewQuestionForm()
            document.querySelector("#stop-accepting-responses").disabled = false
        } else {
            alert("question creation failed")
        }
    }).catch(() => {
        alert("question failed to save")
    })
}

function resetNewQuestionForm() {
    document.querySelector("#create-question-form").innerHTML = `<div id="question-label-and-input-container">
    <label id="form-question-label">Question</label>
    <textarea id="form-question-input" placeholder="How many people are there on Earth?"
        maxlength="80"></textarea>
</div>
<br>
<div id="image-label-and-input-container">
    <label id="form-image-label">Image url (optional)</label>
    <input id="form-image-input" type="text">
</div>
<br>

<table id="options-table">
    <label id="form-options-label">Options</label>
    <tr>
        <th>Option #</th>
        <th>Option Value</th>
        <th>is correct?</th>
    </tr>
    <tr class="option-row">
        <td>1</td>
        <td><input type="text"></td>
        <td><input type="checkbox"></td>
    </tr>
    <tr class="option-row">
        <td>2</td>
        <td><input type="text"></td>
        <td><input type="checkbox"></td>
    </tr>
    <tr class="option-row">
        <td>3</td>
        <td><input type="text"></td>
        <td><input type="checkbox"></td>
    </tr>
    <tr class="option-row">
        <td>4</td>
        <td><input type="text"></td>
        <td><input type="checkbox"></td>
    </tr>
</table>
<p id="table-options"> <span id="add-option">➕</span><span id="remove-option">➖</span> </p>
<div id="submit-container">
    <input id="submit-question-button" type="submit" value="Post Question">
</div>`
    document.querySelector("#table-options").addEventListener("click", processAddorRemoveOptions)

}

function processAddorRemoveOptions(e) {
    if (e.target.matches("#add-option")) {
        console.log("adding row")
        let table = document.querySelector("#options-table")
        let numOptions = table.querySelectorAll(".option-row").length
        if (numOptions >= 10) {
            return;
        }
        let newRow = document.createElement("tr")
        newRow.classList.add("option-row")
        newRow.innerHTML = `<td>${numOptions + 1}</td>
                            <td><input type="text"></td>
                            <td><input type="checkbox"></td>`

        table.append(newRow)
    }
    if (e.target.matches("#remove-option")) {
        let table = document.querySelector("#options-table")
        let options = table.querySelectorAll(".option-row")
        let numOptions = options.length
        if (numOptions > 0) {
            options[numOptions - 1].remove()
        }
    }
}

function processStartAwait(e) {
    e.target.disabled = true
    roomStatus = "awaiting"
    updateRoomSettings()
}

function processUpdateRoomTopic(e) {
    e.preventDefault()
    let newTopic = e.target.querySelector("#new-topic-input").value
    roomTopic = newTopic
    updateRoomSettings()
    updateRoomBanner()
    e.target.reset()
}

function processDeleteRoom(e) {
    deleteOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "Accept": 'application/json'
        }
    }
    fetch("http://localhost:3000/rooms/" + roomId, deleteOptions).then(r => r.json()).then(j => {
        alert("room deleted")
    }).catch(() => {
        alert("failed to delete room")
    })
}

//listeners
function createEventListeners() {
    document.querySelector("#room-options").addEventListener("click", processMainPageClick)
    document.querySelector("#room-submission-form").addEventListener("submit", processNewOrJoinRoomSubmit)
    document.querySelector("#name-submission-form").addEventListener("submit", processNewUserSubmit)
    document.querySelector("#message-content").addEventListener("keydown", processNewChatMessage)
    document.querySelector("#options-display").addEventListener("click", processNewResponse)
    document.querySelector("#members").addEventListener("click", processDeleteUser)
    document.querySelector("#create-question-form").addEventListener("submit", processNewQuestion)
    document.querySelector("#table-options").addEventListener("click", processAddorRemoveOptions)
    document.querySelector("#stop-accepting-responses").addEventListener("click", processStartAwait)
    document.querySelector("#update-room-topic").addEventListener("submit", processUpdateRoomTopic)
    document.querySelector("#delete-room-button").addEventListener("click", processDeleteRoom)
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
        } else if (appLocation == "user-room-view") {
            userRoomView()
        } else if (appLocation == "owner-room-view") {
            ownerRoomView()
        }
    }
}
setInterval(processLoop, 1000)
processLoop()
createEventListeners()
//ownerRoomView()
