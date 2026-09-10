let books = JSON.parse(localStorage.getItem("libraryBooks")) || [];
let students = JSON.parse(localStorage.getItem("libraryStudents")) || [];
let records = JSON.parse(localStorage.getItem("libraryRecords")) || [];

let editIndex = -1;


/* ================= LOGIN ================= */

function login() {
  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value.trim();

  if (username.toLowerCase() === "rishabh" && password === "1234") {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("app").style.display = "block";

    updateAll();
  } else {
    alert("Invalid username or password!");
  }
}

function logout() {
  document.getElementById("app").style.display = "none";
  document.getElementById("loginPage").style.display = "flex";

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}


/* ================= STORAGE ================= */

function saveAll() {
  localStorage.setItem("libraryBooks", JSON.stringify(books));
  localStorage.setItem("libraryStudents", JSON.stringify(students));
  localStorage.setItem("libraryRecords", JSON.stringify(records));
}


/* ================= NAVIGATION ================= */

function showSection(sectionName) {
  document.querySelectorAll(".section").forEach(function(section) {
    section.style.display = "none";
  });

  document.getElementById(sectionName).style.display = "block";

  if (sectionName === "books") {
    displayBooks();
  }

  if (sectionName === "students") {
    displayStudents();
  }

  if (sectionName === "records") {
    updateSelectors();
    displayRecords();
  }

  updateDashboard();
}


/* ================= BOOKS ================= */

function addBook() {
  let name = document.getElementById("bookName").value.trim();
  let author = document.getElementById("authorName").value.trim();

  if (name === "" || author === "") {
    alert("Please enter book name and author name.");
    return;
  }

  books.push({
    id: Date.now(),
    name: name,
    author: author,
    issued: false
  });

  saveAll();

  document.getElementById("bookName").value = "";
  document.getElementById("authorName").value = "";

  displayBooks();
  updateDashboard();

  alert("Book added successfully!");
}


function displayBooks() {
  let list = document.getElementById("bookList");
  let search = document.getElementById("searchBook").value.toLowerCase();

  list.innerHTML = "";

  let found = false;

  books.forEach(function(book, index) {

    if (!book.name.toLowerCase().includes(search)) {
      return;
    }

    found = true;

    let status = book.issued
      ? `<span class="issued">Issued</span>`
      : `<span class="available">Available</span>`;

    let action = book.issued
      ? `<button class="return" onclick="returnBook(${index})">↩ Return</button>`
      : `<button onclick="quickIssue(${index})">📖 Issue</button>`;

    list.innerHTML += `
      <div class="book">

        <h3>📕 ${escapeHTML(book.name)}</h3>

        <p><strong>Author:</strong> ${escapeHTML(book.author)}</p>

        <p><strong>Status:</strong> ${status}</p>

        ${action}

        <button class="edit" onclick="editBook(${index})">✏ Edit</button>

        <button class="delete" onclick="deleteBook(${index})">🗑 Delete</button>

      </div>
    `;
  });

  if (!found) {
    list.innerHTML = "<p>No books found.</p>";
  }
}


/* ================= QUICK ISSUE ================= */

function quickIssue(index) {

  if (students.length === 0) {
    alert("Please add a student first.");
    showSection("students");
    return;
  }

  showSection("records");

  setTimeout(function() {
    document.getElementById("issueBook").value = index;
  }, 50);
}


/* ================= EDIT BOOK ================= */

function editBook(index) {
  editIndex = index;

  document.getElementById("editBookName").value = books[index].name;
  document.getElementById("editAuthorName").value = books[index].author;

  document.getElementById("editModal").style.display = "flex";
}


function saveEdit() {
  let name = document.getElementById("editBookName").value.trim();
  let author = document.getElementById("editAuthorName").value.trim();

  if (name === "" || author === "") {
    alert("Please enter all details.");
    return;
  }

  books[editIndex].name = name;
  books[editIndex].author = author;

  saveAll();

  closeEdit();
  displayBooks();

  alert("Book updated successfully!");
}


function closeEdit() {
  document.getElementById("editModal").style.display = "none";
}


/* ================= DELETE BOOK ================= */

function deleteBook(index) {

  if (!confirm("Are you sure you want to delete this book?")) {
    return;
  }

  books.splice(index, 1);

  saveAll();

  displayBooks();
  updateDashboard();
}


/* ================= RETURN BOOK ================= */

function returnBook(index) {

  books[index].issued = false;

  let record = records.find(function(r) {
    return r.bookId === books[index].id && r.status === "Issued";
  });

  if (record) {
    record.status = "Returned";
    record.returnDate = new Date().toISOString().split("T")[0];
  }

  saveAll();

  displayBooks();
  displayRecords();
  updateDashboard();

  alert("Book returned successfully!");
}


/* ================= STUDENTS ================= */

function addStudent() {

  let name = document.getElementById("studentName").value.trim();
  let id = document.getElementById("studentId").value.trim();
  let course = document.getElementById("studentCourse").value.trim();

  if (name === "" || id === "" || course === "") {
    alert("Please enter all student details.");
    return;
  }

  students.push({
    id: Date.now(),
    studentId: id,
    name: name,
    course: course
  });

  saveAll();

  document.getElementById("studentName").value = "";
  document.getElementById("studentId").value = "";
  document.getElementById("studentCourse").value = "";

  displayStudents();
  updateDashboard();

  alert("Student added successfully!");
}


