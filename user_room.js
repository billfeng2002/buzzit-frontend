function getAndUseUserRoomInfo() {
    //need room status, topic, question id
    fetch("http://localhost:3000/user_room_info/" + roomId).then(r => r.json()).then(j => {

        if(j["status"]=="closed room"){
            location.reload()
            return false
        }
        if(!j["users"].includes(userId)){
            location.reload()
            return false
        }
        if (roomTopic != j["room_topic"]) {
            roomTopic = j["room_topic"]
            updateRoomBanner()
        }

        currentQuestion["id"] = j["current_question_id"]
        roomStatus = j["room_status"]

        if (roomStatus == "awaiting") {
            defaultView()
        } else if (roomStatus == "accepting") {
            displayQuestion()
        }
    })
}

function displayQuestion() {
    if(!currentQuestion["id"]){
        defaultView()
        console.log("bad question, default view")
        return
    }
    if (lastQuestionId != currentQuestion["id"]) {
        
        fetch("http://localhost:3000/questions/"+currentQuestion["id"]).then(r=>r.json()).then(j=>{
            if(j["img"]){
                currentQuestion["img"]=j["img"]
                document.querySelector("#question-image").style.display="flex"
            }else{
                currentQuestion["img"]=""
                document.querySelector("#question-image").style.display="none"
            }
            currentQuestion["value"]=j["value"]
            currentQuestion["options"]=j["options"]

            document.querySelector("#question-image-tag").src = currentQuestion["img"]
            document.querySelector("#question-value").textContent = currentQuestion["value"]
            createOptionsButtons()

            lastQuestionId = currentQuestion["id"]
            console.log("done displaying question")
        })
        
    }
}

function createOptionsButtons() {
    let options=currentQuestion["options"]
    let numOptions=options.length
    let optionsDisplay=document.querySelector("#options-display")
    optionsDisplay.innerHTML=""
    if(numOptions==0){
        console.log("no options")
        return
    }
    let maxHeight=optionsDisplay.clientHeight
    let eachOptionHeight=maxHeight*0.8/numOptions
    for(let i=0;i<numOptions;i++){
        let newButton=document.createElement("button")
        newButton.classList.add("option-button")
        newButton.dataset.id=options[i]["id"]
        newButton.textContent=options[i]["value"]
        newButton.style.height=eachOptionHeight+"px"
        optionsDisplay.append(newButton)
    }
    console.log("options created!!")
}

function defaultView() {
    document.querySelector("#question-image-tag").src = ""
    document.querySelector("#question-image").style.display="none"
    document.querySelector("#question-value").textContent = "Awaiting owner to send a question..."
    document.querySelector("#options-display").innerHTML = ""
}

function updateRoomBanner() {
    document.querySelector("#displayed-code").textContent = roomCode
    document.querySelector("#room-topic-display").textContent = roomTopic
    document.querySelector("#name-display").textContent = userName
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