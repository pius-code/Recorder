function setupAudioControls() {
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

    function togglePlayPause() {
      if (state.textContent === "paused") {
        Audiofiles.forEach((d, i) => {
          let state = d.querySelector(".state");
          d.classList.remove("on");
          let Otheraudio = d.querySelector("#audio");

          if (Otheraudio) {
            state.textContent = "paused";
            Otheraudio.pause();
          }

          let seeker = d.querySelector(".seeker");
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

        x.classList.add("on");
        x.querySelector(".seeker").style.display = "flex";
        audio.play();
        playbtn.style.display = "none";
        pausebtn.style.display = "inline";
        state.textContent = "playing";
      } else {
        audio.pause();
        playbtn.style.display = "inline";
        pausebtn.style.display = "none";
        state.textContent = "paused";
      }
    }

    // Update slider background
    slider.addEventListener("input", function () {
      let value = ((this.value - this.min) / (this.max - this.min)) * 100;
      this.style.background = `linear-gradient(to right, rgba(224, 219, 219, 0.888) ${value}%, rgba(0, 0, 0, 0.45) ${value}%)`;
    });

    // Initialize slider background on page load
    document.addEventListener("DOMContentLoaded", function () {
      let value =
        ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
      slider.style.background = `linear-gradient(to right, rgba(224, 219, 219, 0.888) ${value}%, rgba(0, 0, 0, 0.45) ${value}%)`;

      // Update time on load
      currentTime.textContent = formatTime(audio.currentTime);
      Ttime.textContent = formatTime(audio.duration);

      if (Ttime.textContent === "NaN:NaN") {
        audio.addEventListener("loadedmetadata", () => {
          Ttime.textContent = formatTime(audio.duration);
        });
      }
    });

    // Format time function
    let formatTime = (time) => {
      let min = Math.floor(time / 60);
      let sec = Math.floor(time % 60);
      return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    // Update time and slider as audio plays
    audio.addEventListener("timeupdate", () => {
      currentTime.textContent = formatTime(audio.currentTime);

      // Update slider value and if it ends send slider to beginning
      let value = (audio.currentTime / audio.duration) * 100;
      slider.value = value;
      slider.style.background = `linear-gradient(to right, rgba(224, 219, 219, 0.888) ${value}%, rgba(0, 0, 0, 0.45) ${value}%)`;
      if ((slider.value / 100) * audio.duration === audio.duration) {
        playbtn.style.display = "inline";
        pausebtn.style.display = "none";
        slider.value = 0;
        state.textContent = "paused";
      }

      // Update total time
      Ttime.textContent = formatTime(audio.duration);
    });

    // Update audio current time based on slider input
    slider.addEventListener("input", function () {
      let newTime = (this.value / 100) * audio.duration;
      audio.currentTime = newTime;
    });
    let name = x.querySelector(".nameTittle");
    name.innerHTML = `voice ${index + 1}`;
  });
}