function displayStudents() {

  let list = document.getElementById("studentList");
  let search = document.getElementById("searchStudent").value.toLowerCase();

  list.innerHTML = "";

  let found = false;

  students.forEach(function(student, index) {

    if (
      !student.name.toLowerCase().includes(search) &&
      !student.studentId.toLowerCase().includes(search)
    ) {
      return;
    }

    found = true;

    list.innerHTML += `
      <div class="student">

        <h3>👨‍🎓 ${escapeHTML(student.name)}</h3>

        <p><strong>Student ID:</strong> ${escapeHTML(student.studentId)}</p>

        <p><strong>Course:</strong> ${escapeHTML(student.course)}</p>

        <button class="delete" onclick="deleteStudent(${index})">
          🗑 Delete
        </button>

      </div>
    `;
  });

  if (!found) {
    list.innerHTML = "<p>No students found.</p>";
  }
}


function deleteStudent(index) {

  if (!confirm("Delete this student?")) {
    return;
  }

  students.splice(index, 1);

  saveAll();

  displayStudents();
  updateDashboard();
}


/* ================= ISSUE BOOK ================= */

function updateSelectors() {

  let studentSelect = document.getElementById("issueStudent");
  let bookSelect = document.getElementById("issueBook");

  studentSelect.innerHTML =
    '<option value="">Select Student</option>';

  bookSelect.innerHTML =
    '<option value="">Select Available Book</option>';

  students.forEach(function(student) {

    studentSelect.innerHTML += `
      <option value="${student.id}">
        ${escapeHTML(student.name)} - ${escapeHTML(student.studentId)}
      </option>
    `;
  });

  books.forEach(function(book, index) {

    if (!book.issued) {

      bookSelect.innerHTML += `
        <option value="${index}">
          ${escapeHTML(book.name)}
        </option>
      `;
    }
  });
}


function issueSelectedBook() {

  let studentId =
    document.getElementById("issueStudent").value;

  let bookIndex =
    document.getElementById("issueBook").value;

  let issueDate =
    document.getElementById("issueDate").value;

  let dueDate =
    document.getElementById("dueDate").value;

  if (
    studentId === "" ||
    bookIndex === "" ||
    issueDate === "" ||
    dueDate === ""
  ) {
    alert("Please fill all issue details.");
    return;
  }

  let book = books[bookIndex];

  if (book.issued) {
    alert("This book is already issued.");
    return;
  }

  let student = students.find(function(s) {
    return s.id == studentId;
  });

  book.issued = true;

  records.push({
    id: Date.now(),
    bookId: book.id,
    bookName: book.name,
    studentId: student.id,
    studentName: student.name,
    issueDate: issueDate,
    dueDate: dueDate,
    status: "Issued"
  });

  saveAll();

  document.getElementById("issueStudent").value = "";
  document.getElementById("issueBook").value = "";
  document.getElementById("issueDate").value = "";
  document.getElementById("dueDate").value = "";

  updateSelectors();
  displayRecords();
  displayBooks();
  updateDashboard();

  alert("Book issued successfully!");
}


/* ================= RECORDS ================= */

function displayRecords() {

  let list = document.getElementById("recordList");

  list.innerHTML = "";

  if (records.length === 0) {
    list.innerHTML =
      "<p>No issue/return records available.</p>";
    return;
  }

  records.slice().reverse().forEach(function(record) {

    let statusClass =
      record.status === "Issued"
        ? "issued"
        : "available";

    list.innerHTML += `
      <div class="record">

        <h3>📖 ${escapeHTML(record.bookName)}</h3>

        <p>
          <strong>Student:</strong>
          ${escapeHTML(record.studentName)}
        </p>

        <p>
          <strong>Issue Date:</strong>
          ${record.issueDate}
        </p>

        <p>
          <strong>Due Date:</strong>
          ${record.dueDate}
        </p>

        ${
          record.returnDate
            ? `<p><strong>Return Date:</strong> ${record.returnDate}</p>`
            : ""
        }

        <p>
          <strong>Status:</strong>
          <span class="${statusClass}">
            ${record.status}
          </span>
        </p>

      </div>
    `;
  });
}


/* ================= DASHBOARD ================= */

function updateDashboard() {

  let total = books.length;

  let issued = books.filter(function(book) {
    return book.issued;
  }).length;

  let available = total - issued;

  document.getElementById("totalBooks").innerText = total;
  document.getElementById("issuedBooks").innerText = issued;
  document.getElementById("availableBooks").innerText = available;
  document.getElementById("totalStudents").innerText =
    students.length;
}


/* ================= SECURITY ================= */

function escapeHTML(text) {

  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* ================= UPDATE ALL ================= */

function updateAll() {

  updateDashboard();
  displayBooks();
  displayStudents();
  updateSelectors();
  displayRecords();

}


/* ================= DEFAULT DATE ================= */

window.addEventListener("DOMContentLoaded", function() {

  let today =
    new Date().toISOString().split("T")[0];

  let issueDate =
    document.getElementById("issueDate");

  if (issueDate) {
    issueDate.value = today;
  }

});



/* ================= START ================= */

updateDashboard();
/* ================= ENTER KEY LOGIN ================= */

document.addEventListener("DOMContentLoaded", function () {

  const username = document.getElementById("username");
  const password = document.getElementById("password");

  if (username && password) {

    username.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        password.focus();
      }
    });

    password.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        login();
      }
    });

  }

});
