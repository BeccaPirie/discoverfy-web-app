const menuIcon = document.querySelector('#menu-icon')
const listItems = document.querySelectorAll('.list-item')

menuIcon.addEventListener("click", () => {
    console.log("menu clicked")
    listItems.forEach(item => {
        item.classList.toggle('hide')
    })
})