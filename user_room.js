function getUserRoomInfo(){
    //need room status, topic, chat, question id

}

function displayQuestion(){
    //load display side

    //load options with id
}

function updateRoomBanner(){

}

function updateChat(){
    let messageBox=document.querySelector("#messages-box")
    fetch("http://localhost:3000/messages/"+roomId).then(r=>r.json()).then(j=>{
        if(!j["last_message_id"]){
            return; //no new messages
        }
        if(j["last_message_id"] > lastMessageId){
            let messages=j["messages"] //array of messages
            let totalNumMsg=messages.length
            for(let i=0;i<totalNumMsg;i++){
                let message=messages[i]
                if(message["id"]>lastMessageId){
                    let newNode=document.createElement('div')
                    newNode.classList.add("message")
                    newNode.innerHTML=`<span class="sender"> ${message["author"]}: </span> ${message["value"]}`
                    messageBox.append(newNode)
                }
            }
            lastMessageId=j["last_message_id"]
            var messageCont= document.getElementById("messages");
            messageCont.scrollTop = messageCont.scrollHeight;
        }
    })
}

function submitReponse(){

}