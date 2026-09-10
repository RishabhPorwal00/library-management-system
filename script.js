// ==========================================
// LIBRARY MANAGEMENT SYSTEM
// ==========================================


let books =
    JSON.parse(localStorage.getItem("libraryBooks")) || [];

let students =
    JSON.parse(localStorage.getItem("libraryStudents")) || [];

let records =
    JSON.parse(localStorage.getItem("libraryRecords")) || [];


let editIndex = -1;


// ==========================================
// SAVE ALL DATA
// ==========================================

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


// ==========================================
// LOGIN
// ==========================================

function login() {

    let username =
        document.getElementById("username").value.trim();

    let password =
        document.getElementById("password").value.trim();


    if (
        username.toLowerCase() === "rishabh" &&
        password === "1234"
    ) {

        document.getElementById("loginPage").style.display =
            "none";

        document.getElementById("app").style.display =
            "block";

        showSection("dashboard");

        updateAll();

    } else {

        alert("Invalid username or password!");

    }
}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    document.getElementById("app").style.display =
        "none";

    document.getElementById("loginPage").style.display =
        "flex";

    document.getElementById("password").value = "";

}


// ==========================================
// SHOW SECTION
// ==========================================

function showSection(sectionName) {

    let sections =
        document.querySelectorAll(".section");


    sections.forEach(function(section) {

        section.style.display = "none";

    });


    let selected =
        document.getElementById(sectionName);


    if (selected) {

        selected.style.display = "block";

    }


    let buttons =
        document.querySelectorAll(".sidebar-menu button");


    buttons.forEach(function(button) {

        button.classList.remove("active");

    });


    buttons.forEach(function(button) {

        let text =
            button.innerText.toLowerCase();


        if (
            text.includes(sectionName.toLowerCase())
        ) {

            button.classList.add("active");

        }

    });

}


// ==========================================
// ADD BOOK
// ==========================================

