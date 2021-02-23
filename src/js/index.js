import * as db from "./db.js"
import { $, shuffle, mergeSort, objectToArray } from "./utils.js"
import Answers from './answers.js'


export let user = ""
export let room = "public"

const addUser = () => {
    let username = $("input.addUser").value
    if (username === "") {
        handleAlert("show", "Name can't be empty")
        return
    } else {
        handleAlert("hide", "")
    }
    $("input.addUser").value = ""
    user = username
    $('div.addUser').style.display = "none"
    db.startListening(room, username)

    $('div.selectRoom').style.display = "inherit"
}

const selectRoom = () => {
    let newRoom = $("input.selectRoom").value
    $("input.selectRoom").value = ""
    let oldRoom = room
    room = newRoom

    $("#currentRoom").innerHTML = `You currently are in the room: ${newRoom}`

    if (db.listeners !== undefined) {
        db.listeners.stopListening()
    }

    db.startListening(newRoom, user)
}

export const setUsers = (unorderedUsers) => {
    const usersArray = objectToArray(unorderedUsers)
    const users = mergeSort(usersArray, "total_points")
    const usersTable = $("table.users")
    let usersHTML = ""

    for (let i = 0; i < users.length; i++) {
        const { total_points, streak, best_streak, name } = users[i]
        usersHTML += `<tr><td>${name}</td><td>${total_points}</td><td>${streak}</td><td>${best_streak}</td></tr>`
    }
    const baseHTML = '<thead><tr><td> Users </td><td> Points </td><td> Streak </td><td> Best streak </td></tr></thead>'
    usersTable.innerHTML = baseHTML + usersHTML
}


$("button.addUser").addEventListener("click", addUser)
$("button.selectRoom").addEventListener("click", selectRoom)

export const handleAlert = (action, text) => {
    $("#alert").innerHTML = text
    $("div.alertWrapper").style.display = action == "show" ? "inherit" : "none"
}

export const setQuestion = (question, user, room) => {
    const answers = new Answers(question, document, user, room)
}


export const setUserCount = (userCount) => {
    $("#usercount").innerHTML = `User amount: ${userCount}`
}


