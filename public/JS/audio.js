const allAudio = document.querySelectorAll('.recommend-audio')
const previewBtns = document.querySelectorAll('.audio-btn')

export default function playAudio() {
    previewBtns.forEach(button => {

        // grey out items with no preview url
        const audioElement = button.nextElementSibling
        const source = audioElement.querySelector('source')
        if(!source.src.includes('mp3-preview')) {
            button.classList.add('preview-unavailable')
            return
        }
        
        // add event listener to buttons with preview url
        button.addEventListener("click", () => {
            const parent = button.closest('.btn-right')
            const selectedAudio = parent.children[1]
            const playBtn = button.firstChild

            // if audio currently playing, pause
            if (button.classList.contains('playing')) {
                button.classList.remove('playing')
                playBtn.classList.remove('fa-pause')
                playBtn.classList.add('fa-play')
                selectedAudio.pause()
            }

            // otherwise, pause any other audio and play audio
            else {
                allAudio.forEach(audio => {
                audio.pause()
                })
                previewBtns.forEach(button => {
                    button.classList.remove('playing')
                    const playBtn = button.firstChild
                    playBtn.classList.remove('fa-pause')
                    playBtn.classList.add('fa-play')
                }) 
                button.classList.add('playing')
                playBtn.classList.remove('fa-play')
                playBtn.classList.add('fa-pause')
                selectedAudio.play()
                setTimeout(() => {
                    button.classList.remove('playing')
                    playBtn.classList.remove('fa-pause')
                    playBtn.classList.add('fa-play')
                }, 30000)
            }
        })
    }) 
}

