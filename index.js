let recState = "notRecording";

window.onload = function init() {
  try {
    // Shim for webkit browsers
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia =
      navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;

    audio_context = new AudioContext();
  } catch (e) {
    alert("No web audio support in this browser!");
  }

  navigator.getUserMedia({ audio: true }, startUserMedia, function (e) {
    console.log("No live audio input: " + e);
  });
};

let audioChunks = [];
let mediaRecorder;

function startUserMedia(stream) {
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = function (event) {
    if (event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };

  if (mediaRecorder.state === "inactive" && audioChunks.length === 0) {
    let trol = document.querySelectorAll(".trol");
    trol.forEach((button, i) => {
      button.disabled = true;
      button.style.background = "rgba(205, 205, 205, 0.267)";
      document.querySelector(".deleter").style.color =
        "rgba(255, 255, 255, 0.24)";
    });
  }
  if (mediaRecorder.state === "recording") {
  } else {
  }

  mediaRecorder.onstop = function () {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    const audioUrl = URL.createObjectURL(audioBlob);

    // Create a new container for the audio playback
    const playfilesDiv = document.createElement("div");
    playfilesDiv.className = "playfiles";

    // Create the inner structure
    const conskDiv = document.createElement("div");
    conskDiv.className = "consk";

    const controlsDiv = document.createElement("div");
    controlsDiv.className = "controls";

    const seekerDiv = document.createElement("div");
    seekerDiv.className = "seeker";

    const currentTimeSpan = document.createElement("span");
    currentTimeSpan.className = "currentTime";
    currentTimeSpan.textContent = "0:00";

    const sliderInput = document.createElement("input");
    sliderInput.type = "range";
    sliderInput.min = "0";
    sliderInput.max = "100";
    sliderInput.value = "0";
    sliderInput.className = "slider";
    sliderInput.id = "slider";

    const totalTimeSpan = document.createElement("span");
    totalTimeSpan.className = "Ttime";
    totalTimeSpan.textContent = "0:00";

    seekerDiv.appendChild(currentTimeSpan);
    seekerDiv.appendChild(sliderInput);
    seekerDiv.appendChild(totalTimeSpan);

    const spaceBtnDiv = document.createElement("div");
    spaceBtnDiv.className = "spacebtn";

    const tittleDiv = document.createElement("div");
    tittleDiv.className = "tittle";

    const nameTittleH2 = document.createElement("h2");
    nameTittleH2.className = "nameTittle";
    nameTittleH2.textContent = "Recorded Audio"; // You can set this to a dynamic name if needed

    tittleDiv.appendChild(nameTittleH2);

    const audioElement = document.createElement("audio");
    audioElement.id = "audio";
    audioElement.src = audioUrl;

    const stateP = document.createElement("p");
    stateP.className = "state";
    stateP.textContent = "paused";

    // Append everything to the playfilesDiv
    conskDiv.appendChild(controlsDiv);
    conskDiv.appendChild(seekerDiv);
    playfilesDiv.appendChild(conskDiv);
    playfilesDiv.appendChild(spaceBtnDiv);
    playfilesDiv.appendChild(tittleDiv);
    playfilesDiv.appendChild(audioElement);
    let playbtn = document.createElement("i");
    let pausebtn = document.createElement("i");
    playbtn.className = "fa fa-play fa-2x recPlay";
    pausebtn.className = "fa fa-pause fa-2x recPause";
    pausebtn.style.display = "none";
    playfilesDiv.querySelector(".controls").appendChild(playbtn);
    playfilesDiv.querySelector(".controls").appendChild(pausebtn);
    pausebtn.addEventListener("click", togglePlayPause);
    playbtn.addEventListener("click", togglePlayPause);
    function togglePlayPause() {
      let Audiofiles = document.querySelectorAll(".playfilesDiv");
      Audiofiles.forEach((d, i) => {
        let state = d.querySelector(".stateP");
        d.classList.remove("on");
        let Otheraudio = d.querySelector("#audio");

        if (Otheraudio) {
          stateP.textContent = "paused";
          Otheraudio.pause();
        }

        let seeker = d.querySelector(".seekerSS");
        if (seeker) {
          seeker.style.display = "none";
        }

        let cPl = d.querySelector(".fa-play");
        if (cPl) {
          cPl.style.display = "inline";
        }

        let cPP = d.querySelector(".fa-pause");
        if (cPP) {
          cPP.style.display = "none";
        }
      });
      if (stateP.textContent === "paused") {
        playfilesDiv.classList.add("on");
        playfilesDiv.querySelector(".seeker").style.display = "flex";
        audioElement.play();
        playbtn.style.display = "none";
        pausebtn.style.display = "inline";
        stateP.textContent = "playing";
      } else {
        audioElement.pause();
        playbtn.style.display = "inline";
        pausebtn.style.display = "none";
        stateP.textContent = "paused";
      }
    }
    //update slider background
    sliderInput.addEventListener("input", function () {
      let value = ((this.value - this.min) / (this.max - this.min)) * 100;
      this.style.background = `linear-gradient(to right, rgba(224, 219, 219, 0.888) ${value}%, rgba(0, 0, 0, 0.45) ${value}%)`;
    });
    let value =
      ((sliderInput.value - sliderInput.min) /
        (sliderInput.max - sliderInput.min)) *
      100;
    sliderInput.style.background = `linear-gradient(to right, rgba(224, 219, 219, 0.888) ${value}%, rgba(0, 0, 0, 0.45) ${value}%)`;

    let formatTime = (time) => {
      let min = Math.floor(time / 60);
      let sec = Math.floor(time % 60);
      return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    if (totalTimeSpan.textContent === "NaN:NaN") {
      audioElement.addEventListener("loadedmetadata", () => {
        totalTimeSpan.textContent = formatTime(audioElement.duration);
      });
    }
    // Update time and slider as audio plays
    audioElement.addEventListener("timeupdate", () => {
      currentTimeSpan.textContent = formatTime(audioElement.currentTime);

      // Update slider value and if it ends send slider to beginning
      let value = (audioElement.currentTime / audioElement.duration) * 100;
      sliderInput.value = value;
      sliderInput.style.background = `linear-gradient(to right, rgba(224, 219, 219, 0.888) ${value}%, rgba(0, 0, 0, 0.45) ${value}%)`;
      if (
        (sliderInput.value / 100) * audioElement.duration ===
        audioElement.duration
      ) {
        playbtn.style.display = "inline";
        pausebtn.style.display = "none";
        sliderInput.value = 0;
        stateP.textContent = "paused";
      }

      // Update total time
      totalTimeSpan.textContent = formatTime(audio.duration);
    });
    sliderInput.addEventListener("input", function () {
      let newTime = (this.value / 100) * audioElement.duration;
      audioElement.currentTime = newTime;
    });
    currentTimeSpan.textContent = formatTime(audioElement.currentTime);
    totalTimeSpan.textContent = formatTime(audioElement.duration);

    document.querySelector(".contenc").appendChild(playfilesDiv);
  };
}

// Function to start or resume recording
function startRecording() {
  if (mediaRecorder.state === "inactive") {
    mediaRecorder.start();
    console.log(mediaRecorder.state);
    document.querySelector(".saver").style.background =
      "rgba(222, 222, 222, 0.916)";
    console.log(audioChunks);
    document.querySelector(".deleter").style.color =
      "rgba(255, 255, 255, 0.74)";
    document.querySelector(".saver").disabled = false;
    document.querySelector(".saver").addEventListener("click", () => {
      console.log(mediaRecorder.state);
      recState = "Paused";
      console.log(recState);
      if (recState === "Paused") {
        let circles = document.querySelectorAll(".circle");
        for (const x of circles) {
          x.style.animation = "none";
        }
        document.querySelector(".circle1").style.background = "none";
        document.querySelector(".circle2").style.background = "none";
        document.querySelector(".circle3").style.background = "none";
        document.querySelector(".action .fa-microphone").style.display = "flex";
        document.querySelector(".fa-pause-circle-o").style.display = "none";
        audioChunks = [];
      }
    });
  } else if (mediaRecorder.state === "paused") {
    mediaRecorder.resume();
  }
}

// Function to pause the recording
function pauseRecording() {
  mediaRecorder.pause();
}

// Function to stop recording
function stopRecording() {
  mediaRecorder.stop();
}

let Audiofiles = document.querySelectorAll(".playfiles");

document.querySelector(".saver").addEventListener("click", () => {
  console.log("should be stopped");
  stopRecording();
  audioChunks = [];
  audiostyles();
});

document.querySelector(".micy").addEventListener("click", () => {
  startRecording();
  recState = "Recording";
  document.querySelector(".action .fa-microphone").style.display = "none";
  document.querySelector(".fa-pause-circle-o").style.display = "flex";

  if (recState === "Recording") {
    let circles = document.querySelectorAll(".circle");
    for (const x of circles) {
      x.style.animation = "ripple 3s infinite";
    }
    document.querySelector(".circle1").style.background =
      "rgba(127, 97, 97, 0.327)";
    document.querySelector(".circle2").style.background =
      " rgba(127, 97, 97, 0.525)";
    document.querySelector(".circle3").style.background =
      "  rgba(127, 97, 97, 0.596)";
  }
});

document.querySelector(".pausy").addEventListener("click", () => {
  pauseRecording();
  recState = "Paused";
  console.log("should be paused");
  document.querySelector(".action .fa-microphone").style.display = "flex";
  document.querySelector(".fa-pause-circle-o").style.display = "none";

  // Stop the animation when not recording
  if (recState === "Paused") {
    let circles = document.querySelectorAll(".circle");
    for (const x of circles) {
      x.style.animation = "none";
    }
    document.querySelector(".circle1").style.background = "none";
    document.querySelector(".circle2").style.background = "none";
    document.querySelector(".circle3").style.background = "none";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".menu");
  const filesSection = document.querySelector(".files");

  document.querySelector(".fa-arrow-left").addEventListener("click", () => {
    if (
      document.querySelector(".app").style.display === "none" ||
      document.querySelector(".app").style.display === ""
    ) {
      filesSection.style.display = "none";
      document.querySelector(".app").style.display = "flex";
    }
  });

  menuButton.addEventListener("click", () => {
    // Toggle the visibility of the files section
    if (
      filesSection.style.display === "none" ||
      filesSection.style.display === ""
    ) {
      filesSection.style.display = "flex"; // Show files section
      document.querySelector(".app").style.display = "none";
      filesSection.style.width = "100%";
    } else {
      filesSection.style.display = "none"; // Hide files section
    }
  });
});

function audiostyles() {
  Audiofiles.forEach((x, index) => {
    let state = x.querySelector(".state");
    let playbtn = document.createElement("i");
    let pausebtn = document.createElement("i");
    let slider = x.querySelector(".slider");
    let currentTime = x.querySelector(".currentTime");
    let Ttime = x.querySelector(".Ttime");
    let audio = x.querySelector("#audio");
    let head = document.querySelector(".nav");
    let freeSpace = x.querySelector(".spacebtn");
    let fileState = "Not expanded";
    let menu = document.querySelector(".menu");
    playbtn.className = "fa fa-play fa-2x";
    pausebtn.className = "fa fa-pause fa-2x";
    pausebtn.style.display = "none";
    playbtn.addEventListener("click", togglePlayPause);
    pausebtn.addEventListener("click", togglePlayPause);
    x.querySelector(".controls").appendChild(playbtn);
    x.querySelector(".controls").appendChild(pausebtn);

    //click will collapse the player
    head.addEventListener("click", minimize);

    function minimize() {
      x.classList.remove("on");
      let seeker = x.querySelector(".seeker");
      if (seeker) {
        seeker.style.display = "none";
      }
    }
  });
}
