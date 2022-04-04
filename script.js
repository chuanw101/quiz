// questions bank
var questions = [
    {
        question: "What is the capital of Washington?",
        answer1: "1. Seattle",
        answer2: "2. Redmond",
        answer3: "3. Olympia",
        answer4: "4. Tacoma",
        correctAnswer: "3"
    },
    {
        question: "What is the capital of Arizona?",
        answer1: "1. Phoenix",
        answer2: "2. Mesa",
        answer3: "3. Scottsdale",
        answer4: "4. Tucson",
        correctAnswer: "1"
    },
    {
        question: "What is the capital of Nevada?",
        answer1: "1. Reno",
        answer2: "2. Las Vegas",
        answer3: "3. Henderson",
        answer4: "4. Carson City",
        correctAnswer: "4"
    },
    {
        question: "What is the capital of California",
        answer1: "1. Sacramento",
        answer2: "2. San Francisco",
        answer3: "3. Los Angeles",
        answer4: "4. San Diego",
        correctAnswer: "1"
    },
    {
        question: "What is the capital of Texas",
        answer1: "1. Dallas",
        answer2: "2. Austin",
        answer3: "3. Houston",
        answer4: "4. San Antonio",
        correctAnswer: "2"
    },
];
var currentQ = 0;
var timeLeft = 75;
var stopTimer = false;

//get elements from site
var startCard = document.querySelector(".container");
var questionCard = document.querySelectorAll(".container")[1];
var doneCard = document.querySelectorAll(".container")[2];
var scoreCard = document.querySelectorAll(".container")[3];
var timeShown = document.querySelector("#time");
var questionEl = questionCard.querySelector("h1");
var answer1 = questionCard.querySelectorAll("button")[0];
var answer2 = questionCard.querySelectorAll("button")[1];
var answer3 = questionCard.querySelectorAll("button")[2];
var answer4 = questionCard.querySelectorAll("button")[3];
var msg = document.querySelector("#msg");
var ini = document.querySelector("#ini");
var finalScore = document.querySelector("#score");
var scoreLi = document.querySelector("#score-list");

function startQuiz() {
    showCard("question");
    showQuestion(currentQ);
    startTimer();
}

// update html with the count'th question
function showQuestion(count) {
    questionEl.textContent = questions[count].question;
    answer1.textContent = questions[count].answer1;
    answer2.textContent = questions[count].answer2;
    answer3.textContent = questions[count].answer3;
    answer4.textContent = questions[count].answer4;
}


//check answer submitted and adjust score / go to next question / go to end page
function checkAnswer() {
    if (this.textContent[0] === questions[currentQ].correctAnswer) {
        msg.textContent = "Correct!";
        showMsg();        
    } else {
        msg.textContent = "Wrong!"
        showMsg();
        timeLeft -= 10;
        timeShown.textContent = timeLeft;
    }
    if (currentQ < questions.length-1) {
        showQuestion(++currentQ);
    } else if (currentQ === questions.length-1) {
        currentQ++;
        stopTimer = true;
        showCard("done");
    }
}

function startTimer() {
    stopTimer = false;
    // Sets interval in variable
    var timerInterval = setInterval(function() {
        timeLeft--;
        timeShown.textContent = timeLeft;
        // stop timer if reaches 0 or questions are finished
        if(timeLeft === 0 || currentQ === questions.length){
            // Stops execution of action at set interval
            clearInterval(timerInterval);
            // end quiz
            showCard("done");
        } else if (stopTimer) {
            clearInterval(timerInterval);
        }
    }, 1000);
}  

var msgTimer;
// displays correct/wrong msg for 1 second
function showMsg() {
    msg.setAttribute("style","display:flex");
    // restart timer if there was already a previous timer
    if (msgTimer) {
        clearTimeout(msgTimer);
    }

    msgTimer = setTimeout(function() {
        msg.setAttribute("style","display:none")
    }, 1000);
}

//save high score
function saveScore(event) {
    event.preventDefault();
    if (!ini.value.trim()) {
        // clear msgTimer incase user click submit within 1 second of last question
        if (msgTimer) {
            clearTimeout(msgTimer);
        }
        msg.textContent = "Cannot leave initials blank";
        msg.setAttribute("style","display:flex");
        return;
    } else {
        msg.setAttribute("style","display:none");
    }
    var score = {
        initials: ini.value.trim(),
        score: timeLeft
    };
    var temp = localStorage.getItem("scores");
    if (!temp) {
        //create new array of scores if its the first score, store in localStorage
        var scoreArray = [score];
        localStorage.setItem("scores", JSON.stringify(scoreArray));
    } else {
        //if array already exists in local storage, find appropriate spot to insert the new score
        var scores = JSON.parse(temp);
        var added = false;
        //loop through array to find right spot for insert
        for (let i=0; i< scores.length; i++) {
            if(score.score > scores[i].score) {
                scores.splice(i,0,score);
                added = true;
                break;
            }
        }
        //if not added in loop then its the lowest score, push to end of array
        if(!added) {
            scores.push(score);
        }
        //update localStorage with new array
        localStorage.setItem("scores", JSON.stringify(scores));
    }
    showScore();
}

//show high score
function showScore() {
    //clear out list, reset currentQ, stop the timer
    scoreLi.innerHTML="";
    currentQ = 0;
    stopTimer = true;
    //fill list with info from localstorage
    var temp = localStorage.getItem("scores");
    //only need to do so if scores array isnt empty
    if (temp) {
        var scores = JSON.parse(temp);
        for (let i=0; i< scores.length; i++) {
            let li = document.createElement("li");
            let temp = scores[i];
            li.textContent = temp.initials + ": " + temp.score;
            scoreLi.appendChild(li);
        }
    }
    showCard("score");
}

//helper function to show the section wanted and hide rest
function showCard(c) {
    switch (c) {
        case "start":
            timeLeft = 75;
            timeShown.textContent = timeLeft;
            startCard.setAttribute("style","display:flex");
            questionCard.setAttribute("style","display:none");
            doneCard.setAttribute("style","display:none");
            scoreCard.setAttribute("style","display:none");
            break;
        case "question":
            startCard.setAttribute("style","display:none");
            questionCard.setAttribute("style","display:flex");
            doneCard.setAttribute("style","display:none");
            scoreCard.setAttribute("style","display:none");
            break;
        case "done":
            finalScore.textContent = timeLeft;
            startCard.setAttribute("style","display:none");
            questionCard.setAttribute("style","display:none");
            doneCard.setAttribute("style","display:flex");
            scoreCard.setAttribute("style","display:none");
            break;
        default:
            startCard.setAttribute("style","display:none");
            questionCard.setAttribute("style","display:none");
            doneCard.setAttribute("style","display:none");
            scoreCard.setAttribute("style","display:flex");
    }
}

//resets score in localStorage and html
function resetScore() {
    localStorage.setItem("scores", "");
    showScore();
}

function backToStart() {
    showCard("start");
}

//all the buttons
var startBtn = document.querySelector("#start");
startBtn.addEventListener("click", startQuiz);
answer1.addEventListener("click", checkAnswer);
answer2.addEventListener("click", checkAnswer);
answer3.addEventListener("click", checkAnswer);
answer4.addEventListener("click", checkAnswer);
var subBtn = document.querySelector("#sub");
subBtn.addEventListener("click", saveScore);
var resetBtn = document.querySelector("#reset");
resetBtn.addEventListener("click", resetScore);
var backBtn = document.querySelector("#back");
backBtn.addEventListener("click", backToStart);