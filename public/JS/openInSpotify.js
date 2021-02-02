const listItem = document.querySelectorAll('.song-list-item')

export default function openInSpotify() {
    listItem.forEach(item => {
        const uri = item.dataset.uri
        item.addEventListener("click", () => {
            window.open(uri, "_self")
        })
    })
}
        