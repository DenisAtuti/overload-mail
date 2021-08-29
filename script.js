const myStorage = window.localStorage;
let jwtToken;
let userId;

window.addEventListener("load", (e) => {
  e.preventDefault();
  loadDataFromServer();
  
});

// UNIVERSAL DOCUMENT QUERIES
// notification queries
const notificationWrapper = document.getElementById("notification-wrapper");
const notificationStatus = document.getElementById("notification-status");
const notificationMessage = document.getElementById("notification-message");
const notificationClose = document.getElementById("notification-close");

function loadDataFromServer() {
  jwtToken = myStorage.getItem("token");
  userId = myStorage.getItem("userId");

  if (jwtToken === null || userId === null) {
    window.location.href = "login.html";
  } else {
    fetch(`https://overload-test.herokuapp.com/api/users/${userId}`, {
      headers: {
        Authorization: jwtToken,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status >= 400 && response.status < 600) {
          window.location.href = "login.html";
        }
      })
      .then((data) => {
        myStorage.setItem("data", JSON.stringify(data));
        displayServerData();
        getAllWorkout();
        drawAllCharts();
      }).catch((error) =>{
        displayServerData();
        getAllWorkout();
        drawAllCharts();
      })
  }
}

// DISPLAY SERVER USER DATA
function displayServerData() {
  const data = JSON.parse(myStorage.getItem("data"));
  console.log(data);

  const profileName = document.getElementById("profile-name");
  const select = document.getElementById("exerciseName");
  const profileImage = document.getElementById("profile-image")

  profileName.innerText = data.firstName;
  profileImage.style.background = `url('https://robohash.org/${data.firstName}') no-repeat center center/cover`;

  let options = data.exercises
    .map(
      (exercise) =>
        `<option value="${exercise.exerciseName}">${exercise.exerciseName}</option>`
    )
    .join("\n");
  select.innerHTML = options;
}

const display_dropdown = document.querySelector(".display-dropdown");
const dropdown_content = document.querySelector(".dropdown-content");
const logout = document.getElementById("logout")

display_dropdown.addEventListener("click", () => {
  if (dropdown_content.style.display === "none") {
    dropdown_content.style.display = "block";
  } else {
    dropdown_content.style.display = "none";
  }
});

logout.addEventListener("click",() =>{
  myStorage.clear();
  window.location.href = "login.html";
})

// DISPLAY WORKOUT MODEL

const workoutClose = document.getElementById("close");
const workoutModel = document.getElementById("model");

workoutClose.addEventListener("click", (e) => {
  workoutModel.classList.toggle("show-workout");
  workoutClose.classList.toggle("rotate");
});

// POSTING WORKOUT TO THE SERVER
const workoutForm = document.getElementById("workoutForm");

workoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  workoutModel.classList.remove("show-workout");
  workoutClose.classList.remove("rotate");

  const workoutFormData = new FormData(workoutForm);
  const workoutFormDataSerialised = Object.fromEntries(workoutFormData);
  console.log(workoutFormDataSerialised);

  fetch(`https://overload-test.herokuapp.com/api/${userId}/workout`, {
    method: "PUT",
    headers: {
      Authorization: jwtToken,
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    body: JSON.stringify(workoutFormDataSerialised),
  })
    .then((response) => {
      if (response.ok) {
        notificationWrapper.style.transform = "translateX(0)";
        notificationWrapper.style.borderLeft = "0.5rem solid green";
        notificationStatus.innerText = "Success";
        notificationMessage.innerText = "Your exercise have been added";

        return response.json();
      } else if (response.status >= 400 && response.status < 600) {
        response.json().then((info) => {
          notificationWrapper.style.transform = "translateX(0)";
          notificationWrapper.style.borderLeft = "0.5rem solid red";
          notificationStatus.innerText = "Error";
          notificationMessage.innerText = info.message.toLowerCase();
        });
      }
    })
    .then((data) => {
      console.log(data);

    });
});

// DISPLAY ADD EXERCISE MODEL
const exerciseAddBtns = document.querySelectorAll(".exercise-add");
const exerciseModel = document.getElementById("exercise-model");
const exerciseClose = document.getElementById("close-exercise");

exerciseAddBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    exerciseModel.classList.toggle("show");
  });
});
exerciseClose.addEventListener("click", () => {
  exerciseModel.classList.remove("show");
});

// POSTING EXERCISE NAME

const exerciseForm = document.getElementById("exercise-form");

notificationClose.addEventListener("click", (e) => {
  notificationWrapper.style.transform = "translateX(-40rem)";
});

exerciseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const exerciseFormData = new FormData(exerciseForm);
  console.log(exerciseFormData);
  const exerciseFormDataSerialised = Object.fromEntries(exerciseFormData);
  console.log(exerciseFormDataSerialised);

  fetch(`https://overload-test.herokuapp.com/api/${userId}/exercise`, {
    method: "POST",
    headers: {
      Authorization: jwtToken,
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    body: JSON.stringify(exerciseFormDataSerialised),
  })
    .then((response) => {
      if (response.ok) {
        notificationWrapper.style.transform = "translateX(0)";
        notificationWrapper.style.borderLeft = "0.5rem solid green";
        notificationStatus.innerText = "Success";
        notificationMessage.innerText = "Your exercise have been added";
        return response.json();
      } else if (response.status >= 400 && response.status < 600) {
        response.json().then((info) => {
          notificationWrapper.style.transform = "translateX(0)";
          notificationWrapper.style.borderLeft = "0.5rem solid red";
          notificationStatus.innerText = "Error";
          notificationMessage.innerText = info.message.toLowerCase();
        });
      }
    })
    .then((data) => {
      console.log(data);
      loadDataFromServer();
    });
});

//GETTING ALL THE WORKOUT FUNCTION
function getAllWorkout() {
  const data = JSON.parse(myStorage.getItem("data"));
  workoutRaw = data.exercises;
  let arm = [];
  let leg = [];
  let chest = [];
  let back = [];
  let shoulder = [];

  const workouts = workoutRaw.filter((element) => {
    return element.rep != null;
  });

  workouts.forEach((workout) => {
    const bodyPart = workout.part;
    switch (bodyPart) {
      case "ARMS":
        switchRefoctor(arm, workout.dates, workout.gains);
        break;

      case "LEGS":
        switchRefoctor(leg, workout.dates, workout.gains);
        break;

      case "CHEST":
        switchRefoctor(chest, workout.dates, workout.gains);
        break;

      case "BACK":
        switchRefoctor(back, workout.dates, workout.gains);
        break;

      case "SHOULDER":
        switchRefoctor(shoulder, workout.dates, workout.gains);
        break;

      default:
        break;
    }
  });

  let body = {
    arm,
    leg,
    back,
    shoulder,
    chest,
  };

  body.arm = convertToArray(arm);
  body.leg = convertToArray(leg);
  body.back = convertToArray(back);
  body.shoulder = convertToArray(shoulder);
  body.chest = convertToArray(chest);

  console.log(body);

  return body;
}

// CONVERT BODY PARTS GAINS AND DATES INTO ARRAY
function convertToArray(body) {
  let refoctor = addAllGainsWithSameDate(body);
  let part = {
    dates: [],
    gains: [],
  };
  refoctor.forEach((element) => {
    part.dates.push(element.dates);
    part.gains.push(element.gains);
  });

  return part;
}

// SWITCH REFUCTOR
function switchRefoctor(body, dates, gains) {
  let result = bodyPartObject(dates, gains);
  result.forEach((element) => {
    let obj = {
      dates: element.dates,
      gains: element.gains,
    };
    body.push(obj);
  });

  return body;
}

// CREATION BODY PART OBJECT
function bodyPartObject(keys, values) {
  let gainInt = values.map((i) => Number(i));

  let result = [];
  keys.forEach((key, i) => {
    let obj = {
      dates: key,
      gains: gainInt[i],
    };
    result.push(obj);
  });

  return addAllGainsWithSameDate(result);
}

// ADDING UP ALL THE GAIN WITH THE SAME DATES
function addAllGainsWithSameDate(result) {
  let counts = result.reduce((prev, curr) => {
    let count = prev.get(curr.dates) || 0;
    prev.set(curr.dates, curr.gains + count);
    return prev;
  }, new Map());

  // then, map your counts object back to an array
  let reducedObjArr = [...counts].map(([dates, gains]) => {
    return { dates, gains };
  });

  return reducedObjArr;
}

const random = function(){
  const chartType = ["line", "spline", "area","scatter", "areaspline", "column", "bar"]
  let rand = chartType[(Math.random() * chartType.length) | 0]
  console.log(rand);
  return rand
}

function drawAllCharts() {
  const body = getAllWorkout();
  const arm = body.arm;
  const leg = body.leg;
  const back = body.back;
  const shoulder = body.shoulder;
  const chest = body.chest;

 

  drawCharts("arm", arm, random());
  drawCharts("chest",chest, random());
  drawCharts("shoulder",shoulder, random());
  drawCharts("back",back, random());
  drawCharts("leg",leg, random());
}

// CHARTS

function drawCharts(container, part, rand) {
  Highcharts.chart(container, {
    chart:{
      type: rand,
      zoomType:"x"
    },
    title:{
      text: container + " data"
    },
    credits:{
      // enabled: false
      text: "Hash Studio",
      href:"https://www.gethashstudio.com/"
    },
    yAxis:{
      title:{
        text:"Gains"
      }
    },
    xAxis: {
      categories: part.dates,
    },
    series: [
      {
        name: container,
        data: part.gains,
      },
    ],
  });
}
