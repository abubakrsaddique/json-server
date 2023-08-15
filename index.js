function fetchUsers() {
  fetch("http://localhost:3000/users")
    .then((response) => response.json())
    .then((users) => {
      const userTable = document.getElementById("userTable").getElementsByTagName("tbody")[0];
      userTable.innerHTML = "";

      users.forEach((user) => {
        addUserRow(user);
      });
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
}

function addUserRow(user) {
  const userTable = document.getElementById("userTable").getElementsByTagName("tbody")[0];
  const newRow = userTable.insertRow();
  newRow.setAttribute("data-id", user.id);

  const firstNameCell = newRow.insertCell(0);
  const lastNameCell = newRow.insertCell(1);
  const ageCell = newRow.insertCell(2);
  const emailCell = newRow.insertCell(3);
  const actionsCell = newRow.insertCell(4);

  firstNameCell.textContent = user.firstName;
  lastNameCell.textContent = user.lastName;
  ageCell.textContent = user.age;
  emailCell.textContent = user.email;

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => editUser(user));

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteUser(user.id));

  actionsCell.appendChild(editButton);
  actionsCell.appendChild(deleteButton);
}

function editUser(user) {
  document.getElementById("userId").value = user.id;
  document.getElementById("firstName").value = user.firstName;
  document.getElementById("lastName").value = user.lastName;
  document.getElementById("age").value = user.age;
  document.getElementById("email").value = user.email;
}

document.getElementById("userForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const userIdInput = document.getElementById("userId");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const ageInput = document.getElementById("age");
  const emailInput = document.getElementById("email");

  const userData = {
    id: userIdInput.value,
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    age: ageInput.value,
    email: emailInput.value,
  };

  if (userData.id) {
    // update the user after edit
    updateUserInDatabase(userData)
      .then(() => {
        const userRow = document.querySelector(`tr[data-id="${userData.id}"]`);
        if (userRow) {
          userRow.cells[0].textContent = userData.firstName;
          userRow.cells[1].textContent = userData.lastName;
          userRow.cells[2].textContent = userData.age;
          userRow.cells[3].textContent = userData.email;
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  } else {
    // add new user
    addUserToDatabase(userData)
      .then((newUser) => {
        addUserRow(newUser);
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  }
});

function addUserToDatabase(userData) {
  return fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  }).then((response) => response.json());
}

function updateUserInDatabase(userData) {
  return fetch(`http://localhost:3000/users/${userData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  }).then((response) => response.json());
}
function deleteUser(userId) {
fetch(`http://localhost:3000/users/${userId}`, {
method: "DELETE",
})
.then((response) => response.json())
.then((data) => {
  console.log("User deleted:", data);
  fetchUsers();
})
.catch((error) => {
  console.error("Error deleting user:", error);
});
}

// Handle form submission
document
.getElementById("userForm")
.addEventListener("submit", function (event) {
event.preventDefault();

const formData = new FormData(event.target);
const users = {
  firstName: formData.get("firstName"),
  lastName: formData.get("lastName"),
  age: formData.get("age"),
  email: formData.get("email"),
  id: Math.ceil(Math.random() + Date.now()),
};

addUser(users);
event.target.reset();
});
// Initial fetch
fetchUsers();