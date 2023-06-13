const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}

function onAddItemSubmit(e){
    e.preventDefault();

    const newItem = itemInput.value;

    // Validate Input
    if (newItem === ''){
        alert('Please add an item');
        return;
    }

    // check for edit mode
    if (isEditMode){
        let itemToEdit = itemList.querySelector('.edit-mode');
        
        // remove old from localstorage
        removeItemFromStorage(itemToEdit.textContent);
        // remove 'edit-mode' from class list - WHY??
        itemToEdit.classList.remove('edit-mode');
        // remove from DOM
        itemToEdit.remove();

        isEditMode = false;
    } else {
        if(checkIfItemExists(newItem)) {
            alert('That item already exists');
            return;
        }
    }

    // create item DOM element
    addItemToDOM(newItem);
    // add item to storage
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = '';
}

function addItemToDOM(item){
    // Create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button =  createButton('remove-item btn-link text-red');

    li.appendChild(button);

    itemList.appendChild(li);
}

function createButton(classes){
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage();
    // add new item to array
    itemsFromStorage.push(item);
    // convert to JSON String
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));

    // fix update button
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item'
    formBtn.style.backgroundColor = '#333' 
}

function getItemsFromStorage() {
    let itemsFromStorage;
    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }
    return itemsFromStorage;
}

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage();
    
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;
    itemList
        .querySelectorAll('li')
        .forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');

    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item'
    itemInput.value = item.textContent;
    formBtn.style.backgroundColor = '#228B22' 
}

function removeItem(item){
    // if(e.target.parentElement.classList.contains('remove-item')){
    //     if(confirm('Are you sure?')){
    //         e.target.parentElement.parentElement.remove();
    //         const item = e.target.parentElement.parentElement.firstChild.textContent; 
    //         console.log(item);
    //         let itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    //         // remove item from array
    //         const index = itemsFromStorage.indexOf(item);
    //         if (index > -1){
    //             itemsFromStorage.splice(index, 1);
    //             if (itemsFromStorage.length === 0){
    //                 localStorage.clear();
    //             } else {
    //                 // convert to JSON String
    //                 localStorage.setItem('items', JSON.stringify(itemsFromStorage));
    //             }
    //         }

    //         checkUI();
    //     }
    // }

    if(confirm('Are you sure?')){
        // remove item from DOM
        item.remove();

        // remove item from storage
        removeItemFromStorage(item.textContent);

        // check ui
        checkUI();
    }

}

function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();
    // remove item from array
    let index = itemsFromStorage.indexOf(item);
    
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    if (itemsFromStorage.length === 0){
        // if we have no items, clear local storage
        localStorage.clear();
    } else {
        // otherwise, convert to JSON String
        localStorage.setItem('items', JSON.stringify(itemsFromStorage));
    }
}

function clearItems(e){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }
    localStorage.clear();
    checkUI();
}

function filterItems(e){
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();
    
    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if(itemName.indexOf(text) !== -1){
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    })
}

function checkUI(){
    const items = itemList.querySelectorAll('li');
    if(items.length === 0){
        clearButton.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearButton.style.display = 'block';
        itemFilter.style.display = 'block';
    }
}

// Initialize App
function init() {

    // Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearButton.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();
}

init();
// localStorage.setItem('name', 'Brad');
// console.log(localStorage.getItem('name'));
// localStorage.removeItem('name');
// localStorage.clear();

