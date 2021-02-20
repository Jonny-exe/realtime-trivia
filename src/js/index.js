import * as db from "./db.js"
import * as utils from "./utils.js"
console.log("Everything works")
let word = ""
export let user = ""

const $ = (query) => {
    return document.querySelector(query)
}

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
    if (action == "show") {
        $("div.alertWrapper").style.display = "inherit"
    } else {
        $("div.alertWrapper").style.display = "none"
    }
}

export const setQuestion = (question) => {
    //TODO: style these
    let questionHTML = `<div class="alert alert-primary question" role="alert">${question['question']}</div>`
    let incorrectAnswers = question['incorrect_answers']
    let correctAnswer = question['correct_answer']
    let answers = []
    for (let i = 0; i < incorrectAnswers.length; i++) {
        answers[i] = incorrectAnswers[i]
    }
    answers.push(correctAnswer)

    utils.shuffle(answers)

    let answersHTML = ""
    for (let i = 0; i < answers.length; i++) {
        answersHTML += `<div class="alert alert-dark answer" role="alert">${answers[i]}</div>`
    }

    const finalHTML = questionHTML + answersHTML
    $('div.questions').innerHTML = finalHTML

    const setQuestionsEventListeners = (correctAnswer) => {
        $('div.questions').style.opacity = 1;
        $('div.questions').style.pointerEvents = "inherit";
        const answers = document.querySelectorAll('.answer')
        for (let i = 0; i < answers.length; i++) {
            let answerText = answers[i].innerHTML
            if (answerText == correctAnswer) {
                answers[i].addEventListener('click', () => handleAnswer(true, correctAnswer, answerText))
            } else {
                answers[i].addEventListener('click', () => handleAnswer(false, correctAnswer, answerText))
            }
        }
    }
    setQuestionsEventListeners(correctAnswer)


}


const handleAnswer = async (isCorrect, correctAnswer, choosenAnswer) => {
    $('div.questions').style.opacity = .8;
    $('div.questions').style.pointerEvents = "none";
    const answers = document.querySelectorAll('div.answer')

    for (let i = 0; i < answers.length; i++) {
        let answer = answers[i]
        if (correctAnswer == answer.innerHTML) {
            answer.classList.remove("alert-dark")
            answer.classList.add("alert-success")
        } else if (choosenAnswer == answer.innerHTML) {
            answer.classList.remove("alert-dark")
            answer.classList.add("alert-danger")
        }
        console.log("INISDE")
    }
    const dbPath = `users/${user}`
    let streakInfo = await db.get(dbPath)
    let streak = streakInfo.streak
    let best_streak = streakInfo.best_streak

    if (isCorrect) {
        streak++
        if (streak >= best_streak) {
            best_streak = streak
        }
    } else {
        streak = 0
        best_streak = streakInfo.best_streak
    }

    db.set(dbPath, {
        streak: streak,
        best_streak: best_streak
    })
}

export const setUserCount = (userCount) => {
    $("#usercount").innerHTML = `User amount: ${userCount}`
}


