const slides = document.querySelectorAll(".slide");
const next = document.querySelector("#next");
const prev = document.querySelector("#prev");
const auto = true;
const intervalTime = 5000;
let slideInterval;

const nextSlide = () => {
  const current = document.querySelector(".current");
  current.classList.remove("current");
  if (current.nextElementSibling) {
    current.nextElementSibling.classList.add("current");
  } else {
    slides[0].classList.add("current");
  }
  //   setTimeout(() => current.classList.remove("current"));
};

const prevSlide = () => {
  const current = document.querySelector(".current");
  current.classList.remove("current");
  if (current.previousElementSibling) {
    current.previousElementSibling.classList.add("current");
  } else {
    slides[slides.length - 1].classList.add("current");
  }
  //   setTimeout(() => current.classList.remove("current"));
};

next.addEventListener("click", (e) => {
  nextSlide();
  if (auto) {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, intervalTime);
  }
});
prev.addEventListener("click", (e) => {
  prevSlide();
  if (auto) {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, intervalTime);
  }
});

if (auto) {
  slideInterval = setInterval(nextSlide, intervalTime);
}

// MODEL SCRIPT
const model = document.getElementById("model");
const close = document.getElementById("close");
const open = document.getElementById("open");

open.addEventListener("click", (e) => {
  model.classList.add("show");
});
close.addEventListener("click", (e) => {
  model.classList.remove("show");
});

// SUBMIT REGISTRATION FORM

const myForm = document.getElementById("myForm");

const myStorage = window.localStorage;

myForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(myForm);
  const formDataSerialised = Object.fromEntries(formData);
  // console.log(formDataSerialised);


  fetch("https://overload-test.herokuapp.com/api/register", {
    method: "POST",
    body: JSON.stringify(formDataSerialised),
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Authorization: "Jwt-token",
    }
  }).then(async (response) => {
    if (response.ok) {

      const token = "Bearer " + response.headers.get('Jwt-token');
      myStorage.setItem("token", token)

      console.log("successful");
      window.location.href = "index.html";
      return response.json();

    }else if((response.status >= 400 && response.status < 600) ){
      response.json().then(info =>{
        error_msg = document.getElementById("error-message");
        error_msg.style.display = "block";
        error_msg.innerText = info.message.toLowerCase();
      });
    }

  }).then( data =>{
    const userId = data.id;
    myStorage.setItem("userId",userId);
    console.log(data);

  });
});
