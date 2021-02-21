import * as db from "./db.js"
import { $, shuffle } from "./utils.js"
import Answers from './answers.js'
export let user = ""

const addUser = () => {
    //TODO: make errro on duplicate and empty names: ""
    let username = $("input.addUser").value
    user = username
    $('div.addUser').style.display = "none"
    db.startListening()

    db.set('users/' + username, { streak: 0, best_streak: 0 })
}

export const setUsers = (users) => {
    console.log("users", users)
    const usersTable = $("table.users")
    let usersHTML = ""

    for (let user in users) {
        console.log(user)
        usersHTML += `<tr><td>${user}</td><td>${users[user]['streak']}</td><td>${users[user]["best_streak"]}</td></tr>`
    }
    const baseHTML = '<thead><tr><td> Users </td><td> Streak </td><td> Best streak </td></tr></thead>'
    usersTable.innerHTML = baseHTML + usersHTML
}

$("button.addUser").addEventListener("click", addUser)

export const handleAlert = (action) => {
    $("div.alertWrapper").style.display = action == show ? "inherit" : "none"
}

export const setQuestion = (question) => {
    const answers = new Answers(question, document)
}


export const setUserCount = (userCount) => {
    $("#usercount").innerHTML = `User amount: ${userCount}`
}


