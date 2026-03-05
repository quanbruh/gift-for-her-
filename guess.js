function guess() {
  // Tạo overlay container
  const overlayContainer = document.createElement('div');
  overlayContainer.id = "quiz-overlay";
  overlayContainer.style.position = "fixed";
  overlayContainer.style.top = "0";
  overlayContainer.style.left = "0";
  overlayContainer.style.width = "100%";
  overlayContainer.style.height = "100%";
  overlayContainer.style.backgroundColor = "rgb(255, 255, 255)";
  overlayContainer.style.zIndex = "9999"; // nằm trên game
  overlayContainer.style.overflow = "auto";
  document.body.appendChild(overlayContainer);

  // Tạo CSS riêng cho overlay
  const style = document.createElement('style');
  style.textContent = `
    #quiz-overlay {
      display: flex;
      flex-wrap: wrap;
      font-family: Arial, sans-serif;
      padding: 20px;
    }

    #quiz-overlay .quiz {
      width: 50%;
      max-width: 50%;
      text-align: left;
    }

    #quiz-overlay .quiz h2 { color: #2c3e50; }
    #quiz-overlay .buttons { margin-top: 15px; }
    #quiz-overlay button {
      padding: 8px 16px;
      margin-right: 10px;
      cursor: pointer;
      border: none;
      border-radius: 4px;
      font-size: 14px;
    }
    #quiz-overlay .yes { background-color: #27ae60; color: white; }
    #quiz-overlay .no { background-color: #c0392b; color: white; }
    #quiz-overlay .duoi {
      background-color: #8e44ad;
      color: white;
      padding: 10px 20px;
      font-size: 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 20px;
    }

    #quiz-overlay .image {
      width: 50%;
      max-width: 50%;
      position: relative;
      display: flex;
      justify-content: flex-end;
    }

    #quiz-overlay .image img {
      max-width: 100%;
      height: auto;
      border: 2px solid #ccc;
      border-radius: 8px;
      visibility: hidden;
    }

    #quiz-overlay .overlay {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background-color: rgb(0, 0, 0);
      opacity: 1;
      border-radius: 8px;
    }
    #quiz-overlay .overlay.hidden {
      opacity: 0;
      pointer-events: none;
      transition: opacity 1s ease;
    }

    #quiz-overlay .send {
    padding: 8px 16px;
    margin-left: 10px;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    background-color: #27ae60;
    color: white;
    } 



    #quiz-overlay .message {
      margin-top: 20px;
      font-weight: bold;
      color: #2980b9;
      opacity: 1;
      transition: opacity 1s ease;
    }
    #quiz-overlay .message.fade { opacity: 0; }

    @media (max-width: 768px) {
      #quiz-overlay {
        flex-direction: column;
        align-items: center;
      }
      #quiz-overlay .quiz, #quiz-overlay .image {
        width: 100%;
        max-width: 100%;
        text-align: center;
      }
      #quiz-overlay .image {
        justify-content: center;
      }
      #quiz-overlay button {
        margin: 5px;
        width: 80%;
        font-size: 16px;
      }
      #quiz-overlay .duoi {
        width: 90%;
      }
    }
  `;
  document.head.appendChild(style);

  // HTML quiz
  overlayContainer.innerHTML = `
    <div class="quiz">
      <h2 id="question-title">Câu đố:</h2>
      <p id="question-text"></p>
      <input id="answer-input" type="text" placeholder="Nhập câu trả lời...">
      <button class="send">Gửi</button>

      <div class="message" id="message"></div>
      <button class="duoi">Dỗi</button>
    </div>

    <div class="image">
      <img id="quiz-image" src="" alt="Ảnh minh họa">
      <div class="overlay"></div>
    </div>
  `;

  // JS logic
  const sendBtn = overlayContainer.querySelector('.send');

  const inputBox = overlayContainer.querySelector('#answer-input');
  const duoiBtn = overlayContainer.querySelector('.duoi');
  const overlay = overlayContainer.querySelector('.overlay');
  const message = overlayContainer.querySelector('#message');
  const questionText = overlayContainer.querySelector('#question-text');
  const quizImage = overlayContainer.querySelector('#quiz-image');
  sendBtn.addEventListener('click', checkAnswer);


  const quizData = [
    {question: "Tôi có mặt khắp nơi, nhưng bạn không thể nhìn thấy tôi. Tôi là gì?", image: "image1.jpg", answer:"hà mã"},
    {question: "Cái gì càng lau càng ướt?", image: "image2.jpg", answer:"ngựa "},
    {question: "Con gì đập thì sống, không đập thì chết?", image: "image3.jpg", answer:"hà mã"},
    {question: "Con gì đập thì sống, không đập thì chết?", image: "image4.jpg", answer:"hà mã"},
    {question: "Con gì đập thì sống, không đập thì chết?", image: "image5.jpg", answer:"hà mã"}
  ];

  let currentIndex = 0;

  function loadQuiz(index) {
    questionText.textContent = quizData[index].question;
    overlay.classList.remove('hidden');
    message.textContent = "";
    message.classList.remove('fade');
    quizImage.style.visibility = "hidden";

    quizImage.onload = () => {
      quizImage.style.visibility = "visible";
    };
    quizImage.src = quizData[index].image;

    const positions = [
      {top: "10%", left: "50%", right: "0", bottom: "0", width: "45%", height: "65%"},
      {top: "18%", left: "33%", right: "0", bottom: "0", width: "20%", height: "25%"},
      {top: "7%", left: "17%", right: "0", bottom: "0", width: "45%", height: "45%"},
      {top: "25%", left: "10%", right: "0", bottom: "0", width: "30%", height: "38%"},
      {top: "7%", left: "10%", right: "0", bottom: "0", width: "40%", height: "45%"}
    ];
    const pos = positions[index % positions.length];
    Object.assign(overlay.style, pos);
  }

  loadQuiz(currentIndex);

  function endQuiz() {
    overlayContainer.remove(); // Xóa overlay, game cũ hiện lại
  }

  let ketthuc = false;

  function checkAnswer() {
    const userAnswer = inputBox.value.trim().toLowerCase();
    const correctAnswer = quizData[currentIndex].answer.toLowerCase();

    if (userAnswer === "") {
      message.textContent = "Nhập đáp án!";
      return; // dừng lại, không kiểm tra tiếp
    }

    if (userAnswer === correctAnswer) {
      message.textContent = "Đúng rồi!";
    } else {
      message.textContent = "Sai rồi gà quá!";
    }

    inputBox.value = "";

    overlay.classList.add('hidden');
    setTimeout(() => {
      message.classList.add('fade');
      setTimeout(() => {
        currentIndex++;
        if (currentIndex < quizData.length) {  //quizData.length
          loadQuiz(currentIndex);
        } else {
          message.textContent = "Hết câu hỏi!";
          message.classList.remove('fade');
          ketthuc = true;
          // setTimeout(endQuiz, 2000); // Xóa overlay sau 2s
        }
      }, 1000);
    }, 2000);

  }


  

  
  duoiBtn.addEventListener('click', () => {
    message.textContent = "Ai cho cô dỗi hahaha";
    message.classList.remove('fade');
    if(ketthuc){
      message.textContent = "🐸";
      error();
    }
  });

  document.addEventListener("error_end", () => {
    setTimeout(endQuiz, 2000);
  });



}
