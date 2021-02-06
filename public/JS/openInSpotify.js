const listItem = document.querySelectorAll('.song-list-item')

// function to open song in Spotify
export default function openInSpotify() {
    listItem.forEach(item => {
        const uri = item.dataset.uri
        item.addEventListener("click", () => {
            window.open(uri, "_self")
        })
    })
}
        