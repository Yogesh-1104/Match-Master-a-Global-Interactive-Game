let loggedInUser = "";
let correctMatches = 0;
let totalMatches = 0;
let currentRound = 0;
let selectedCategory = "";
let totalScore = 0;
let totalAttempts = 0;

const categories = {
  currency: {
    rounds: [[
      { id: "India", image: "500-note-front.png" },
      { id: "Pakistan", image: "pakistan-500-note.webp" },
      { id: "Bangladesh", image: "bangladesh-500-note.jpg" }
    ]],
    labels: [["India", "Pakistan", "Bangladesh"]]
  },
  monuments: {
    rounds: [[
      { id: "Agra", image: "download (1).jpg" },
      { id: "Odisha", image: "images (3).jpg" },
      { id: "Delhi", image: "images (4).jpg" }
    ]],
    labels: [["Agra", "Odisha", "Delhi"]]
  },
  flags: {
    rounds: [
      [
        { id: "USA", image: "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" },
        { id: "France", image: "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg" },
        { id: "Japan", image: "https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg" }
      ],
      [
        { id: "Nepal", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Flag_of_Nepal.svg/320px-Flag_of_Nepal.svg.png" },
        { id: "Sri Lanka", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Flag_of_Sri_Lanka.svg/320px-Flag_of_Sri_Lanka.svg.png" },
        { id: "Iran", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Flag_of_Iran.svg/320px-Flag_of_Iran.svg.png" }
      ]
    ],
    labels: [
      ["France", "USA", "Japan"],
      ["Nepal", "Sri Lanka", "Iran"]
    ]
  }
};

function login() {
  const username = document.getElementById("username").value.trim();
  /*const password = document.getElementById("password").value;*/
  if (username /*&& password*/) {
    loggedInUser = username;
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("gameSection").classList.remove("hidden");
    document.getElementById("userDisplay").innerText = username;
  } else {
    alert("Please enter both username and password.");
  }
}

function logout() {
  loggedInUser = "";
  correctMatches = 0;
  totalMatches = 0;
  currentRound = 0;
  totalScore = 0;
  totalAttempts = 0;
  document.getElementById("loginSection").classList.remove("hidden");
  document.getElementById("gameSection").classList.add("hidden");
  document.getElementById("result").innerText = "";
  backToCategory();
}

function startGame() {
  const category = document.getElementById("category").value;
  if (!category) return alert("Select a category first!");

  selectedCategory = category;
  currentRound = 0;
  totalScore = 0;
  totalAttempts = 0;
  document.getElementById("result").innerText = "";
  loadRound(category, currentRound);

  document.getElementById("categorySection").classList.add("hidden");
  document.getElementById("gameArea").classList.remove("hidden");
  document.getElementById("backButtonContainer").classList.add("hidden");
}

function loadRound(category, round) {
  const draggables = document.getElementById("draggables");
  const dropzones = document.getElementById("dropzones");
  const message = document.getElementById("message");

  draggables.innerHTML = "";
  dropzones.innerHTML = "";
  message.innerText = "";
  correctMatches = 0;

  const items = categories[category].rounds[round];
  const labels = categories[category].labels[round];
  totalMatches = items.length;

  updateScore();

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "draggable";
    div.id = item.id;
    div.draggable = true;
    div.style.backgroundImage = `url('${item.image}')`;
    div.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", item.id);
    });
    draggables.appendChild(div);
  });

  labels.forEach(label => {
    const div = document.createElement("div");
    div.className = "dropzone";
    div.setAttribute("data-country", label);
    div.textContent = label;
    dropzones.appendChild(div);
  });

  setDropEvents();
}

function setDropEvents() {
  const dropzones = document.querySelectorAll(".dropzone");
  dropzones.forEach(zone => {
    zone.addEventListener("dragover", e => e.preventDefault());

    zone.addEventListener("drop", e => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData("text/plain");
      const correctId = zone.getAttribute("data-country");
      const draggedEl = document.getElementById(draggedId);

      if (!draggedEl) return;

      totalAttempts++;

      if (draggedId === correctId) {
        zone.classList.add("correct");
        zone.innerHTML = `<img src="${draggedEl.style.backgroundImage.slice(5, -2)}" alt="">`;
        draggedEl.remove();
        correctMatches++;
        totalScore++;
        updateScore();

        if (correctMatches === totalMatches) {
          const rounds = categories[selectedCategory].rounds;
          const isLastRound = currentRound === rounds.length - 1;

          if (!isLastRound) {
            document.getElementById("message").innerText = "✅ Great! Next round unlocked!";
            setTimeout(() => {
              currentRound++;
              loadRound(selectedCategory, currentRound);
            }, 2000);
          } else {
            document.getElementById("message").innerText = "🎉 You've completed all rounds!";
            showFinalResult();
            document.getElementById("backButtonContainer").classList.remove("hidden");
            }
        }
      } else {
        zone.style.background = "#ffebee";
        setTimeout(() => {
          zone.style.background = "";
        }, 1000);
        updateScore();
      }
    });
  });
}

function updateScore() {
  document.getElementById("score").innerText =
    `Score: ${totalScore} / ${totalAttempts}`;
}

function showFinalResult() {
  const percent = Math.round((totalScore / totalAttempts) * 100);
  document.getElementById("result").innerText =
    `✅ Final Score: ${totalScore}/${totalAttempts} (${percent}%)`;
}

function backToCategory() {
  document.getElementById("gameArea").classList.add("hidden");
  document.getElementById("backButtonContainer").classList.add("hidden");
  document.getElementById("categorySection").classList.remove("hidden");
  document.getElementById("message").innerText = "";
  document.getElementById("score").innerText = "";
  document.getElementById("result").innerText = "";
}