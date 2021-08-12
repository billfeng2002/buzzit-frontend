function getAndUseUserRoomInfo() {
    //need room status, topic, question id
    fetch("http://localhost:3000/user_room_info/" + roomId).then(r => r.json()).then(j => {

        if (roomTopic != j["room_topic"]) {
            roomTopic = j["room_topic"]
            updateRoomBanner()
        }

        currentQuestion["id"] = j["current_question_id"]
        roomStatus = j["room_status"]

        if (room_status == "awaiting") {
            defaultView()
        } else if (room_status == "accepting") {
            displayQuestion()
        }
    })
}

function displayQuestion() {
    if (submitted) {

    } else {
        if(lastQuestionId!=currentQuestion["id"]){
            //load display side

            //load options with id
            createOptions()
            submitted = false
        }
    }
}

function createOptionsButtons(options) {

}

function defaultView(){

}

function updateRoomBanner() {
    document.querySelector("#displayed-code").textContent = roomCode
    document.querySelector("#room-topic-display").textContent = roomTopic
    document.querySelector("#name-display").textContent = roomTopic
}

function updateChat() {
    let messageBox = document.querySelector("#messages-box")
    fetch("http://localhost:3000/messages/" + roomId).then(r => r.json()).then(j => {
        if (!j["last_message_id"]) {
            return; //no new messages
        }
        if (j["last_message_id"] > lastMessageId) {
            let messages = j["messages"] //array of messages
            let totalNumMsg = messages.length
            for (let i = 0; i < totalNumMsg; i++) {
                let message = messages[i]
                if (message["id"] > lastMessageId) {
                    let newNode = document.createElement('div')
                    newNode.classList.add("message")
                    newNode.innerHTML = `<span class="sender"> ${message["author"]}: </span> ${message["value"]}`
                    messageBox.append(newNode)
                }
            }
            lastMessageId = j["last_message_id"]
            var messageCont = document.getElementById("messages");
            messageCont.scrollTop = messageCont.scrollHeight;
        }
    })
}

function submitReponse() {

}