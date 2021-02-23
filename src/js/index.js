import * as db from "./db.js"
import { $, shuffle, mergeSort, objectToArray } from "./utils.js"
import Answers from './answers.js'


export let user = ""
export let room = "public"

const addUser = () => {
    //TODO: make errro on duplicate and empty names: ""
    let username = $("input.addUser").value
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
    //TODO: order users by points
    // use utils.mergeSort(arraToSort, sortBy)
    const usersArray = objectToArray(unorderedUsers)
    const users = mergeSort(usersArray, "total_points")
    const usersTable = $("table.users")
    let usersHTML = ""

    for (let i = 0; i < users.length; i++) {
        const { total_points, streak, best_streak, name } = users[i]
        debugger
        usersHTML += `<tr><td>${name}</td><td>${total_points}</td><td>${streak}</td><td>${best_streak}</td></tr>`
    }
    const baseHTML = '<thead><tr><td> Users </td><td> Points </td><td> Streak </td><td> Best streak </td></tr></thead>'
    usersTable.innerHTML = baseHTML + usersHTML
}


$("button.addUser").addEventListener("click", addUser)
$("button.selectRoom").addEventListener("click", selectRoom)

export const handleAlert = (action) => {
    $("div.alertWrapper").style.display = action == show ? "inherit" : "none"
}

export const setQuestion = (question, user, room) => {
    const answers = new Answers(question, document, user, room)
}


export const setUserCount = (userCount) => {
    $("#usercount").innerHTML = `User amount: ${userCount}`
}


