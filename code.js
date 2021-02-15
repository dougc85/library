const dropDown = document.getElementById('dropdown');
const formScreen = document.querySelector('.screen-dim');


dropDown.addEventListener("change", (e) => {
    
    sortLibrary(library, e.target.value);
    displayLibrary(library);
});

const body = document.querySelector('body');
let library = [];

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('close')) {
        let removedBook = e.target.parentNode;
        library.splice(removedBook.dataset.id, 1);
        removedBook.parentNode.removeChild(removedBook);
        displayLibrary(library);

    } else if (e.target.classList.contains('add-click')) {
        formScreen.classList.toggle('hide');

    } else if (e.target.classList.contains('add-button')) {
        formScreen.classList.toggle('hide');

        let title = document.querySelector('.title-field');
        let authorFirst = document.querySelector('.first-field');
        let authorSecond = document.querySelector('.second-field');
        let year = document.querySelector('.year-field');
        let pages = document.querySelector('.pages-field');
        let checkBox = document.querySelector('.check');

        let titleValue, authorFirstValue, authorSecondValue, pagesValue, yearValue, readValue;

        if (title.value == "") {
            titleValue = "{Title Unknown}";
        } else {
            titleValue = title.value;
        }

       if (authorFirst.value == "" && authorSecond.value == "") {
           authorFirstValue = "{Unknown}"; 
           authorSecondValue = "";
       } else if (authorFirst.value == "") {
           authorFirstValue = authorSecond.value;
           authorSecondValue = "";
       } else {
           authorFirstValue = authorFirst.value;
           authorSecondValue = authorSecond.value;
       }

       if (pages.value == "") {
           pagesValue = "?";
       } else {
           pagesValue = pages.value;
       }

       if (year.value == "") {
           yearValue = "?";
       } else {
           yearValue = year.value;
       }

        addBookToLibrary(titleValue, authorFirstValue, authorSecondValue, pagesValue, yearValue, checkBox.checked);
        displayLibrary(library);

        title.value = "";
        authorFirst.value = "";
        authorSecond.value = ""; 
        pages.value = ""; 
        year.value = "";
        checkBox.checked = false;

    }else if (e.target.classList.contains('switch-listen')) {
        let switchDirection = e.target;
        if (e.target.classList.contains('switcher')) {
            switchDirection = e.target.parentNode;
        }
        let targetBook = switchDirection.parentNode.parentNode;
        let bookObject = library[targetBook.dataset.id];

        if (switchDirection.classList.contains('read-switch-right')) {
            bookObject.read = false;
        } else {
            bookObject.read = true;
        }

        switchDirection.classList.toggle('read-switch-right');
        switchDirection.classList.toggle('read-switch-left');
        switchDirection.firstElementChild.classList.toggle('right-switch');
        switchDirection.firstElementChild.classList.toggle('left-switch');
        switchDirection.firstElementChild.classList.toggle('switcher');

        sortLibrary(library, dropDown.value);
        displayLibrary(library);
    }
})

function addBookToLibrary(title, authorFirst, authorLast, pages, year, read) {
    let book = new Book(title, authorFirst, authorLast, pages, year, read);
    library.push(book);
    sortLibrary(library, dropDown.value);
}

function Book(title, authorFirst, authorLast, pages, year, read) {
    this.title = title;
    this.authorFirst = authorFirst;
    this.authorLast = authorLast;
    this.pages = pages;
    this.year = year;
    this.read = read;
    this.info = () => `${title}, by ${authorFirst} ${authorLast}; ${pages} pages; ${read}`;
}

