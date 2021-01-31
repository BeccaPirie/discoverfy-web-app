const menuIcon = document.querySelector('#menu-icon')
const listItems = document.querySelectorAll('.list-item')
// add event listener to the navigation menu
menuIcon.addEventListener("click", () => {
    listItems.forEach(item => item.classList.toggle('hide'))
})