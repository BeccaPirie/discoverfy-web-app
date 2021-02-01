export default function playAudio() {
    // TODO change from play to pause icon
    // TODO handle no preview

    const allAudio = document.querySelectorAll('.recommend-audio')
    const previewBtns = document.querySelectorAll('.audio-btn')

    previewBtns.forEach(button => {
        button.addEventListener("click", () => {
            const parent = button.closest('.btn-right')
            const selectedAudio = parent.children[1]

            // if audio currently playing, pause
            if (button.classList.contains('playing')) {
                button.classList.remove('playing')
                selectedAudio.pause()
            }

            // otherwise, pause any other audio and play audio
            // remove the play class after 30secs when audio is complete
            else {
                allAudio.forEach(audio => {
                audio.pause()
                })
                previewBtns.forEach(button => {
                    button.classList.remove('playing')
                }) 
                button.classList.add('playing')
                selectedAudio.play()
                setTimeout(() => {
                    button.classList.remove('playing')
                }, 30000)
            }
            console.log(previewBtns)
        })
    }) 
}

