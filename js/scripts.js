/*******************************
 ********Global Variables********
 ********************************/
let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US`;
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const sort = document.querySelector(".sort");

/*******************************
 ******Fetch data from API*******
 ********************************/
fetch(urlAPI)
  .then((res) => res.json())
  .then((res) => res.results)
  .then(displayEmployees)
  .catch((err) => console.log(err));

/*******************************
 **********Functions************
 ********************************/
function displayEmployees(employeeData) {
  employees = employeeData;
  // store the employee HTML as it is created
  let employeeHTML = "";

  // loop through each employee and create HTML markup
  employees.forEach((employee, index) => {
    let name = employee.name;
    let email = employee.email;
    let city = employee.location.city;
    let picture = employee.picture;

    employeeHTML += `
      <div class="card" data-index="${index}">
        <img class="avatar" src="${picture.medium}" />
        <div class="text-container">
          <h2 class="name">${name.first} ${name.last}</h2>
          <p class="email">${email}</p>
          <p class="address">${city}</p>
        </div>
      </div>
  `;
  });
  gridContainer.innerHTML = employeeHTML;
}

function displayModal(index) {
  let {
    name,
    dob,
    phone,
    email,
    location: { city, street, state, postcode },
    picture,
  } = employees[index];
  let date = new Date(dob.date);

  const modalHTML = `
    <img class="avatar" src="${picture.large}" />
    <i class="fas fa-angle-right fa-2x"></i>
    <i class="fas fa-angle-left fa-2x"></i>
    <div class="text-container">
      <h2 class="name">${name.first} ${name.last}</h2>
      <p class="email">${email}</p>
      <p class="address">${city}</p>
      <hr />
      <p>${phone}</p>
      <p class="address">${street.number} ${
    street.name
  }, ${state} ${postcode}</p>
      <p>Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
  `;

  overlay.classList.remove("hidden");
  modalContainer.innerHTML = modalHTML;

  // add event listener to move back and forth between employee data
  const rightArrow = document.querySelector(".fa-angle-right");
  const leftArrow = document.querySelector(".fa-angle-left");

  if (index === 11) {
    rightArrow.style.display = "none";
    leftArrow.addEventListener("click", () => {
      displayModal(index - 1);
    });
  } else if (index === 0) {
    leftArrow.style.display = "none";
    rightArrow.addEventListener("click", () => {
      displayModal(index + 1);
    });
  } else {
    leftArrow.addEventListener("click", () => {
      displayModal(index - 1);
    });
    rightArrow.addEventListener("click", () => {
      displayModal(index + 1);
    });
  }
}
//sort employees by last name
function sortByName() {
  const sorted = employees.sort((a, b) =>
    a.name.last.localeCompare(b.name.last)
  );
  displayEmployees(sorted);
}

/*******************************
 ********Event Listeners*********
 ********************************/
gridContainer.addEventListener("click", (e) => {
  // make sure the click is not on the gridContainer itself
  if (e.target !== gridContainer) {
    // select the card element based on its proximity to actual element clicked;
    const card = e.target.closest(".card");
    const index = parseInt(card.getAttribute("data-index"));
    displayModal(index);
  }
});

modalClose.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

sort.addEventListener("click", sortByName);
