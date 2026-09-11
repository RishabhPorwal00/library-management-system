const defaultBooks = [
    {
        id: 1,
        title: "Java Programming",
        author: "Herbert Schildt",
        category: "Programming",
        isbn: "123456",
        quantity: 5,
        available: 5
    },
    {
        id: 2,
        title: "Python Programming",
        author: "Guido van Rossum",
        category: "Programming",
        isbn: "789012",
        quantity: 4,
        available: 4
    }
];

const defaultStudents = [
    {
        id: 1,
        name: "Rahul",
        email: "rahul@gmail.com",
        studentId: "BCA001",
        course: "BCA"
    }
];

let books = JSON.parse(localStorage.getItem("lms_books")) || defaultBooks;
let students = JSON.parse(localStorage.getItem("lms_students")) || defaultStudents;
let records = JSON.parse(localStorage.getItem("lms_records")) || [];

let currentUser = null;

function saveData() {
    localStorage.setItem("lms_books", JSON.stringify(books));
    localStorage.setItem("lms_students", JSON.stringify(students));
    localStorage.setItem("lms_records", JSON.stringify(records));
}

function login() {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const role = document.getElementById("loginRole").value;

    const error = document.getElementById("loginError");

    if (!email || !password) {
        error.innerText = "Please enter email and password.";
        return;
    }

    if (
        role === "admin" &&
        email === "admin@library.com" &&
        password === "1234"
    ) {
        currentUser = {
            name: "Rishabh",
            email: email,
            role: "admin"
        };

        startApp();
        return;
    }

    if (
        role === "student" &&
        email === "rahul@gmail.com" &&
        password === "1234"
    ) {
        currentUser = {
            name: "Rahul",
            email: email,
            role: "student",
            studentId: "BCA001"
        };

        startApp();
        return;
    }

    error.innerText = "Invalid login details.";
}

function startApp() {

    document.getElementById("loginSection").style.display = "none";
    document.getElementById("appSection").style.display = "block";

    document.getElementById("welcomeText").innerText =
        `Welcome, ${currentUser.name} 👋`;

    document.getElementById("roleText").innerText =
        `Logged in as ${currentUser.role === "admin" ? "Administrator" : "Student"}`;

    if (currentUser.role === "student") {

        document.getElementById("studentStat").style.display = "none";
        document.getElementById("studentAction").style.display = "none";
        document.getElementById("issueAction").style.display = "none";

        showPage("dashboardPage");

    } else {

        document.getElementById("studentStat").style.display = "flex";
        document.getElementById("studentAction").style.display = "block";
        document.getElementById("issueAction").style.display = "block";

        showPage("dashboardPage");
    }

    updateDashboard();
}

function logout() {

    currentUser = null;

    document.getElementById("appSection").style.display = "none";
    document.getElementById("loginSection").style.display = "flex";

    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";

    document.getElementById("loginError").innerText = "";
}

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });

    document.getElementById(pageId).style.display = "block";

    if (pageId === "booksPage") renderBooks();
    if (pageId === "studentsPage") renderStudents();
    if (pageId === "issuePage") {
        renderIssuePage();
    }
    if (pageId === "recordsPage") renderRecords();
    if (pageId === "dashboardPage") updateDashboard();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function updateDashboard() {

    const total = books.reduce(
        (sum, book) => sum + Number(book.quantity),
        0
    );

    const issued = books.reduce(
        (sum, book) => sum + (Number(book.quantity) - Number(book.available)),
        0
    );

    const available = books.reduce(
        (sum, book) => sum + Number(book.available),
        0
    );

    document.getElementById("totalBooks").innerText = total;
    document.getElementById("issuedBooks").innerText = issued;
    document.getElementById("availableBooks").innerText = available;
    document.getElementById("totalStudents").innerText = students.length;
}

