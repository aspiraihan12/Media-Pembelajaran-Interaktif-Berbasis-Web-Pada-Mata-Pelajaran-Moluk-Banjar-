const questionNumber = document.querySelector(".question-number");
const questionText = document.querySelector(".question-text");
const optionContainer = document.querySelector(".option-container");
const answersIndicatorContainer= document.querySelector(".answers-indicator");
const homeBox=document.querySelector(".home-box");
const quizBox=document.querySelector(".quiz-box");
const resultBox = document.querySelector(".result-box");
const questionLimit = 10; //if you want all questions "quiz.length"
let questionCounter = 0;
let currentQuestion;
let availableQuestions = [];
let availableOptions = [];
let correctAnswers=0;
let attempt=0;

//pus teh questions into availableQuestions array
function setAvailableQuestions(){
 const totalQuestion = quiz.length;
 for(let i=0;i<totalQuestion;i++){
     availableQuestions.push(quiz[i])
 }
}

//set question number and question and options
function getNewQuestion(){
    //set question number
    questionNumber.innerHTML= "Soal "+ (questionCounter + 1)+" Ke "+ questionLimit;

    //set question text
    // get random question
    const questionIndex = availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
    currentQuestion=questionIndex;
    questionText.innerHTML=currentQuestion.q;
    //get the position of 'questionIndex' from the availableQuestion Array
    const index1=availableQuestions.indexOf(questionIndex);
    //remove the 'questionIndex' from the availableQuestion Array, so that the question does not
    availableQuestions.splice(index1,1);
    //show question img if 'img' property exists
    if(currentQuestion.hasOwnProperty("img")){
        const img = document.createElement("img");
        img.src=currentQuestion.img;
        questionText.appendChild(img);
    }

    //set options
    //get the length of options
    const optionLen = currentQuestion.options.length
    //push options into availabelOptions array
    for(let i=0; i<optionLen;i++){
        availableOptions.push(i)
    }
    optionContainer.innerHTML='';
    let animationDelay=0.15;
    // create options in html
    for (let i = 0; i<optionLen;i++) {
        //random option
        const optionIndex = availableOptions[Math.floor(Math.random()*availableOptions.length)];
        //get the position of 'optionindex 'from the availableoptions array
        const index2 = availableOptions.indexOf(optionIndex);
        // remove the 'option index' from the availableOptions array, so that the option does not repeat
        availableOptions.splice(index2,1);
        console.log(optionIndex);
        const option = document.createElement("div");
        option.innerHTML = currentQuestion.options[optionIndex];
        option.id=optionIndex;
        option.style.animationDelay=animationDelay + 's';
        animationDelay=animationDelay+0.15;
        option.className="option";
        optionContainer.appendChild(option)
        option.setAttribute("onclick","getResult(this)");
        
    }
    questionCounter++
}

// get the result of current attempt question
// Inside the getResult(element) function

function getResult(element) {
    const id = parseInt(element.id);

    // Play sound effect based on the answer
    const correctSound = document.getElementById("correctSound");
    const incorrectSound = document.getElementById("incorrectSound");

    if (id === currentQuestion.answer) {
        element.classList.add("correct");
        updateAnswerIndicator("correct");
        correctAnswers++;

        // Play the correct answer sound
        correctSound.currentTime = 0; // Reset the audio position
        correctSound.play();
    } else {
        element.classList.add("wrong");
        updateAnswerIndicator("wrong");

        // Play the incorrect answer sound
        incorrectSound.currentTime = 0; // Reset the audio position
        incorrectSound.play();

        // Show the correct answer by highlighting it
        const optionLen = optionContainer.children.length;
        for (let i = 0; i < optionLen; i++) {
            if (parseInt(optionContainer.children[i].id) === currentQuestion.answer) {
                optionContainer.children[i].classList.add("correct");
            }
        }
    }

    attempt++;
    unclickableOptions();
}
function next() {
    if (questionCounter === questionLimit) {
        quizOver();
    } else {
        if (currentQuestion !== undefined && !isOptionClicked()) {
            return; // Mengembalikan fungsi jika opsi belum dipilih
        }
        getNewQuestion();
    }
    

    // Play the button click sound
    const buttonClickSound = document.getElementById("buttonClickSound");
    buttonClickSound.currentTime = 0; // Reset the audio position
    buttonClickSound.play();
    
}
function isOptionClicked() {
    const optionLen = optionContainer.children.length;
    for (let i = 0; i < optionLen; i++) {
        if (optionContainer.children[i].classList.contains("already-answered")) {
            return true; // Mengembalikan true jika opsi sudah dipilih
        }
    }
    return false;
}

//make all the options unclickable once the user select a option (restrict the user to change the option again)
function unclickableOptions() {
    const optionLen= optionContainer.children.length;
    for (let i=0; i<optionLen;i++){
        optionContainer.children[i].classList.add("already-answered");
        
    }
}

function answersIndicator() {
    answersIndicatorContainer.innerHTML = '';
    const totalQuestion = questionLimit;
   for(let i=0;i<totalQuestion; i++){
       const indicator = document.createElement("div");
       answersIndicatorContainer.appendChild(indicator);
   }
}
function updateAnswerIndicator(markType){
answersIndicatorContainer.children[questionCounter-1].classList.add(markType)
}

