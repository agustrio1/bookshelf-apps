const storageKey = "STORAGE_KEY";

const formAddingBook = document.getElementById("inputBook");
const formSearchingBook = document.getElementById("searchBook");

const checkForStorage = () => typeof Storage !== "undefined";

const getBookList = () => (checkForStorage() ? JSON.parse(localStorage.getItem(storageKey)) || [] : []);

const putBookList = (data) => {
  if (checkForStorage()) {
    const bookData = getBookList();
    bookData.push(data);
    localStorage.setItem(storageKey, JSON.stringify(bookData));
  }
};

const updateBookList = (data) => {
  if (checkForStorage()) {
    const bookData = getBookList();
    const index = bookData.findIndex((book) => book.id === data.id);
    if (index !== -1) {
      bookData[index] = data;
      localStorage.setItem(storageKey, JSON.stringify(bookData));
    }
  }
};

const deleteBook = (id) => {
  if (checkForStorage()) {
    const bookData = getBookList();
    const filteredData = bookData.filter((book) => book.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(filteredData));
  }
};

const renderBookList = (bookData) => {
  const containerIncomplete = document.getElementById("incompleteBookshelfList");
  const containerComplete = document.getElementById("completeBookshelfList");

  containerIncomplete.innerHTML = "";
  containerComplete.innerHTML = "";

  bookData.forEach((book) => {
    const { id, title, author, year, isComplete } = book;

    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item", "select_item");

    const titleElement = document.createElement("h3");
    titleElement.textContent = title;
    titleElement.setAttribute("name", id);

    const authorElement = document.createElement("p");
    authorElement.textContent = "Penulis: " + author;

    const yearElement = document.createElement("p");
    yearElement.textContent = "Tahun: " + year;

    const containerActionItem = document.createElement("div");
    containerActionItem.classList.add("action");

    const greenButton = createButton(
      "green",
      isComplete ? "Belum selesai di Baca" : "Selesai di Baca",
      () => toggleBookStatus(book)
    );

    const redButton = createButton("red", "Hapus buku", () => showDeleteConfirmation(book.id));

    containerActionItem.append(greenButton, redButton);

    bookItem.append(titleElement, authorElement, yearElement, containerActionItem);

    if (isComplete) {
      containerComplete.appendChild(bookItem);
    } else {
      containerIncomplete.appendChild(bookItem);
      titleElement.addEventListener("click", () => handleUpdate(book));
    }
  });
};

const createButton = (className, text, eventListener) => {
  const button = document.createElement("button");
  button.classList.add(className);
  button.innerText = text;
  button.addEventListener("click", eventListener);
  return button;
};

const toggleBookStatus = (book) => {
  const updatedBook = { ...book, isComplete: !book.isComplete };
  updateBookList(updatedBook);
  renderBookList(getBookList());
};

const handleDelete = (bookId) => {
  deleteBook(bookId);
  renderBookList(getBookList());
};

const showDeleteConfirmation = (bookId) => {
  const confirmation = window.confirm("Apakah Anda yakin ingin menghapus buku ini?");
  if (confirmation) {
    deleteBook(bookId);
    renderBookList(getBookList());
  }
};

const handleUpdate = (book) => {
  document.getElementById("inputBookTitle").value = book.title;
  document.getElementById("inputBookTitle").name = book.id;
  document.getElementById("inputBookAuthor").value = book.author;
  document.getElementById("inputBookYear").value = book.year;
  document.getElementById("inputBookIsComplete").checked = book.isComplete;
};

formAddingBook.addEventListener("submit", (event) => {
  event.preventDefault();

  const idTemp = document.getElementById("inputBookTitle").name;
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  if (idTemp !== "") {
    const bookData = getBookList();
    const updatedBook = bookData.find((book) => book.id === idTemp);

    if (updatedBook) {
      updatedBook.title = title;
      updatedBook.author = author;
      updatedBook.year = year;
      updatedBook.isComplete = isComplete;

      updateBookList(updatedBook);
      ResetAllForm();
      renderBookList(getBookList());
    } else {
      console.error("Buku dengan ID tersebut tidak ditemukan.");
    }
  } else {
    const id = Date.now();
    const newBook = {
      id: id,
      title: title,
      author: author,
      year: year,
      isComplete: isComplete,
    };

    putBookList(newBook);
    renderBookList(getBookList());
  }
});

formSearchingBook.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.getElementById("searchBookTitle").value.toLowerCase();
  const bookList = getBookList().filter((book) => book.title.toLowerCase().includes(title));
  renderBookList(bookList);
});

const ResetAllForm = () => {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookTitle").name = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;
};

window.addEventListener("load", () => {
  if (!checkForStorage()) {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
    return;
  }

  const bookData = getBookList();
  renderBookList(bookData);
});