function addBook() {

    const title = document.getElementById("bookTitle").value.trim();
    const author = document.getElementById("bookAuthor").value.trim();
    const category = document.getElementById("bookCategory").value.trim();
    const isbn = document.getElementById("bookISBN").value.trim();
    const quantity = Number(document.getElementById("bookQuantity").value);

    if (!title || !author || !category || !quantity) {
        alert("Please fill all required book details.");
        return;
    }

    books.push({
        id: Date.now(),
        title,
        author,
        category,
        isbn,
        quantity,
        available: quantity
    });

    saveData();

    document.getElementById("bookTitle").value = "";
    document.getElementById("bookAuthor").value = "";
    document.getElementById("bookCategory").value = "";
    document.getElementById("bookISBN").value = "";
    document.getElementById("bookQuantity").value = "";

    renderBooks();
    updateDashboard();

    alert("Book added successfully.");
}

function renderBooks() {

    const list = document.getElementById("bookList");

    const search =
        (document.getElementById("bookSearch")?.value || "")
        .toLowerCase();

    list.innerHTML = "";

    const filtered = books.filter(book =>
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search) ||
        book.category.toLowerCase().includes(search)
    );

    if (filtered.length === 0) {
        list.innerHTML = "<p>No books found.</p>";
        return;
    }

    filtered.forEach(book => {

        const issued = book.quantity - book.available;

        list.innerHTML += `
            <div class="book-card">

                <h3>📚 ${escapeHTML(book.title)}</h3>

                <p><strong>Author:</strong> ${escapeHTML(book.author)}</p>

                <p><strong>Category:</strong> ${escapeHTML(book.category)}</p>

                <p><strong>ISBN:</strong> ${escapeHTML(book.isbn || "N/A")}</p>

                <p>
                    <strong>Quantity:</strong> ${book.quantity}
                </p>

                <p>
                    <strong>Available:</strong> ${book.available}
                </p>

                <span class="status ${book.available > 0 ? "available" : "issued"}">
                    ${book.available > 0 ? "Available" : "All Issued"}
                </span>

                ${
                    currentUser?.role === "admin"
                    ? `
                        <div class="card-actions">
                            <button class="delete-btn"
                                onclick="deleteBook(${book.id})">
                                Delete
                            </button>
                        </div>
                    `
                    : ""
                }

            </div>
        `;
    });
}

function deleteBook(id) {

    const book = books.find(b => b.id === id);

    if (!book) return;

    if (book.quantity !== book.available) {
        alert("Cannot delete a book while copies are issued.");
        return;
    }

    if (!confirm("Delete this book?")) return;

    books = books.filter(b => b.id !== id);

    saveData();
    renderBooks();
    updateDashboard();
}

function addStudent() {

    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("studentEmail").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const course = document.getElementById("studentCourse").value.trim();

    if (!name || !email || !studentId || !course) {
        alert("Please fill all student details.");
        return;
    }

    if (
        students.some(
            student =>
                student.email.toLowerCase() === email.toLowerCase() ||
                student.studentId.toLowerCase() === studentId.toLowerCase()
        )
    ) {
        alert("Student already exists.");
        return;
    }

    students.push({
        id: Date.now(),
        name,
        email,
        studentId,
        course
    });

    saveData();

    document.getElementById("studentName").value = "";
    document.getElementById("studentEmail").value = "";
    document.getElementById("studentId").value = "";
    document.getElementById("studentCourse").value = "";

    renderStudents();
    updateDashboard();

    alert("Student added successfully.");
}

function renderStudents() {

    const list = document.getElementById("studentList");

    const search =
        (document.getElementById("studentSearch")?.value || "")
        .toLowerCase();

    list.innerHTML = "";

    const filtered = students.filter(student =>
        student.name.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search) ||
        student.studentId.toLowerCase().includes(search)
    );

    filtered.forEach(student => {

        list.innerHTML += `
            <div class="student-card">

                <h3>👨‍🎓 ${escapeHTML(student.name)}</h3>

                <p>Email: ${escapeHTML(student.email)}</p>

                <p>Student ID: ${escapeHTML(student.studentId)}</p>

                <p>Course: ${escapeHTML(student.course)}</p>

                <div class="card-actions">

                    <button class="delete-btn"
                        onclick="deleteStudent(${student.id})">
                        Delete
                    </button>

                </div>

            </div>
        `;
    });
}

function deleteStudent(id) {

    const hasTransaction = records.some(
        record => record.studentId === id
    );

    if (hasTransaction) {
        alert("Cannot delete student with transaction history.");
        return;
    }

    if (!confirm("Delete this student?")) return;

    students = students.filter(student => student.id !== id);

    saveData();

    renderStudents();
    updateDashboard();
}

