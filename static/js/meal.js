// Function to add a new day for every member in the table
function addDay() {
  // Get the table body element
  const tbody = document.querySelector("#meal-table tbody");

  // Get the current date
  const currentDate = new Date();
  const nextDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Add one day to the current date

  // Format the next date as DD/MM/YYYY
  const formattedDate = `${nextDate.getDate()}/${
    nextDate.getMonth() + 1
  }/${nextDate.getFullYear()}`;

  // Find the "Member" header cell
  const memberHeader = document.querySelector("#header-row th:first-child");

  // Create a new table header (th) element for the new day
  const newHeader = document.createElement("th");
  newHeader.textContent = formattedDate;
  newHeader.classList.add("px-4", "py-2");

  // Insert the new header after the "Member" header
  memberHeader.parentNode.insertBefore(newHeader, memberHeader.nextSibling);

  // Iterate over each row in the table body
  tbody.querySelectorAll("tr").forEach((row) => {
    // Create a new table cell (td) element
    const newCell = document.createElement("td");
    newCell.classList.add("px-4", "py-2");

    // Check if the row contains an existing member (excluding the new member row)
    if (!row.id || row.id !== "new-member-row") {
      // Create an input element for the new day
      const input = document.createElement("input");
      input.type = "number";
      input.classList.add("meal-input", "w-full");
      input.setAttribute(
        "data-member",
        row
          .querySelector("td:first-child")
          .textContent.toLowerCase()
          .replace(" ", "")
      );
      input.setAttribute("data-day", formattedDate); // Use the formatted date as the unique identifier for the new day
      input.value = "0";

      // Append the input element to the new cell
      newCell.appendChild(input);
    }

    // Find the "Total Meals" cell in the current row
    const totalMealsCell = row.querySelector("td:last-child");

    // Insert the new cell after the "Total Meals" cell
    totalMealsCell.parentNode.insertBefore(newCell, totalMealsCell.nextSibling);
  });
}

// Event listener for the "Add Meal" button
document.getElementById("add-meal-btn").addEventListener("click", addDay);






// This code is for calculating the meals.

// Variable to track if the total meals column has been added
let totalMealsColumnAdded = false;

// Function to count all meals and add a new column
function countMeals() {
  // If the total meals column has already been added, return
  if (totalMealsColumnAdded) return;

  // Get the table body element
  const tbody = document.querySelector("table tbody");

  // Calculate total meals for each member
  const totalMeals = [];
  tbody.querySelectorAll("tr").forEach((row) => {
    let total = 0;
    row.querySelectorAll(".meal-input").forEach((input) => {
      total += parseInt(input.value);
    });
    totalMeals.push(total);
  });

  // Add a new column for total meals
  const totalMealsHead = document.createElement("th");
  totalMealsHead.textContent = "Total Meals";
  document.querySelector("table thead tr").appendChild(totalMealsHead);

  // Get the number of existing members
  const numMembers = totalMeals.length;

  // Iterate over each row in the table body
  tbody.querySelectorAll("tr").forEach((row, index) => {
    // Check if the row is not the new member row
    if (!row.id || row.id !== "new-member-row") {
      // Add total meals for each member
      const totalMealsCell = document.createElement("td");
      totalMealsCell.classList.add("px-4", "py-2", "font-bold");

      // Check if the index is within the number of members to avoid adding extra rows
      if (index < numMembers) {
        totalMealsCell.textContent = totalMeals[index];
      } else {
        totalMealsCell.textContent = "0"; // Set default value for non-existing members
      }

      row.appendChild(totalMealsCell);
    }
  });

  // Set the flag to true indicating the total meals column has been added
  totalMealsColumnAdded = true;
}

// Event listener for the "Count Meals" button
document
  .getElementById("count-meals-btn")
  .addEventListener("click", countMeals);







  
// This code is for add new Member in the meal counting table
// Function to add a new member row to the table
function addMember() {
  // Get the table body element
  const tbody = document.querySelector("table tbody");

  // Prompt the user to enter the member's name
  const memberName = prompt("Enter the member's name:");

  // If the user cancels the prompt or doesn't enter a name, exit the function
  if (!memberName) return;

  // Create a new row (tr) element
  const newRow = document.createElement("tr");
  newRow.classList.add("bg-gray-100");

  // Create a new table cell (td) element for the member's name
  const nameCell = document.createElement("td");
  nameCell.classList.add("px-4", "py-2");
  nameCell.textContent = memberName;

  // Append the name cell to the new row
  newRow.appendChild(nameCell);

  // Insert the new row at the end of the table body
  tbody.appendChild(newRow);
}

// Event listener for the "Add Member" button
document.getElementById("add-member-btn").addEventListener("click", addMember);

// Function to handle adding a new member row
function addMemberRow() {
  const table = document.getElementById("meal-table");
  const newRow = document.getElementById("new-member-row");

  // Show the new member row
  newRow.classList.remove("hidden");

  // Show the table if it's hidden
  table.classList.remove("hidden");
}

// Event listener for the "Add Member" button
document
  .getElementById("add-member-btn")
  .addEventListener("click", addMemberRow);





// This is for new code - Save Data


// Array to store temporary member data
let temporaryMembers = [];

// Function to add a new member row to the table
function addMemberRow() {
  const table = document.getElementById("meal-table");
  const newRow = document.getElementById("new-member-row");

  // Show the new member row
  newRow.classList.remove("hidden");

  // Show the table if it's hidden
  table.classList.remove("hidden");
}

// Function to save temporary member data
function saveData() {
  // Send temporaryMembers array to the server
  fetch('/save_data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(temporaryMembers)
  })
  .then(response => {
    // Handle response from server
    if (response.ok) {
      // Data saved successfully
      console.log('Data saved successfully.');
      // Clear temporaryMembers array
      temporaryMembers = [];
    } else {
      // Failed to save data
      console.error('Failed to save data.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Event listener for the "Add Member" button
document.getElementById("add-member-btn").addEventListener("click", addMemberRow);

// Event listener for the "Save Data" button
document.getElementById("save-data-btn").addEventListener("click", saveData);



