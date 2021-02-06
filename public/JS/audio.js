const allAudio = document.querySelectorAll('.recommend-audio')
const previewBtns = document.querySelectorAll('.audio-btn')

// play audio function
export default function playAudio() {
    previewBtns.forEach(button => {

        // set timout var
        var timeout

        // grey out items with no preview url and return from function
        const audioElement = button.nextElementSibling
        const source = audioElement.querySelector('source')
        if(!source.src.includes('mp3-preview')) {
            button.classList.add('preview-unavailable')
            return
        }
        
        // add event listener to buttons with preview url
        button.addEventListener("click", e => {
            e.stopPropagation()
            const parent = button.closest('.btn-right')
            const selectedAudio = parent.children[1]
            const playBtn = button.firstChild

            // if audio currently playing, pause and reset audio
            if (button.classList.contains('playing')) {
                button.classList.remove('playing')
                playBtn.classList.remove('fa-pause')
                playBtn.classList.add('fa-play')
                selectedAudio.pause()
                selectedAudio.currentTime = 0
            }

            // otherwise, pause any other audio and play audio
            // set a timeout to change the pause icon to a play icon after 30 secs
            else {
                allAudio.forEach(audio => {
                audio.pause()
                clearTimeout(timeout)
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
                timeout = setTimeout(() => {
                    button.classList.remove('playing')
                    playBtn.classList.remove('fa-pause')
                    playBtn.classList.add('fa-play')
                }, 30000)
            }
        })
    }) 
}

