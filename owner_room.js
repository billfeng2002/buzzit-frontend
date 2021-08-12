function getAndUseOwnerRoomInfo() {
    fetch(backend_path+"owner_room_info/" + roomId).then(r => r.json()).then(j => {

        if(j["status"]=="closed room"){
            location.reload()
            return false
        }
        if(!j["users"].includes(userId)){
            debugger
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
            document.querySelector("#stop-accepting-responses").disabled=true
        } else if (roomStatus == "accepting") {
            document.querySelector("#stop-accepting-responses").disabled=false
        }
    })
}

function updateUserList(){
    fetch(backend_path+"member_list/"+roomId).then(r=>r.json()).then(j=>{ //don't include owner
        let memberCount=j["count"]
        if(!memberCount){
            memberCount=0
        }
        let members=j["members"] //{score: , name:, id:}
        let memberDisplay=document.querySelector("#members")
        memberDisplay.innerHTML=`<p id="member-count-display">${memberCount} Users</p>`
        for(let i=0;i<memberCount;i++){
            let member=members[i]
            let newUserObj=document.createElement("div")
            newUserObj.classList.add("member")
            newUserObj.innerHTML=`${member["score"]} -<span class="kick-member" data-id=${member["id"]}>❌</span> ${member["name"]}`
            memberDisplay.append(newUserObj)
        }

    })
}

function updateRoomSettings() {
    data = {
        "current_question_id": currentQuestion["id"],
        "topic": roomTopic,
        "status": roomStatus
    }
    let patchOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            "Accept": 'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch(backend_path+"rooms/" + roomId, patchOptions).then(r => r.json()).then(j => {

    }).catch(() => {
        alert("room update failed")
    })
}

function updateQuestionResults(){
    fetch(backend_path+"question_stats/"+roomId).then(r=>r.json()).then(j=>{
        if(j["error"]){

        }else{
            let options=j["options"]
            let numOptions=options.length
            document.querySelector("#question-display-1").textContent=j["value"]
            document.querySelector("#question-stats-question-label").textContent=j["value"]
            document.querySelector("#num-responded").textContent=j["num_responded"]
            document.querySelector("#percent-correct").textContent=j["percent_correct"]
            document.querySelector("#percent-responded").textContent=j["percent_responded"]
            let optionsDistributionDisplay=document.querySelector("#option-distribution")
            let optionsContainer=document.querySelector("#options-container-1")
            optionsDistributionDisplay.innerHTML=""
            optionsContainer.innerHTML=""
            for(let i=0; i< numOptions; i++){
                option=options[i]
                let containerItem=document.createElement("div")
                containerItem.textContent=option["value"]
                optionsContainer.append(containerItem)

                let distributionItem=document.createElement("p")
                distributionItem.textContent=option["distribution"]+" - "+option["value"]
                optionsDistributionDisplay.append(distributionItem)
            }
        }
    })
}