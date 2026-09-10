// ===============================
// LIBRARY MANAGEMENT SYSTEM
// ===============================

// ---------- DATA ----------
let books = JSON.parse(localStorage.getItem("libraryBooks")) || [];
let students = JSON.parse(localStorage.getItem("libraryStudents")) || [];
let records = JSON.parse(localStorage.getItem("libraryRecords")) || [];

let editIndex = -1;


// ===============================
// LOGIN
// ===============================

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


// ---------- ENTER KEY LOGIN ----------

document.addEventListener("DOMContentLoaded", function () {

    let username = document.getElementById("username");
    let password = document.getElementById("password");

    if (username && password) {

        username.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                password.focus();
            }
        });

        password.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                login();
            }
        });
    }

});


// ===============================
// SAVE DATA
// ===============================

function saveAll() {

    localStorage.setItem(
        "libraryBooks",
        JSON.stringify(books)
    );

    localStorage.setItem(
        "libraryStudents",
        JSON.stringify(students)
    );

    localStorage.setItem(
        "libraryRecords",
        JSON.stringify(records)
    );
}


// ===============================
// NAVIGATION
// ===============================

function showSection(sectionName) {

    let sections = document.querySelectorAll(".section");

    sections.forEach(function (section) {
        section.style.display = "none";
    });


    let selected = document.getElementById(sectionName);

    if (selected) {
        selected.style.display = "block";
    }


    // Sidebar active button

    let buttons = document.querySelectorAll(".sidebar-menu button");

    buttons.forEach(function (button) {
        button.classList.remove("active");
    });


    buttons.forEach(function (button) {

        let text = button.innerText.toLowerCase();

        if (text.includes(sectionName.toLowerCase())) {
            button.classList.add("active");
        }

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ===============================
// BOOK MANAGEMENT
// ===============================

function addBook() {

    let bookName =
        document.getElementById("bookName").value.trim();

    let authorName =
        document.getElementById("authorName").value.trim();


    if (bookName === "" || authorName === "") {

        alert("Please enter book name and author name.");

        return;
    }


    books.push({

        name: bookName,

        author: authorName,

        issued: false

    });


    saveAll();


    document.getElementById("bookName").value = "";

    document.getElementById("authorName").value = "";


    displayBooks();

    updateDashboard();

    updateIssueSelectors();
}


// ===============================
// DISPLAY BOOKS
// ===============================

function displayBooks(list = books) {

    let bookList =
        document.getElementById("bookList");

    if (!bookList) return;


    bookList.innerHTML = "";


    if (list.length === 0) {

        bookList.innerHTML =
            `<div class="empty">
                No books found.
            </div>`;

        return;
    }


    list.forEach(function (book) {

        let index = books.indexOf(book);


        let status =
            book.issued
                ? "Issued"
                : "Available";


        let actionButton =
            book.issued

                ? `<button onclick="returnBook(${index})">
                    ↩ Return
                   </button>`

                : `<button onclick="quickIssue(${index})">
                    📤 Issue
                   </button>`;


        bookList.innerHTML += `

            <div class="book">

                <h3>📚 ${escapeHTML(book.name)}</h3>

                <p>
                    Author:
                    <strong>
                        ${escapeHTML(book.author)}
                    </strong>
                </p>

                <p>
                    Status:
                    <strong class="${book.issued ? "issued" : "available"}">
                        ${status}
                    </strong>
                </p>

                ${actionButton}

                <button onclick="editBook(${index})">
                    ✏ Edit
                </button>

                <button onclick="deleteBook(${index})">
                    🗑 Delete
                </button>

            </div>

        `;
    });
}


// ===============================
// SEARCH BOOK
// ===============================

function searchBook() {

    let text =
        document.getElementById("searchBook")
        .value
        .toLowerCase();


    let filtered =
        books.filter(function (book) {

            return (
                book.name.toLowerCase().includes(text) ||
                book.author.toLowerCase().includes(text)
            );

        });


    displayBooks(filtered);
}


// ===============================
// EDIT BOOK
// ===============================

function editBook(index) {

    editIndex = index;


    document.getElementById("editBookName").value =
        books[index].name;


    document.getElementById("editAuthorName").value =
        books[index].author;


    document.getElementById("editBox").style.display =
        "block";
}


function saveEdit() {

    if (editIndex === -1) return;


    let newName =
        document.getElementById("editBookName")
        .value
        .trim();


    let newAuthor =
        document.getElementById("editAuthorName")
        .value
        .trim();


    if (newName === "" || newAuthor === "") {

        alert("Please enter book details.");

        return;
    }


    books[editIndex].name = newName;

    books[editIndex].author = newAuthor;


    saveAll();


    document.getElementById("editBox").style.display =
        "none";


    editIndex = -1;


    displayBooks();

    updateIssueSelectors();

    updateAll();
}


function cancelEdit() {

    document.getElementById("editBox").style.display =
        "none";

    editIndex = -1;
}


// ===============================
// DELETE BOOK
// ===============================

function deleteBook(index) {

    if (!confirm("Delete this book?")) {
        return;
    }


    // Don't delete issued book

    if (books[index].issued) {

        alert(
            "This book is currently issued. Return it first."
        );

        return;
    }


    books.splice(index, 1);

    saveAll();


    displayBooks();

    updateDashboard();

    updateIssueSelectors();
}


// ===============================
// QUICK ISSUE
// ===============================

function quickIssue(index) {

    if (books[index].issued) {

        alert("This book is already issued.");

        return;
    }


    books[index].issued = true;


    saveAll();


    displayBooks();

    updateDashboard();

    updateIssueSelectors();


    alert(
        "Book marked as Issued.\nFor complete record, use Records → Issue Book."
    );
}


// ===============================
// RETURN BOOK
// ===============================

function returnBook(index) {

    books[index].issued = false;


    // Find active record for this book

    let activeRecord =
        records.find(function (record) {

            return (
                record.bookIndex === index &&
                record.status === "Issued"
            );

        });


    if (activeRecord) {

        activeRecord.status = "Returned";

        activeRecord.returnDate =
            getTodayDate();

    }


    saveAll();


    displayBooks();

    displayRecords();

    updateDashboard();

    updateIssueSelectors();
}


// ===============================
// STUDENT MANAGEMENT
// ===============================

function addStudent() {

    let name =
        document.getElementById("studentName")
        .value
        .trim();


    let id =
        document.getElementById("studentId")
        .value
        .trim();


    let course =
        document.getElementById("studentCourse")
        .value
        .trim();


    if (name === "" || id === "" || course === "") {

        alert("Please enter all student details.");

        return;
    }


    students.push({

        name: name,

        id: id,

        course: course

    });


    saveAll();


    document.getElementById("studentName").value = "";

    document.getElementById("studentId").value = "";

    document.getElementById("studentCourse").value = "";


    displayStudents();

    updateDashboard();

    updateIssueSelectors();
}


// ===============================
// DISPLAY STUDENTS
// ===============================

function displayStudents(list = students) {

    let studentList =
        document.getElementById("studentList");

    if (!studentList) return;


    studentList.innerHTML = "";


    if (list.length === 0) {

        studentList.innerHTML =
            `<div class="empty">
                No students found.
            </div>`;

        return;
    }


    list.forEach(function (student) {

        let index = students.indexOf(student);


        studentList.innerHTML += `

            <div class="student">

                <h3>👨‍🎓 ${escapeHTML(student.name)}</h3>

                <p>
                    Student ID:
                    <strong>
                        ${escapeHTML(student.id)}
                    </strong>
                </p>

                <p>
                    Course:
                    <strong>
                        ${escapeHTML(student.course)}
                    </strong>
                </p>

                <button onclick="deleteStudent(${index})">
                    🗑 Delete
                </button>

            </div>

        `;
    });
}


// ===============================
// SEARCH STUDENT
// ===============================

function searchStudent() {

    let text =
        document.getElementById("searchStudent")
        .value
        .toLowerCase();


    let filtered =
        students.filter(function (student) {

            return (
                student.name.toLowerCase().includes(text) ||
                student.id.toLowerCase().includes(text) ||
                student.course.toLowerCase().includes(text)
            );

        });


    displayStudents(filtered);
}


// ===============================
// DELETE STUDENT
// ===============================

function deleteStudent(index) {

    if (!confirm("Delete this student?")) {
        return;
    }


    students.splice(index, 1);

    saveAll();


    displayStudents();

    updateDashboard();

    updateIssueSelectors();
}


// ===============================
// ISSUE SELECTORS
// ===============================

function updateIssueSelectors() {

    let studentSelect =
        document.getElementById("issueStudent");


    let bookSelect =
        document.getElementById("issueBook");


    if (!studentSelect || !bookSelect) {
        return;
    }


    studentSelect.innerHTML =
        `<option value="">Select Student</option>`;


    students.forEach(function (student, index) {

        studentSelect.innerHTML += `

            <option value="${index}">
                ${escapeHTML(student.name)}
                (${escapeHTML(student.id)})
            </option>

        `;

    });


    bookSelect.innerHTML =
        `<option value="">Select Available Book</option>`;


    books.forEach(function (book, index) {

        if (!book.issued) {

            bookSelect.innerHTML += `

                <option value="${index}">
                    ${escapeHTML(book.name)}
                </option>

            `;

        }

    });
}


// ===============================
// ISSUE SELECTED BOOK
// ===============================

function issueSelectedBook() {

    let studentIndex =
        document.getElementById("issueStudent").value;


    let bookIndex =
        document.getElementById("issueBook").value;


    let issueDate =
        document.getElementById("issueDate").value;


    let dueDate =
        document.getElementById("dueDate").value;


    if (
        studentIndex === "" ||
        bookIndex === "" ||
        issueDate === "" ||
        dueDate === ""
    ) {

        alert(
            "Please select student, book and dates."
        );

        return;
    }


    if (dueDate < issueDate) {

        alert(
            "Due date cannot be before issue date."
        );

        return;
    }


    let student =
        students[studentIndex];


    let book =
        books[bookIndex];


    if (book.issued) {

        alert("This book is already issued.");

        return;
    }


    // Mark book issued

    book.issued = true;


    // Create transaction record

    records.push({

        studentIndex: Number(studentIndex),

        studentName: student.name,

        studentId: student.id,

        bookIndex: Number(bookIndex),

        bookName: book.name,

        issueDate: issueDate,

        dueDate: dueDate,

        returnDate: "",

        status: "Issued"

    });


    saveAll();


    alert("Book issued successfully!");


    displayBooks();

    displayRecords();

    updateDashboard();

    updateIssueSelectors();


    // Reset form

    document.getElementById("issueStudent").value = "";

    document.getElementById("issueBook").value = "";

    document.getElementById("issueDate").value =
        getTodayDate();

    document.getElementById("dueDate").value = "";
}


// ===============================
// RECORDS
// ===============================

function displayRecords() {

    let recordList =
        document.getElementById("recordList");

    if (!recordList) return;


    recordList.innerHTML = "";


    if (records.length === 0) {

        recordList.innerHTML =
            `<div class="empty">
                No issue/return records found.
            </div>`;

        return;
    }


    records.forEach(function (record, index) {

        let statusClass =
            record.status === "Issued"
                ? "issued"
                : "available";


        recordList.innerHTML += `

            <div class="record">

                <h3>
                    📚 ${escapeHTML(record.bookName)}
                </h3>

                <p>
                    👨‍🎓 Student:
                    <strong>
                        ${escapeHTML(record.studentName)}
                    </strong>
                </p>

                <p>
                    🆔 Student ID:
                    ${escapeHTML(record.studentId)}
                </p>

                <p>
                    📅 Issue Date:
                    ${escapeHTML(record.issueDate)}
                </p>

                <p>
                    📅 Due Date:
                    ${escapeHTML(record.dueDate)}
                </p>

                ${
                    record.returnDate
                    ?
                    `<p>
                        ↩ Return Date:
                        ${escapeHTML(record.returnDate)}
                    </p>`
                    :
                    ""
                }

                <p>
                    Status:
                    <strong class="${statusClass}">
                        ${record.status}
                    </strong>
                </p>

                ${
                    record.status === "Issued"

                    ?

                    `<button onclick="returnRecord(${index})">
                        ↩ Return Book
                     </button>`

                    :

                    ""
                }

            </div>

        `;
    });
}


// ===============================
// RETURN FROM RECORD
// ===============================

function returnRecord(index) {

    let record = records[index];


    if (record.status === "Returned") {
        return;
    }


    record.status = "Returned";

    record.returnDate =
        getTodayDate();


    // Find book

    let book =
        books[record.bookIndex];


    if (book) {
        book.issued = false;
    }


    saveAll();


    displayRecords();

    displayBooks();

    updateDashboard();

    updateIssueSelectors();
}


// ===============================
// DASHBOARD
// ===============================

function updateDashboard() {

    let totalBooks =
        books.length;


    let issuedBooks =
        books.filter(function (book) {

            return book.issued;

        }).length;


    let availableBooks =
        totalBooks - issuedBooks;


    let totalStudents =
        students.length;


    let totalElement =
        document.getElementById("totalBooks");


    let issuedElement =
        document.getElementById("issuedBooks");


    let availableElement =
        document.getElementById("availableBooks");


    let studentsElement =
        document.getElementById("totalStudents");


    if (totalElement) {

        totalElement.innerText =
            totalBooks;

    }


    if (issuedElement) {

        issuedElement.innerText =
            issuedBooks;

    }


    if (availableElement) {

        availableElement.innerText =
            availableBooks;

    }


    if (studentsElement) {

        studentsElement.innerText =
            totalStudents;

    }
}


// ===============================
// UPDATE EVERYTHING
// ===============================

function updateAll() {

    displayBooks();

    displayStudents();

    displayRecords();

    updateDashboard();

    updateIssueSelectors();
}


// ===============================
// TODAY'S DATE
// ===============================

function getTodayDate() {

    let today =
        new Date();


    let year =
        today.getFullYear();


    let month =
        String(today.getMonth() + 1)
        .padStart(2, "0");


    let day =
        String(today.getDate())
        .padStart(2, "0");


    return `${year}-${month}-${day}`;
}


// ===============================
// DEFAULT ISSUE DATE
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        let issueDate =
            document.getElementById("issueDate");


        if (issueDate) {

            issueDate.value =
                getTodayDate();

        }


        // Show dashboard by default

        let sections =
            document.querySelectorAll(".section");


        sections.forEach(function (section) {

            section.style.display = "none";

        });


        let dashboard =
            document.getElementById("dashboard");


        if (dashboard) {

            dashboard.style.display = "block";

        }

    }
);


// ===============================
// SECURITY / HTML ESCAPE
// ===============================

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}
