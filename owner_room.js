function getAndUseOwnerRoomInfo() {
    fetch("http://localhost:3000/owner_room_info/" + roomId).then(r => r.json()).then(j => {

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
            defaultView()
        } else if (roomStatus == "accepting") {
            displayQuestion()
        }
    })
}

function updateUserList(){
    fetch("http://localhost:3000/member_list/"+roomId).then(r=>r.json()).then(j=>{ //don't include owner
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