function addBook() {

    let bookName =
        document.getElementById("bookName").value.trim();

    let authorName =
        document.getElementById("authorName").value.trim();


    if (
        bookName === "" ||
        authorName === ""
    ) {

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


// ==========================================
// DISPLAY BOOKS
// ==========================================

function displayBooks() {

    let bookList =
        document.getElementById("bookList");


    if (!bookList) return;


    bookList.innerHTML = "";


    if (books.length === 0) {

        bookList.innerHTML = `
            <div class="empty">
                📚 No books available.
            </div>
        `;

        return;

    }


    books.forEach(function(book, index) {


        let status =
            book.issued
                ? "Issued"
                : "Available";


        let statusClass =
            book.issued
                ? "status-issued"
                : "status-available";


        let actionButton =
            book.issued

                ? `<button onclick="returnBook(${index})">
                    ↩ Return Book
                   </button>`

                : `<button onclick="quickIssue(${index})">
                    📖 Issue Book
                   </button>`;


        bookList.innerHTML += `

            <div class="book">

                <h3>
                    📚 ${escapeHTML(book.name)}
                </h3>

                <p>
                    Author:
                    ${escapeHTML(book.author)}
                </p>

                <p>
                    Status:
                    <span class="status-badge ${statusClass}">
                        ${status}
                    </span>
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


// ==========================================
// QUICK ISSUE
// ==========================================

function quickIssue(index) {

    if (!books[index]) return;


    if (books[index].issued) {

        alert("Book is already issued.");

        return;

    }


    books[index].issued = true;


    saveAll();


    displayBooks();

    updateDashboard();

    updateIssueSelectors();

}


// ==========================================
// RETURN BOOK
// ==========================================

function returnBook(index) {

    if (!books[index]) return;


    let confirmReturn =
        confirm("Are you sure you want to return this book?");


    if (!confirmReturn) return;


    books[index].issued = false;


    let activeRecord =
        records.find(function(record) {

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

    displayRecentTransactions();

    updateDashboard();

    updateIssueSelectors();

}


// ==========================================
// EDIT BOOK
// ==========================================

function editBook(index) {

    editIndex = index;


    document.getElementById("editBookName").value =
        books[index].name;


    document.getElementById("editAuthorName").value =
        books[index].author;


    document.getElementById("editBox").style.display =
        "block";

}


// ==========================================
// SAVE EDIT
// ==========================================

function saveEdit() {

    if (editIndex < 0) return;


    let newName =
        document.getElementById("editBookName")
        .value
        .trim();


    let newAuthor =
        document.getElementById("editAuthorName")
        .value
        .trim();


    if (
        newName === "" ||
        newAuthor === ""
    ) {

        alert("Please enter book name and author name.");

        return;

    }


    books[editIndex].name =
        newName;


    books[editIndex].author =
        newAuthor;


    saveAll();


    document.getElementById("editBox").style.display =
        "none";


    editIndex = -1;


    displayBooks();

}


// ==========================================
// CANCEL EDIT
// ==========================================

function cancelEdit() {

    document.getElementById("editBox").style.display =
        "none";

    editIndex = -1;

}


// ==========================================
// DELETE BOOK
// ==========================================

function deleteBook(index) {

    if (!books[index]) return;


    let confirmDelete =
        confirm(
            "Are you sure you want to delete " +
            books[index].name +
            "?"
        );


    if (!confirmDelete) return;


    books.splice(index, 1);


    saveAll();


    displayBooks();

    updateDashboard();

    updateIssueSelectors();

}


// ==========================================
// SEARCH BOOK
// ==========================================

function searchBook() {

    let searchText =
        document.getElementById("searchBook")
        .value
        .toLowerCase();


    let bookList =
        document.getElementById("bookList");


    bookList.innerHTML = "";


    books.forEach(function(book, index) {


        if (
            book.name.toLowerCase()
                .includes(searchText)

            ||

            book.author.toLowerCase()
                .includes(searchText)
        ) {


            let status =
                book.issued
                    ? "Issued"
                    : "Available";


            let statusClass =
                book.issued
                    ? "status-issued"
                    : "status-available";


            let actionButton =
                book.issued

                    ? `<button onclick="returnBook(${index})">
                        ↩ Return Book
                       </button>`

                    : `<button onclick="quickIssue(${index})">
                        📖 Issue Book
                       </button>`;


            bookList.innerHTML += `

                <div class="book">

                    <h3>
                        📚 ${escapeHTML(book.name)}
                    </h3>

                    <p>
                        Author:
                        ${escapeHTML(book.author)}
                    </p>

                    <p>
                        Status:
                        <span class="status-badge ${statusClass}">
                            ${status}
                        </span>
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

        }

    });

}


// ==========================================
// ADD STUDENT
// ==========================================

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


    if (
        name === "" ||
        id === "" ||
        course === ""
    ) {

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


// ==========================================
// DISPLAY STUDENTS
// ==========================================

function displayStudents() {

    let studentList =
        document.getElementById("studentList");


    if (!studentList) return;


    studentList.innerHTML = "";


    if (students.length === 0) {

        studentList.innerHTML = `
            <div class="empty">
                👨‍🎓 No students available.
            </div>
        `;

        return;

    }


    students.forEach(function(student, index) {


        studentList.innerHTML += `

            <div class="book">

                <h3>
                    👨‍🎓 ${escapeHTML(student.name)}
                </h3>

                <p>
                    Student ID:
                    ${escapeHTML(student.id)}
                </p>

                <p>
                    Course:
                    ${escapeHTML(student.course)}
                </p>

                <button onclick="deleteStudent(${index})">
                    🗑 Delete
                </button>

            </div>

        `;

    });

}


// ==========================================
// SEARCH STUDENT
// ==========================================

function searchStudent() {

    let searchText =
        document.getElementById("searchStudent")
        .value
        .toLowerCase();


    let studentList =
        document.getElementById("studentList");


    studentList.innerHTML = "";


    students.forEach(function(student, index) {


        if (
            student.name.toLowerCase()
                .includes(searchText)

            ||

            student.id.toLowerCase()
                .includes(searchText)

            ||

            student.course.toLowerCase()
                .includes(searchText)
        ) {


            studentList.innerHTML += `

                <div class="book">

                    <h3>
                        👨‍🎓 ${escapeHTML(student.name)}
                    </h3>

                    <p>
                        Student ID:
                        ${escapeHTML(student.id)}
                    </p>

                    <p>
                        Course:
                        ${escapeHTML(student.course)}
                    </p>

                    <button onclick="deleteStudent(${index})">
                        🗑 Delete
                    </button>

                </div>

            `;

        }

    });

}


// ==========================================
// DELETE STUDENT
// ==========================================

function deleteStudent(index) {

    if (!students[index]) return;


    let confirmDelete =
        confirm(
            "Are you sure you want to delete " +
            students[index].name +
            "?"
        );


    if (!confirmDelete) return;


    students.splice(index, 1);


    saveAll();


    displayStudents();

    updateDashboard();

    updateIssueSelectors();

}


// ==========================================
// ISSUE SELECTORS
// ==========================================

function updateIssueSelectors() {

    let studentSelect =
        document.getElementById("issueStudent");


    let bookSelect =
        document.getElementById("issueBook");


    if (!studentSelect || !bookSelect) return;


    studentSelect.innerHTML =
        `<option value="">
            Select Student
        </option>`;


    bookSelect.innerHTML =
        `<option value="">
            Select Available Book
        </option>`;


    students.forEach(function(student, index) {

        studentSelect.innerHTML += `

            <option value="${index}">
                ${escapeHTML(student.name)}
                (${escapeHTML(student.id)})
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


// ==========================================
// ISSUE SELECTED BOOK
// ==========================================

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

        alert("Please fill all issue details.");

        return;

    }


    if (
        new Date(dueDate) <
        new Date(issueDate)
    ) {

        alert("Due date cannot be before issue date.");

        return;

    }


    let book =
        books[Number(bookIndex)];


    if (!book || book.issued) {

        alert("This book is not available.");

        return;

    }


    book.issued = true;


    records.push({

        studentIndex: Number(studentIndex),

        bookIndex: Number(bookIndex),

        issueDate: issueDate,

        dueDate: dueDate,

        status: "Issued",

        returnDate: ""

    });


    saveAll();


    displayBooks();

    displayRecords();

    displayRecentTransactions();

    updateDashboard();

    updateIssueSelectors();


    alert("Book issued successfully!");

}


// ==========================================
// DISPLAY RECORDS
// ==========================================

function displayRecords() {

    let recordList =
        document.getElementById("recordList");


    if (!recordList) return;


    recordList.innerHTML = "";


    if (records.length === 0) {

        recordList.innerHTML = `
            <div class="empty">
                📋 No records available.
            </div>
        `;

        return;

    }


    records
        .slice()
        .reverse()
        .forEach(function(record) {


            let student =
                students[record.studentIndex];


            let book =
                books[record.bookIndex];


            let studentName =
                student
                    ? student.name
                    : "Unknown Student";


            let bookName =
                book
                    ? book.name
                    : "Unknown Book";


            recordList.innerHTML += `

                <div class="record">

                    <h3>
                        📖 ${escapeHTML(bookName)}
                    </h3>

                    <p>
                        Student:
                        ${escapeHTML(studentName)}
                    </p>

                    <p>
                        Issue Date:
                        ${record.issueDate}
                    </p>

                    <p>
                        Due Date:
                        ${record.dueDate}
                    </p>

                    <p>
                        Status:
                        <strong>
                            ${record.status}
                        </strong>
                    </p>

                    ${
                        record.returnDate
                        ? `
                            <p>
                                Return Date:
                                ${record.returnDate}
                            </p>
                        `
                        : ""
                    }

                </div>

            `;

        });

}


// ==========================================
// RECENT TRANSACTIONS
// ==========================================

function displayRecentTransactions() {

    let box =
        document.getElementById("recentTransactions");


    if (!box) return;


    box.innerHTML = "";


    if (records.length === 0) {

        box.innerHTML = `
            <div class="empty">
                📋 No recent transactions.
            </div>
        `;

        return;

    }


    records
        .slice(-5)
        .reverse()
        .forEach(function(record) {


            let student =
                students[record.studentIndex];


            let book =
                books[record.bookIndex];


            let studentName =
                student
                    ? student.name
                    : "Unknown Student";


            let bookName =
                book
                    ? book.name
                    : "Unknown Book";


            box.innerHTML += `

                <div class="record">

                    <h3>
                        📖 ${escapeHTML(bookName)}
                    </h3>

                    <p>
                        Student:
                        ${escapeHTML(studentName)}
                    </p>

                    <p>
                        Issue Date:
                        ${record.issueDate}
                    </p>

                    <p>
                        Due Date:
                        ${record.dueDate}
                    </p>

                    <p>
                        Status:
                        <strong>
                            ${record.status}
                        </strong>
                    </p>

                </div>

            `;

        });

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    let total =
        books.length;


    let issued =
        books.filter(function(book) {

            return book.issued;

        }).length;


    let available =
        total - issued;


    let totalStudents =
        students.length;


    let totalBooksElement =
        document.getElementById("totalBooks");


    let issuedBooksElement =
        document.getElementById("issuedBooks");


    let availableBooksElement =
        document.getElementById("availableBooks");


    let totalStudentsElement =
        document.getElementById("totalStudents");


    if (totalBooksElement)
        totalBooksElement.innerText =
            total;


    if (issuedBooksElement)
        issuedBooksElement.innerText =
            issued;


    if (availableBooksElement)
        availableBooksElement.innerText =
            available;


    if (totalStudentsElement)
        totalStudentsElement.innerText =
            totalStudents;

}


// ==========================================
// UPDATE EVERYTHING
// ==========================================

function updateAll() {

    displayBooks();

    displayStudents();

    displayRecords();

    updateDashboard();

    updateIssueSelectors();

    displayRecentTransactions();

}


// ==========================================
// TODAY DATE
// ==========================================

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


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(text) {

    let div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {


        let issueDate =
            document.getElementById("issueDate");


        if (
            issueDate &&
            !issueDate.value
        ) {

            issueDate.value =
                getTodayDate();

        }


        let username =
            document.getElementById("username");


        let password =
            document.getElementById("password");


        if (username) {

            username.addEventListener(
                "keydown",
                function(event) {

                    if (event.key === "Enter") {

                        password.focus();

                    }

                }
            );

        }


        if (password) {

            password.addEventListener(
                "keydown",
                function(event) {

                    if (event.key === "Enter") {

                        login();

                    }

                }
            );

        }

    }
);
