/* =========================================
   LIBRARY MANAGEMENT SYSTEM
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   DATA
========================================= */

let books = JSON.parse(localStorage.getItem("libraryBooks")) || [];
let students = JSON.parse(localStorage.getItem("libraryStudents")) || [];
let records = JSON.parse(localStorage.getItem("libraryRecords")) || [];

let editIndex = -1;


/* =========================================
   LOGIN
========================================= */

function login() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();


    if (
        username.toLowerCase() === "rishabh" &&
        password === "1234"
    ) {

        document.getElementById("loginPage").style.display = "none";

        document.getElementById("app").style.display = "block";

        updateAll();

        showSection("dashboard");

    } else {

        alert("Invalid username or password!");

    }

}


function logout() {

    document.getElementById("app").style.display = "none";

    document.getElementById("loginPage").style.display = "flex";

    document.getElementById("username").value = "";

    document.getElementById("password").value = "";

    document.getElementById("username").focus();

}


/* =========================================
   ENTER KEY LOGIN
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const username =
        document.getElementById("username");

    const password =
        document.getElementById("password");


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


/* =========================================
   SAVE ALL DATA
========================================= */

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


/* =========================================
   SIDEBAR NAVIGATION
========================================= */

function showSection(sectionName) {

    const sections = [
        "dashboard",
        "books",
        "students",
        "records"
    ];


    /* Hide all sections */

    sections.forEach(function (section) {

        const element =
            document.getElementById(section);

        if (element) {

            element.style.display =
                section === sectionName
                    ? "block"
                    : "none";

        }

    });


    /* Remove active from all buttons */

    const menuButtons =
        document.querySelectorAll(
            ".sidebar-menu button"
        );


    menuButtons.forEach(function (button) {

        button.classList.remove("active");

    });


    /* Add active to selected button */

    menuButtons.forEach(function (button) {

        const text =
            button.innerText.toLowerCase();


        if (
            sectionName === "dashboard" &&
            text.includes("dashboard")
        ) {

            button.classList.add("active");

        }


        if (
            sectionName === "books" &&
            text.includes("books")
        ) {

            button.classList.add("active");

        }


        if (
            sectionName === "students" &&
            text.includes("students")
        ) {

            button.classList.add("active");

        }


        if (
            sectionName === "records" &&
            text.includes("issue records")
        ) {

            button.classList.add("active");

        }

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   BOOK MANAGEMENT
========================================= */

function addBook() {

    const bookName =
        document.getElementById("bookName")
        .value
        .trim();


    const authorName =
        document.getElementById("authorName")
        .value
        .trim();


    if (
        bookName === "" ||
        authorName === ""
    ) {

        alert(
            "Please enter book name and author name."
        );

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

    updateIssueSelectors();

    updateDashboard();


    alert("Book added successfully!");

}


/* =========================================
   DISPLAY BOOKS
========================================= */

function displayBooks(list = books) {

    const bookList =
        document.getElementById("bookList");


    if (!bookList) return;


    bookList.innerHTML = "";


    if (list.length === 0) {

        bookList.innerHTML = `

            <div class="book">

                <h3>📚 No Books Found</h3>

                <p>
                    Add a book to get started.
                </p>

            </div>

        `;

        return;

    }


    list.forEach(function (book) {

        const index =
            books.indexOf(book);


        const status =
            book.issued
                ? "Issued"
                : "Available";


        const actionButton =
            book.issued

                ? `
                    <button
                        onclick="returnBook(${index})"
                    >
                        ↩️ Return Book
                    </button>
                  `

                : `
                    <button
                        onclick="issueBook(${index})"
                    >
                        📖 Quick Issue
                    </button>
                  `;


        bookList.innerHTML += `

            <div class="book">

                <h3>
                    📚 ${escapeHTML(book.name)}
                </h3>

                <p>
                    <strong>Author:</strong>
                    ${escapeHTML(book.author)}
                </p>

                <p>
                    <strong>Status:</strong>

                    <span class="${
                        book.issued
                            ? "issued"
                            : "available"
                    }">

                        ${status}

                    </span>

                </p>

                ${actionButton}

                <button
                    onclick="editBook(${index})"
                >
                    ✏️ Edit
                </button>

                <button
                    onclick="deleteBook(${index})"
                >
                    🗑️ Delete
                </button>

            </div>

        `;

    });

}


/* =========================================
   SEARCH BOOK
========================================= */

function searchBook() {

    const input =
        document.getElementById("searchBook");


    if (!input) return;


    const searchText =
        input.value
        .toLowerCase()
        .trim();


    const filteredBooks =
        books.filter(function (book) {

            return (

                book.name
                    .toLowerCase()
                    .includes(searchText)

                ||

                book.author
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    displayBooks(filteredBooks);

}


/* =========================================
   EDIT BOOK
========================================= */

function editBook(index) {

    editIndex = index;


    document.getElementById(
        "editBookName"
    ).value = books[index].name;


    document.getElementById(
        "editAuthorName"
    ).value = books[index].author;


    document.getElementById(
        "editBox"
    ).style.display = "block";


    document.getElementById(
        "editBookName"
    ).focus();

}


function saveEdit() {

    if (editIndex < 0) return;


    const newName =
        document.getElementById(
            "editBookName"
        ).value.trim();


    const newAuthor =
        document.getElementById(
            "editAuthorName"
        ).value.trim();


    if (
        newName === "" ||
        newAuthor === ""
    ) {

        alert(
            "Please enter book name and author name."
        );

        return;

    }


    books[editIndex].name = newName;

    books[editIndex].author = newAuthor;


    saveAll();


    document.getElementById(
        "editBox"
    ).style.display = "none";


    editIndex = -1;


    displayBooks();

    updateIssueSelectors();

    updateDashboard();


    alert("Book updated successfully!");

}


function cancelEdit() {

    document.getElementById(
        "editBox"
    ).style.display = "none";


    editIndex = -1;

}


/* =========================================
   DELETE BOOK
========================================= */

function deleteBook(index) {

    if (
        !confirm(
            "Are you sure you want to delete this book?"
        )
    ) {

        return;

    }


    books.splice(index, 1);


    saveAll();


    displayBooks();

    updateIssueSelectors();

    updateDashboard();

}


/* =========================================
   QUICK ISSUE
========================================= */

function issueBook(index) {

    if (books[index].issued) {

        alert(
            "This book is already issued."
        );

        return;

    }


    books[index].issued = true;


    saveAll();


    displayBooks();

    updateIssueSelectors();

    updateDashboard();

}


/* =========================================
   QUICK RETURN
========================================= */

function returnBook(index) {

    books[index].issued = false;


    saveAll();


    displayBooks();

    updateIssueSelectors();

    updateDashboard();

}


/* =========================================
   STUDENT MANAGEMENT
========================================= */

function addStudent() {

    const name =
        document.getElementById(
            "studentName"
        ).value.trim();


    const id =
        document.getElementById(
            "studentId"
        ).value.trim();


    const course =
        document.getElementById(
            "studentCourse"
        ).value.trim();


    if (
        name === "" ||
        id === "" ||
        course === ""
    ) {

        alert(
            "Please fill all student details."
        );

        return;

    }


    students.push({

        name: name,

        id: id,

        course: course

    });


    saveAll();


    document.getElementById(
        "studentName"
    ).value = "";


    document.getElementById(
        "studentId"
    ).value = "";


    document.getElementById(
        "studentCourse"
    ).value = "";


    displayStudents();

    updateIssueSelectors();

    updateDashboard();


    alert(
        "Student added successfully!"
    );

}


/* =========================================
   DISPLAY STUDENTS
========================================= */

function displayStudents(list = students) {

    const studentList =
        document.getElementById(
            "studentList"
        );


    if (!studentList) return;


    studentList.innerHTML = "";


    if (list.length === 0) {

        studentList.innerHTML = `

            <div class="student">

                <h3>👨‍🎓 No Students Found</h3>

                <p>
                    Add a student to get started.
                </p>

            </div>

        `;

        return;

    }


    list.forEach(function (student) {

        const index =
            students.indexOf(student);


        studentList.innerHTML += `

            <div class="student">

                <h3>
                    👨‍🎓 ${escapeHTML(student.name)}
                </h3>

                <p>
                    <strong>Student ID:</strong>
                    ${escapeHTML(student.id)}
                </p>

                <p>
                    <strong>Course:</strong>
                    ${escapeHTML(student.course)}
                </p>

                <button
                    onclick="deleteStudent(${index})"
                >
                    🗑️ Delete
                </button>

            </div>

        `;

    });

}


/* =========================================
   SEARCH STUDENT
========================================= */

function searchStudent() {

    const input =
        document.getElementById(
            "searchStudent"
        );


    if (!input) return;


    const searchText =
        input.value
        .toLowerCase()
        .trim();


    const filteredStudents =
        students.filter(function (student) {

            return (

                student.name
                    .toLowerCase()
                    .includes(searchText)

                ||

                student.id
                    .toLowerCase()
                    .includes(searchText)

                ||

                student.course
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    displayStudents(filteredStudents);

}


/* =========================================
   DELETE STUDENT
========================================= */

function deleteStudent(index) {

    if (
        !confirm(
            "Are you sure you want to delete this student?"
        )
    ) {

        return;

    }


    students.splice(index, 1);


    saveAll();


    displayStudents();

    updateIssueSelectors();

    updateDashboard();

}


/* =========================================
   ISSUE SELECTORS
========================================= */

function updateIssueSelectors() {

    const studentSelect =
        document.getElementById(
            "issueStudent"
        );


    const bookSelect =
        document.getElementById(
            "issueBook"
        );


    if (
        !studentSelect ||
        !bookSelect
    ) {

        return;

    }


    studentSelect.innerHTML =
        `
        <option value="">
            Select Student
        </option>
        `;


    students.forEach(function (
        student,
        index
    ) {

        studentSelect.innerHTML += `

            <option value="${index}">

                ${escapeHTML(student.name)}
                -
                ${escapeHTML(student.id)}

            </option>

        `;

    });


    bookSelect.innerHTML =
        `
        <option value="">
            Select Available Book
        </option>
        `;


    books.forEach(function (
        book,
        index
    ) {

        if (!book.issued) {

            bookSelect.innerHTML += `

                <option value="${index}">

                    ${escapeHTML(book.name)}
                    -
                    ${escapeHTML(book.author)}

                </option>

            `;

        }

    });

}


/* =========================================
   ISSUE SELECTED BOOK
========================================= */

function issueSelectedBook() {

    const studentIndex =
        document.getElementById(
            "issueStudent"
        ).value;


    const bookIndex =
        document.getElementById(
            "issueBook"
        ).value;


    const issueDate =
        document.getElementById(
            "issueDate"
        ).value;


    const dueDate =
        document.getElementById(
            "dueDate"
        ).value;


    if (
        studentIndex === "" ||
        bookIndex === "" ||
        issueDate === "" ||
        dueDate === ""
    ) {

        alert(
            "Please fill all issue details."
        );

        return;

    }


    if (
        new Date(dueDate) <
        new Date(issueDate)
    ) {

        alert(
            "Due date cannot be before issue date."
        );

        return;

    }


    const student =
        students[studentIndex];


    const book =
        books[bookIndex];


    if (!student || !book) {

        alert(
            "Invalid student or book."
        );

        return;

    }


    if (book.issued) {

        alert(
            "This book is already issued."
        );

        return;

    }


    book.issued = true;


    records.push({

        studentName: student.name,

        studentId: student.id,

        bookName: book.name,

        issueDate: issueDate,

        dueDate: dueDate,

        returnDate: "",

        returned: false

    });


    saveAll();


    displayBooks();

    displayRecords();

    updateIssueSelectors();

    updateDashboard();


    alert(
        "Book issued successfully!"
    );

}


/* =========================================
   DISPLAY RECORDS
========================================= */

function displayRecords() {

    const recordList =
        document.getElementById(
            "recordList"
        );


    if (!recordList) return;


    recordList.innerHTML = "";


    if (records.length === 0) {

        recordList.innerHTML = `

            <div class="record">

                <h3>
                    📋 No Records Yet
                </h3>

                <p>
                    Issue a book to create a transaction record.
                </p>

            </div>

        `;

        return;

    }


    records.forEach(function (
        record,
        index
    ) {

        const status =
            record.returned
                ? "Returned"
                : "Issued";


        recordList.innerHTML += `

            <div class="record">

                <h3>
                    📚 ${escapeHTML(record.bookName)}
                </h3>

                <p>
                    <strong>Student:</strong>
                    ${escapeHTML(record.studentName)}
                </p>

                <p>
                    <strong>Student ID:</strong>
                    ${escapeHTML(record.studentId)}
                </p>

                <p>
                    <strong>Issue Date:</strong>
                    ${escapeHTML(record.issueDate)}
                </p>

                <p>
                    <strong>Due Date:</strong>
                    ${escapeHTML(record.dueDate)}
                </p>

                <p>

                    <strong>Status:</strong>

                    <span class="${
                        record.returned
                            ? "available"
                            : "issued"
                    }">

                        ${status}

                    </span>

                </p>

                ${
                    record.returned

                    ? `

                        <p>

                            <strong>
                                Return Date:
                            </strong>

                            ${escapeHTML(
                                record.returnDate
                            )}

                        </p>

                      `

                    : `

                        <button
                            onclick="returnRecord(${index})"
                        >

                            ↩️ Return Book

                        </button>

                      `
                }

            </div>

        `;

    });

}


/* =========================================
   RETURN RECORD
========================================= */

function returnRecord(index) {

    const record =
        records[index];


    if (
        !record ||
        record.returned
    ) {

        return;

    }


    const today =
        new Date()
        .toISOString()
        .split("T")[0];


    record.returned = true;

    record.returnDate = today;


    const book =
        books.find(function (item) {

            return (
                item.name ===
                record.bookName
            );

        });


    if (book) {

        book.issued = false;

    }


    saveAll();


    displayRecords();

    displayBooks();

    updateIssueSelectors();

    updateDashboard();

}


/* =========================================
   DASHBOARD
========================================= */

function updateDashboard() {

    const total =
        books.length;


    const issued =
        books.filter(function (book) {

            return book.issued === true;

        }).length;


    const available =
        total - issued;


    const totalBooks =
        document.getElementById(
            "totalBooks"
        );


    const issuedBooks =
        document.getElementById(
            "issuedBooks"
        );


    const availableBooks =
        document.getElementById(
            "availableBooks"
        );


    const totalStudents =
        document.getElementById(
            "totalStudents"
        );


    if (totalBooks) {

        totalBooks.innerText =
            total;

    }


    if (issuedBooks) {

        issuedBooks.innerText =
            issued;

    }


    if (availableBooks) {

        availableBooks.innerText =
            available;

    }


    if (totalStudents) {

        totalStudents.innerText =
            students.length;

    }

}


/* =========================================
   UPDATE EVERYTHING
========================================= */

function updateAll() {

    displayBooks();

    displayStudents();

    displayRecords();

    updateIssueSelectors();

    updateDashboard();

    setDefaultDate();

}


/* =========================================
   DEFAULT ISSUE DATE
========================================= */

function setDefaultDate() {

    const issueDate =
        document.getElementById(
            "issueDate"
        );


    if (
        issueDate &&
        issueDate.value === ""
    ) {

        const today =
            new Date()
            .toISOString()
            .split("T")[0];


        issueDate.value =
            today;

    }

}


/* =========================================
   HTML SECURITY
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateDashboard();

        setDefaultDate();

    }
);
