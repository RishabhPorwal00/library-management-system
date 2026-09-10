/* ================= DATA ================= */

let books =
    JSON.parse(localStorage.getItem("librdeletearyBooks")) || [];

let students =
    JSON.parse(localStorage.getItem("libraryStudents")) || [];

let records =
    JSON.parse(localStorage.getItem("libraryRecords")) || [];

let editIndex = -1;


/* ================= LOGIN ================= */

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

        updateAll();

    } else {

        alert("Invalid username or password!");

    }

}


/* ================= LOGOUT ================= */

function logout() {

    document.getElementById("app").style.display =
        "none";

    document.getElementById("loginPage").style.display =
        "flex";

}


/* ================= SAVE DATA ================= */

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


/* ================= SECTION ================= */

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
        document.querySelectorAll(
            ".sidebar-menu button"
        );


    buttons.forEach(function(button) {

        button.classList.remove("active");

    });


    buttons.forEach(function(button) {

        let text =
            button.innerText.toLowerCase();


        if (
            text.includes(
                sectionName.toLowerCase()
            )
        ) {

            button.classList.add("active");

        }

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ================= BOOK ================= */

function addBook() {

    let bookName =
        document.getElementById("bookName")
        .value.trim();

    let authorName =
        document.getElementById("authorName")
        .value.trim();


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

    updateDashboard();

    updateIssueSelectors();

}


function displayBooks() {

    let bookList =
        document.getElementById("bookList");


    bookList.innerHTML = "";


    if (books.length === 0) {

        bookList.innerHTML =
            `<div class="empty">
                📚 No books added yet.
            </div>`;

        return;

    }


    books.forEach(function(book, index) {

        let status =
            book.issued
                ? "Issued"
                : "Available";
        let statusClass = book.issued
    ? "status-issued"
    : "status-available";
let statusClass = book.issued
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
                    ${escapeHTML(book.name)}
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


/* ================= QUICK ISSUE ================= */

function quickIssue(index) {

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


/* ================= RETURN BOOK ================= */

function returnBook(index) {

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

    updateDashboard();

    updateIssueSelectors();

}


/* ================= EDIT BOOK ================= */

function editBook(index) {

    editIndex = index;


    document.getElementById(
        "editBookName"
    ).value =
        books[index].name;


    document.getElementById(
        "editAuthorName"
    ).value =
        books[index].author;


    document.getElementById(
        "editBox"
    ).style.display =
        "block";

}


function saveEdit() {

    let newName =
        document.getElementById(
            "editBookName"
        ).value.trim();


    let newAuthor =
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


    books[editIndex].name =
        newName;

    books[editIndex].author =
        newAuthor;


    saveAll();


    document.getElementById(
        "editBox"
    ).style.display =
        "none";


    displayBooks();

    updateIssueSelectors();

}


function cancelEdit() {

    document.getElementById(
        "editBox"
    ).style.display =
        "none";

}


/* ================= DELETE BOOK ================= */

function deleteBook(index) {

    let bookName = books[index].name;

    let confirmDelete = confirm(
        "Are you sure you want to delete " + bookName + "?"
    );

    if (!confirmDelete) {
        return;
    }

    books.splice(index, 1);

    saveAll();

    displayBooks();
    updateDashboard();
    updateIssueSelectors();

}


    books.splice(index, 1);


    saveAll();


    displayBooks();

    updateDashboard();

    updateIssueSelectors();

}


/* ================= SEARCH BOOK ================= */

function searchBook() {

    let searchText =
        document.getElementById(
            "searchBook"
        ).value.toLowerCase();


    let bookList =
        document.getElementById(
            "bookList"
        );


    bookList.innerHTML = "";


    books.forEach(function(book, index) {

        if (
            book.name
                .toLowerCase()
                .includes(searchText)
        ) {

            let status =
                book.issued
                    ? "Issued"
                    : "Available";


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
                        ${escapeHTML(book.name)}
                    </h3>

                    <p>
                        Author:
                        ${escapeHTML(book.author)}
                    </p>

                    <p>
                        Status:
                        <strong>
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

        }

    });


    if (bookList.innerHTML === "") {

        bookList.innerHTML =
            `<div class="empty">
                🔍 No matching books found.
            </div>`;

    }

}


/* ================= STUDENTS ================= */

function addStudent() {

    let name =
        document.getElementById(
            "studentName"
        ).value.trim();


    let id =
        document.getElementById(
            "studentId"
        ).value.trim();


    let course =
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

    updateDashboard();

    updateIssueSelectors();

}


function displayStudents() {

    let studentList =
        document.getElementById(
            "studentList"
        );


    studentList.innerHTML = "";


    if (students.length === 0) {

        studentList.innerHTML =
            `<div class="empty">
                👨‍🎓 No students added yet.
            </div>`;

        return;

    }


    students.forEach(function(student, index) {

        studentList.innerHTML += `

            <div class="student">

                <h3>
                    ${escapeHTML(student.name)}
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


function deleteStudent(index) {

    let studentName = students[index].name;

    let confirmDelete = confirm(
        "Are you sure you want to delete " + studentName + "?"
    );

    if (!confirmDelete) {
        return;
    }

    students.splice(index, 1);

    saveAll();

    displayStudents();
    updateDashboard();
    updateIssueSelectors();
}

/* ================= SEARCH STUDENT ================= */

function searchStudent() {

    let text =
        document.getElementById(
            "searchStudent"
        ).value.toLowerCase();


    let list =
        document.getElementById(
            "studentList"
        );


    list.innerHTML = "";


    students.forEach(function(student, index) {

        if (
            student.name
                .toLowerCase()
                .includes(text) ||

            student.id
                .toLowerCase()
                .includes(text)
        ) {

            list.innerHTML += `

                <div class="student">

                    <h3>
                        ${escapeHTML(student.name)}
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


/* ================= ISSUE SELECTORS ================= */

function updateIssueSelectors() {

    let studentSelect =
        document.getElementById(
            "issueStudent"
        );


    let bookSelect =
        document.getElementById(
            "issueBook"
        );


    if (!studentSelect || !bookSelect) {
        return;
    }


    studentSelect.innerHTML =
        `<option value="">
            Select Student
        </option>`;


    students.forEach(function(student, index) {

        studentSelect.innerHTML += `

            <option value="${index}">
                ${escapeHTML(student.name)}
                (${escapeHTML(student.id)})
            </option>

        `;

    });


    bookSelect.innerHTML =
        `<option value="">
            Select Book
        </option>`;


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


/* ================= ISSUE SELECTED BOOK ================= */

function issueSelectedBook() {

    let studentIndex =
        document.getElementById(
            "issueStudent"
        ).value;


    let bookIndex =
        document.getElementById(
            "issueBook"
        ).value;


    let issueDate =
        document.getElementById(
            "issueDate"
        ).value;


    let dueDate =
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
        books[bookIndex].issued
    ) {

        alert(
            "This book is already issued."
        );

        return;

    }


    books[bookIndex].issued = true;


    records.push({

        studentIndex:
            Number(studentIndex),

        bookIndex:
            Number(bookIndex),

        issueDate:
            issueDate,

        dueDate:
            dueDate,

        status:
            "Issued",

        returnDate:
            ""

    });


    saveAll();


    displayBooks();

    displayRecords();

    updateDashboard();

    updateIssueSelectors();


    document.getElementById(
        "issueStudent"
    ).value = "";


    document.getElementById(
        "issueBook"
    ).value = "";


    alert(
        "Book issued successfully!"
    );

}


/* ================= RECORDS ================= */

function displayRecords() {

    let recordList =
        document.getElementById(
            "recordList"
        );


    recordList.innerHTML = "";


    if (records.length === 0) {

        recordList.innerHTML =
            `<div class="empty">
                📋 No transaction records yet.
            </div>`;

        return;

    }


    records.forEach(function(record) {

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


        let returnInfo =
            record.returnDate
                ? `<p>
                    Return Date:
                    ${record.returnDate}
                   </p>`
                : "";


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

                ${returnInfo}

                <p>
                    Status:
                    <strong class="record-status">
                        ${record.status}
                    </strong>
                </p>

            </div>

        `;

    });

}


/* ================= DASHBOARD ================= */

function updateDashboard() {

    let total =
        books.length;


    let issued =
        books.filter(function(book) {

            return book.issued;

        }).length;


    let available =
        total - issued;


    document.getElementById(
        "totalBooks"
    ).innerText =
        total;


    document.getElementById(
        "issuedBooks"
    ).innerText =
        issued;


    document.getElementById(
        "availableBooks"
    ).innerText =
        available;


    document.getElementById(
        "totalStudents"
    ).innerText =
        students.length;

}


/* ================= UPDATE ALL ================= */

function updateAll() {

    displayBooks();

    displayStudents();

    displayRecords();

    updateDashboard();

    updateIssueSelectors();
    
    displayRecentTransactions();

}


/* ================= TODAY DATE ================= */

function getTodayDate() {

    let today =
        new Date();


    let year =
        today.getFullYear();


    let month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    let day =
        String(
            today.getDate()
        ).padStart(2, "0");


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


let issueDateInput =
    document.getElementById(
        "issueDate"
    );


if (issueDateInput) {

    issueDateInput.value =
        getTodayDate();

}


/* ================= ENTER KEY LOGIN ================= */

document.getElementById(
    "username"
).addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            document.getElementById(
                "password"
            ).focus();

        }

    }
);


document.getElementById(
    "password"
).addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            login();

        }

    }
);


/* ================= SECURITY ================= */

function escapeHTML(text) {

    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* ================= START ================= */

showSection("dashboard");

function displayRecentTransactions() {

    let box = document.getElementById("recentTransactions");

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

    let recentRecords = records.slice(-5).reverse();

    recentRecords.forEach(function(record) {

        let student = students[record.studentIndex];
        let book = books[record.bookIndex];

        let studentName = student
            ? student.name
            : "Unknown Student";

        let bookName = book
            ? book.name
            : "Unknown Book";

        box.innerHTML += `
            <div class="record">

                <h3>📖 ${escapeHTML(bookName)}</h3>

                <p>
                    Student:
                    ${escapeHTML(studentName)}
                </p>

                <p>
                    Issue Date:
                    ${record.issueDate}
                </p>

                <p>
                    Status:
                    <strong class="record-status">
                        ${record.status}
                    </strong>
                </p>

            </div>
        `;
    });
}
