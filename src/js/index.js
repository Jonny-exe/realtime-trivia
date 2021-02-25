import * as db from "./db.js"
import { $, shuffle, mergeSort, objectToArray } from "./utils.js"
import Answers from './answers.js'


export let user = ""
export let room = "public"
let usersOrder = "Points"

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
    room = newRoom

    $("#currentRoom").innerHTML = `You currently are in the room: ${newRoom}`

    if (db.listeners !== undefined) {
        db.listeners.stopListening()
    }

    db.startListening(newRoom, user)
}

export const setUsers = (unorderedUsers, orderer) => {
    const orderBy = orderer ?? usersOrder

    const categorysInDb = {
        Users: "name",
        Points: "total_points",
        Streak: "streak",
        "Best streak": "best_streak"
    }

    const usersArray = objectToArray(unorderedUsers)
    const users = mergeSort(usersArray, categorysInDb[orderBy])
    const usersTable = $("table.users")
    let usersHTML = ""

    let tableHTML = ""
    for (let category in categorysInDb) {
        category = category == orderBy ? `<b> ${category} </b>` : category
        tableHTML += `<td class="userCategory"> ${category} </td>`
    }

    for (let i = 0; i < users.length; i++) {
        const { total_points, streak, best_streak, name } = users[i]
        usersHTML += `<tr><td>${name}</td><td>${total_points}</td><td>${streak}</td><td>${best_streak}</td></tr>`
    }

    const baseHTML = `<thead>${tableHTML}</thead>`
    usersTable.innerHTML = baseHTML + usersHTML

    const categorys = document.querySelectorAll(".userCategory")
    for (let i = 0; i < categorys.length; i++) {
        const category = categorys[i]
        category.addEventListener("click", () => setUsers(unorderedUsers, category?.innerText))
    }
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


