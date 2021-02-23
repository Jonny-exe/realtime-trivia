import { shuffle, $ } from './utils.js'
// import { user, room } from './index.js'
import * as db from './db.js'
class Answers {
    constructor(question, document, user, room = "public") {
        this.document = document
        this.user = user
        this.room = room
        let { correctAnswer, shuffledAnswers } = this.prepareAnswers(question)

        let questions = this.createQuestion(question)
        let answers = this.createAnswers(shuffledAnswers)
        this.insertAll(questions, answers)
        this.setQuestionsEventListeners(correctAnswer)
    }

    prepareAnswers = (question) => {
        let { correct_answer: correctAnswer, incorrect_answers: incorrectAnswers } = question
        let answers = []
        for (let i = 0; i < incorrectAnswers.length; i++) {
            answers[i] = incorrectAnswers[i]
        }
        answers.push(correctAnswer)

        let shuffledAnswers = shuffle(answers)
        return { correctAnswer, shuffledAnswers }
    }

    createQuestion = (question) => {
        let questionHTML = `<div class="alert alert-primary question" role="alert">${question['question']}</div>`
        return questionHTML
    }

    insertAll = (questionHTML, answersHTML) => {
        const finalHTML = questionHTML + answersHTML
        $('div.questions').innerHTML = finalHTML
    }

    createAnswers = (answers) => {
        let answersHTML = ""
        for (let i = 0; i < answers.length; i++) {
            answersHTML += `<div class="alert alert-dark answer" role="alert">${answers[i]}</div>`
        }
        return answersHTML
    }

    setQuestionsEventListeners = (correctAnswer) => {
        $('div.questions').style.opacity = 1;
        $('div.questions').style.pointerEvents = "inherit";
        const answers = document.querySelectorAll('.answer')
        for (let i = 0; i < answers.length; i++) {
            let answerText = answers[i].innerHTML
            if (answerText == correctAnswer) {
                answers[i].addEventListener('click', () => this.handleAnswer(true, correctAnswer, answerText))
            } else {
                answers[i].addEventListener('click', () => this.handleAnswer(false, correctAnswer, answerText))
            }
        }
    }

    handleAnswer = async (isCorrect, correctAnswer, choosenAnswer) => {
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
        }

        const dbPath = `users/${this.room}/${this.user}`
        let { streak, best_streak, total_points, name } = await db.listeners.get(dbPath)

        if (isCorrect) {
            streak++
            total_points++
            if (streak >= best_streak) {
                best_streak = streak
            }
        } else {
            streak = 0
        }

        db.listeners.set(dbPath, {
            streak,
            best_streak,
            total_points,
            name
        })
    }
}


export default Answers