function sortLibrary(lib, method) {
    if (method == "By Date") {

        lib.sort(function(a,b) {
            let dateA = (a == "?") ? a.year : +a.year;
            let dateB = (b == "?") ? b.year : +b.year;
            let titleA = a.title.toLowerCase();
            let titleB = b.title.toLowerCase();
            
            if (dateA == dateB) {
                if (titleA > titleB) {
                    return 1;
                }
                return -1;
            } else if (dateA == "?") {
                return 1;
            } else if (dateB == "?") {
                return -1;
            } else {
                if (dateA > dateB) {

                    return 1;
                }
                return -1;
            }   
        })     
    } else if (method == "By Title") {
        lib.sort(function(a,b) {
            let titleA = a.title.toLowerCase();
            let titleB = b.title.toLowerCase();

            if (titleA.slice(0, 4) == "the ") {
                titleA = titleA.slice(4);
            }
            if (titleB.slice(0, 4) == "the ") {
                titleB = titleB.slice(4);
            }
            if (titleA.slice(0, 2) == "a ") {
                titleA = titleA.slice(2);
            }
            if (titleB.slice(0, 2) == "a ") {
                titleB = titleB.slice(2);
            }
            if (titleA.slice(0, 3) == "an ") {
                titleA = titleA.slice(3);
            }
            if (titleB.slice(0, 3) == "an ") {
                titleB = titleB.slice(3);
            }
            
            if (titleA > titleB) {
                return 1;
            }
            return -1;
            })
    } else if (method == "By Author") {
        lib.sort(function(a,b) {
            let authorLastA = a.authorLast.toLowerCase();
            let authorLastB = b.authorLast.toLowerCase();
            let authorFirstA = a.authorFirst.toLowerCase();
            let authorFirstB = b.authorFirst.toLowerCase();
            let titleA = a.title.toLowerCase();
            let titleB = b.title.toLowerCase();

            if ((authorLastA == authorLastB) && (authorFirstA == authorFirstB)) {
                if (titleA > titleB) {
                    return 1;
                }
                return -1;
            } else if (authorFirstA == "{unknown}") {
                return 1;
            } else if (authorFirstB == "{unknown}") {
                return -1;
            } else if (authorLastA == authorLastB) {
                if (authorFirstA > authorFirstB) {
                    return 1;
                }
                return -1;
            } else if (authorLastA == "") {
                if (authorFirstA > authorLastB) {
                    return 1;
                }
                return -1;
            } else if (authorLastB == "") {
                if (authorFirstB > authorLastA) {
                    return -1;
                }
                return 1;
            } else {
                if (authorLastA > authorLastB) {
                    return 1;
                }
                return -1;
            }
        })
    } else if (method == "By Read/Unread") {
        let readArray = lib.filter(book => book.read);
        let unreadArray = lib.filter(book => !book.read);

        sortLibrary(readArray, "By Title");
        sortLibrary(unreadArray, "By Title");

        library = readArray.concat(unreadArray);

    } else if (method == "By Unread/Read") {
        let readArray = lib.filter(book => book.read);
        let unreadArray = lib.filter(book => !book.read);

        sortLibrary(readArray, "By Title");
        sortLibrary(unreadArray, "By Title");

        library = unreadArray.concat(readArray);
    }
}

function displayLibrary(lib) {

    let libraryBox = document.querySelector('.library-box');
    while(libraryBox.firstChild) {
        libraryBox.removeChild(libraryBox.firstChild);
    }

    for (let i=0; i<lib.length; i++) {

        const read = lib[i].read;

        const newBook = document.createElement('div');
        newBook.classList.add('book');
        newBook.dataset.id = i;
        newBook.classList.add(read ? 'read-book' : 'unread-book');

        const close = document.createElement('h3');
        close.textContent = 'x';
        close.classList.add('close');
        newBook.appendChild(close);

        const bookText = document.createElement('div');
        bookText.classList.add('book-text');
        newBook.appendChild(bookText);

        const bookTitle = document.createElement('h2');
        bookTitle.textContent = lib[i].title;
        bookText.appendChild(bookTitle);

        const bookAuthor = document.createElement('p');
        bookAuthor.textContent = `By: ${lib[i].authorFirst} ${lib[i].authorLast}`;
        bookText.appendChild(bookAuthor);

        const bookPages = document.createElement('p');
        bookPages.textContent = `Number of pages: ${lib[i].pages.toString()}`;
        bookText.appendChild(bookPages);

        const bookYear = document.createElement('p');
        bookYear.textContent = `Year: ${lib[i].year.toString()}`;
        bookText.appendChild(bookYear);

        const bookSwitchBox = document.createElement('div');
        bookSwitchBox.classList.add('switch-box');
        newBook.appendChild(bookSwitchBox);

        const switchText = document.createElement('h4');
        switchText.classList.add('switch-text');
        switchText.textContent = (read ? 'Mark as Unread' : 'Mark as Read');
        bookSwitchBox.appendChild(switchText);

        const switchDirection = document.createElement('div');
        switchDirection.classList.add(read ? 'read-switch-right' : 'read-switch-left');
        switchDirection.classList.add('switch-listen');
        bookSwitchBox.appendChild(switchDirection);

        const switcher = document.createElement('div');
        switcher.classList.add(read ? 'right-switch' : 'left-switch');
        switcher.classList.add('switch-listen');
        switcher.classList.add('switcher');
        switchDirection.appendChild(switcher);

        

        libraryBox.appendChild(newBook);
    }

    if (lib.length % 3 !== 0) {
        let boxesLeft = (3 - lib.length % 3);

        while (boxesLeft !== 0) {
            const newBook = document.createElement('div');
            newBook.classList.add('book');
            newBook.classList.add('hidden-book');
            boxesLeft--;

            libraryBox.appendChild(newBook);
        }
    }
}

addBookToLibrary('Capital', 'Karl', 'Marx', '1000', '1860', true);
addBookToLibrary('Game of Thrones', "George R. R. ", "Martin", '800', '1992', true);
addBookToLibrary('Beowulf', '{Unknown}', '', '300', '843', true);
addBookToLibrary('Gilead', 'Marilynn', 'Robinson', '300', '2003', false);
addBookToLibrary('The Beautiful Ones', 'Prince', '', '288', '2019', false);
addBookToLibrary('Hamlet', 'William', 'Shakespeare', '215', '1604', true);
addBookToLibrary("A Connecticut Yankee in King Arthur's Court", 'Mark', 'Twain', '300', '1889', false);
addBookToLibrary("An Indigenous Peoples' History of the United States", 'Roxanne', 'Dunbar-Ortiz', '312', '2015', false);


displayLibrary(library);