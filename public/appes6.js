class Book{
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


class UI{
    addBookToUI(book) {
          const list = document.getElementById("book-list");

          const row = document.createElement("tr");

          row.innerHTML = `<td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.isbn}</td>
                        <td><a href="#" class="delete">X</a></td>`;

          list.appendChild(row);
    }

    showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector(".container");
        const form = document.getElementById("book-form");

        container.insertBefore(div, form);

        // console.log(div);

        setTimeout(function () {
          document.querySelector(".alert").remove();
        }, 2000);
    }

    clearFields() {
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        isbn = document.getElementById("isbn").value = "";
    }

    deleteBook(e) {
        if (e.className === "delete") {
          e.parentElement.parentElement.remove();
        }
    }

}


class Store{
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks() {
        const books = Store.getBooks();
        
        books.forEach(book => {
            const ui = new UI;
            ui.addBookToUI(book);
        });
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn) {
        console.log(isbn);
        const books = Store.getBooks();

        books.forEach(function (book,i) {
            if (book.isbn === isbn) {
                books.splice(i, 1);
            }
        })

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event Listener
document.addEventListener('DOMContentLoader', Store.displayBooks());
document.getElementById('book-form').addEventListener('submit', function (e) {
    // Get form values
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;
    
    const book = new Book(title, author, isbn);
    //Initiate UI
    const ui = new UI();
    if (title === '' || author === '' || isbn === '') {
        ui.showAlert('Please fill the all fields','error');
    } else {
        ui.addBookToUI(book);
        Store.addBook(book);
        ui.showAlert("Book has been added", "success");
        ui.clearFields();
    }
    // console.log(book);
    e.preventDefault();
});

document.getElementById('book-list').addEventListener('click', function (e) {
    const ui = new UI();
    ui.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    ui.showAlert('Book deleted successfully', 'success');
    e.preventDefault();
})