function renderIssuePage() {

    const studentSelect = document.getElementById("issueStudent");
    const bookSelect = document.getElementById("issueBook");

    studentSelect.innerHTML =
        `<option value="">Select Student</option>`;

    students.forEach(student => {

        studentSelect.innerHTML += `
            <option value="${student.id}">
                ${escapeHTML(student.name)} - ${escapeHTML(student.studentId)}
            </option>
        `;
    });

    bookSelect.innerHTML =
        `<option value="">Select Book</option>`;

    books
        .filter(book => book.available > 0)
        .forEach(book => {

            bookSelect.innerHTML += `
                <option value="${book.id}">
                    ${escapeHTML(book.title)} (${book.available} available)
                </option>
            `;
        });

    renderIssueList();
}

function issueBook() {

    const studentId =
        Number(document.getElementById("issueStudent").value);

    const bookId =
        Number(document.getElementById("issueBook").value);

    const dueDate =
        document.getElementById("dueDate").value;

    if (!studentId || !bookId || !dueDate) {
        alert("Please select student, book and due date.");
        return;
    }

    const student =
        students.find(s => s.id === studentId);

    const book =
        books.find(b => b.id === bookId);

    if (!student || !book) return;

    const alreadyIssued = records.some(record =>
        record.studentId === studentId &&
        record.bookId === bookId &&
        record.status === "issued"
    );

    if (alreadyIssued) {
        alert("This student already has this book.");
        return;
    }

    if (book.available <= 0) {
        alert("Book is not available.");
        return;
    }

    book.available--;

    records.push({
        id: Date.now(),
        studentId,
        studentName: student.name,
        bookId,
        bookTitle: book.title,
        issueDate: today(),
        dueDate,
        returnDate: "",
        status: "issued"
    });

    saveData();

    renderIssuePage();
    updateDashboard();

    alert("Book issued successfully.");
}

function renderIssueList() {

    const list = document.getElementById("issueList");

    const active = records.filter(
        record => record.status === "issued"
    );

    list.innerHTML = "";

    if (active.length === 0) {
        list.innerHTML =
            "<div class='form-card'><p>No currently issued books.</p></div>";
        return;
    }

    active.forEach(record => {

        list.innerHTML += `
            <div class="issue-card">

                <h3>📖 ${escapeHTML(record.bookTitle)}</h3>

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

                <span class="status issued">
                    Currently Issued
                </span>

                <div class="card-actions">

                    <button class="return-btn"
                        onclick="returnBook(${record.id})">
                        Return Book
                    </button>

                </div>

            </div>
        `;
    });
}

function returnBook(recordId) {

    const record =
        records.find(record => record.id === recordId);

    if (!record || record.status !== "issued") return;

    const book =
        books.find(book => book.id === record.bookId);

    if (book) {
        book.available++;
    }

    record.status = "returned";
    record.returnDate = today();

    saveData();

    renderIssuePage();
    updateDashboard();

    alert("Book returned successfully.");
}

function renderRecords() {

    const tbody = document.getElementById("recordList");

    const search =
        (document.getElementById("recordSearch")?.value || "")
        .toLowerCase();

    tbody.innerHTML = "";

    const filtered = records.filter(record =>
        record.studentName.toLowerCase().includes(search) ||
        record.bookTitle.toLowerCase().includes(search) ||
        record.status.toLowerCase().includes(search)
    );

    if (filtered.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6">No records found.</td>
            </tr>
        `;

        return;
    }

    filtered.forEach(record => {

        tbody.innerHTML += `
            <tr>

                <td>${escapeHTML(record.studentName)}</td>

                <td>${escapeHTML(record.bookTitle)}</td>

                <td>${record.issueDate}</td>

                <td>${record.dueDate}</td>

                <td>${record.returnDate || "-"}</td>

                <td>
                    <span class="status ${
                        record.status === "issued"
                        ? "issued"
                        : "returned"
                    }">
                        ${
                            record.status === "issued"
                            ? "Issued"
                            : "Returned"
                        }
                    </span>
                </td>

            </tr>
        `;
    });
}

function today() {

    const date = new Date();

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

saveData();
