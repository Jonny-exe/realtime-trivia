import * as db from "./db.js"
console.log("Everything works")
let word = ""
let user = ""

const $ = (query) => {
    return document.querySelector(query)
}

const addUser = () => {
    let username = $("input.addUser").value
    let user = username
    db.addUser(username)
}

export const setUsers = (users) => {
    console.log("users", users)
    const usersTable = $("table.users")
    let usersHTML = ""

    for (let user in users) {
        console.log(user)
        usersHTML += `<tr><td>${users[user]["name"]}</td></tr>`
    }
    const baseHTML = '<thead><tr><td> Users </td></tr></thead>'
    usersTable.innerHTML = baseHTML + usersHTML
}

$("button.addUser").addEventListener("click", addUser)

export const setWord = (newWord) => {
    word = newWord
    let spaces = " "
    for (let i = 0; i < newWord.length; i++) {
        spaces += "_ "
    }
    $("#word").innerHTML = spaces
}

export const amIwriter = (writerName) => {
    if (writerName === user) {
        writer()
    }
}

const writer = () => {
    $("div.setWord").css("display : true")
}

const setNewWord = () => {
    let newWord = $("input.setWord").value 
    db.setWord(newWord)
}

$("button.setWord").addEventListener("click", setNewWord)