// function next(){
//     if (questionCounter === questionLimit) {
//         quizOver();
//     }
//     else{
//         getNewQuestion();
//     }
// }

function quizOver() {
    // hide quiz Box
    quizBox.classList.add("hide");
    //show result box
    resultBox.classList.remove("hide");
    
    quizResult();
    backButton.style.display = "block";
}
//get the quiz result
function quizResult() {
    // resultBox.querySelector("#nisn").innerHTML = document.querySelector("#nisnInputAlert").value;
    resultBox.querySelector(".total-question").innerHTML = questionLimit;
    resultBox.querySelector(".total-attempt").innerHTML = attempt;
    resultBox.querySelector(".total-correct").innerHTML = correctAnswers;
    resultBox.querySelector(".total-wrong").innerHTML = attempt - correctAnswers;
    
    const percentage = (correctAnswers / questionLimit) * 100;
    resultBox.querySelector(".percentage").innerHTML = percentage.toFixed(2) + "%";
    resultBox.querySelector(".total-score").innerHTML = correctAnswers + " / " + questionLimit;
 
   

    // Check if the percentage is greater than or equal to 60
    if (percentage >= 60) {
        resultBox.querySelector(".result-message").innerHTML = "Selamat, Anda lulus!";
        resultBox.querySelector(".result-message").classList.add("pass");
        resultBox.querySelector(".result-message").classList.remove("fail"); // Hapus kelas fail jika ada
    } else {
        resultBox.querySelector(".result-message").innerHTML = "Maaf, Anda belum lulus. Tolong belajar lebih giat!";
        resultBox.querySelector(".result-message").classList.add("fail");
        resultBox.querySelector(".result-message").classList.remove("pass"); // Hapus kelas pass jika ada
    }
  
 }
 

 function resetQuiz() {
    const nisnInput = document.getElementById("nisnInputAlert");
    nisnInput.value = "";
    

    questionCounter = 0;
    correctAnswers = 0;
    attempt = 0;
    availableQuestions = [];
}

function prevQuizLast() {
    const nisnInput = document.getElementById("nisnInputAlert");
    // hide the resultbox
    resultBox.classList.add("hide");
    // show the quizbox
    quizBox.classList.remove("hide");
    resetQuiz();
    
    nisnInput.style.display = "block";

    startQuiz();
}

function CetakKuis() {
    const nisn = document.querySelector(".nisn").textContent;
    const nilai = document.querySelector(".result-message").textContent;
    const totalQuiz = document.querySelector(".total-question").textContent;
    const attempt = document.querySelector(".total-attempt").textContent;
    const correct = document.querySelector(".total-correct").textContent;
    const wrong = document.querySelector(".total-wrong").textContent;
    const percentage = document.querySelector(".percentage").textContent;
    const totalScore = document.querySelector(".total-score").textContent;

    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
        <html>
        <head>
            <title>Hasil Kuis</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                .container {
                    width: 70%;
                    margin: 0 auto;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    padding: 10px;
                    border: 1px solid #ddd;
                    text-align: left;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Hasil Kuis</h1>
                <table>
                    <tr>
                        <th>NISN</th>
                        <td>${nisn}</td>
                    </tr>
                    <tr>
                        <th>Nilai Kuis</th>
                        <td>${nilai}</td>
                    </tr>
                    <tr>
                        <th>Total Quiz</th>
                        <td>${totalQuiz}</td>
                    </tr>
                    <tr>
                        <th>Attempt</th>
                        <td>${attempt}</td>
                    </tr>
                    <tr>
                        <th>Benar</th>
                        <td>${correct}</td>
                    </tr>
                    <tr>
                        <th>Salah</th>
                        <td>${wrong}</td>
                    </tr>
                    <tr>
                        <th>Persentasi</th>
                        <td>${percentage}</td>
                    </tr>
                    <tr>
                        <th>Total Score</th>
                        <td>${totalScore}</td>
                    </tr>
                </table>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}


// function tryAgainQuiz() {
   
//     // hide the resultbox
//     resultBox.classList.add("hide");
//     // show the quizbox
//     quizBox.classList.remove("hide");
//     resetQuiz();
    


//     startQuiz();
// }

function goToHome(){
    const nisnInput = document.getElementById("nisnInput");

    // hide resultBox
    resultBox.classList.add("hide");
    //show home box
    homeBox.classList.remove("hide");
    nisnInput.style.display = "block";
    resetQuiz();
    
}

// ### starting point###
function startQuiz(nisnValue) {
    // hide home box
    homeBox.classList.add("hide");
    // show quiz box
    quizBox.classList.remove("hide");
    const backButton = document.getElementById("backButton");
    backButton.style.display = "none";
    // first we will set all questions in availableQuestion array
    setAvailableQuestions();
    // second we will call getNewQuestion(); functin
    getNewQuestion();
    // to create indicator of answer
    answersIndicator();

    // Tampilkan NISN pada hasil akhir
    quizResult(nisnValue);
}



window.onload= function () {
    homeBox.querySelector(".total-question").innerHTML=questionLimit;
}
