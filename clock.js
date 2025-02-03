// Initial start
const clock = document.getElementById("clock")
const date = new Date()
clock.innerHTML = `<div>${date.toLocaleTimeString().replace(/:\d{2} /, ' ')}</div>`

const updateClock =()=>{
    const date = new Date()
    const time = date.toLocaleTimeString().replace(/:\d{2} /, ' ')

    setTimeout(()=>{
        clock.innerHTML = `<div>${time}</div>`
        console.log(time)
    }, 200)
}