let books = JSON.parse(localStorage.getItem("libraryBooks")) || [];
let editIndex = -1;

function saveBooks() {
  localStorage.setItem("libraryBooks", JSON.stringify(books));
}

function addBook() {
  let bookName = document.getElementById("bookName").value.trim();
  let authorName = document.getElementById("authorName").value.trim();
  
  if (bookName === "" || authorName === "") {
    alert("Please enter book name and author name.");
    return;
  }
  
  books.push({
    name: bookName,
    author: authorName,
    issued: false
  });
  
  saveBooks();
  
  document.getElementById("bookName").value = "";
  document.getElementById("authorName").value = "";
  
  displayBooks();
  updateDashboard();
}

function displayBooks() {
  let bookList = document.getElementById("bookList");
  bookList.innerHTML = "";
  
  books.forEach(function(book, index) {
    
    let status = book.issued ? "Issued" : "Available";
    
    let actionButton = book.issued ?
      `<button onclick="returnBook(${index})">Return Book</button>` :
      `<button onclick="issueBook(${index})">Issue Book</button>`;
    
    bookList.innerHTML += `
            <div class="book">
                <h3>${book.name}</h3>
                <p>Author: ${book.author}</p>
                <p>Status: <strong>${status}</strong></p>

                ${actionButton}

                <button onclick="editBook(${index})">Edit</button>

                <button onclick="deleteBook(${index})">Delete</button>
            </div>
        `;
  });
}

function issueBook(index) {
  books[index].issued = true;
  saveBooks();
  displayBooks();
  updateDashboard();
}

function returnBook(index) {
  books[index].issued = false;
  saveBooks();
  displayBooks();
  updateDashboard();
}

function editBook(index) {
  editIndex = index;
  
  document.getElementById("editBookName").value = books[index].name;
  document.getElementById("editAuthorName").value = books[index].author;
  
  document.getElementById("editBox").style.display = "block";
}

function saveEdit() {
  let newName = document.getElementById("editBookName").value.trim();
  let newAuthor = document.getElementById("editAuthorName").value.trim();
  
  if (newName === "" || newAuthor === "") {
    alert("Please enter book name and author name.");
    return;
  }
  
  books[editIndex].name = newName;
  books[editIndex].author = newAuthor;
  
  saveBooks();
  
  document.getElementById("editBox").style.display = "none";
  
  displayBooks();
  updateDashboard();
}

function cancelEdit() {
  document.getElementById("editBox").style.display = "none";
}

function deleteBook(index) {
  books.splice(index, 1);
  saveBooks();
  displayBooks();
  updateDashboard();
}

function searchBook() {
  let searchText = document.getElementById("searchBook").value.toLowerCase();
  let bookList = document.getElementById("bookList");
  
  bookList.innerHTML = "";
  
  books.forEach(function(book, index) {
    
    if (book.name.toLowerCase().includes(searchText)) {
      
      let status = book.issued ? "Issued" : "Available";
      
      let actionButton = book.issued ?
        `<button onclick="returnBook(${index})">Return Book</button>` :
        `<button onclick="issueBook(${index})">Issue Book</button>`;
      
      bookList.innerHTML += `
                <div class="book">
                    <h3>${book.name}</h3>
                    <p>Author: ${book.author}</p>
                    <p>Status: <strong>${status}</strong></p>

                    ${actionButton}

                    <button onclick="editBook(${index})">Edit</button>

                    <button onclick="deleteBook(${index})">Delete</button>
                </div>
            `;
    }
  });
}

function updateDashboard() {
  let total = books.length;
  
  let issued = books.filter(function(book) {
    return book.issued;
  }).length;
  
  let available = total - issued;
  
  document.getElementById("totalBooks").innerText = total;
  document.getElementById("issuedBooks").innerText = issued;
  document.getElementById("availableBooks").innerText = available;
}

displayBooks();
updateDashboard();