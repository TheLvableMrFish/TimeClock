
// Initial start
const clock = document.getElementById("clock")
const date = new Date()
clock.innerHTML = `<div>${date.toLocaleTimeString().replace(/:\d{2} /, ' ')}</div>`

const dayContainer = document.getElementById("dayContainer")

let days = [1,2,3,4,5]

days.map((item)=>(
    
))







const updateClock =()=>{
    const date = new Date()
    const time = date.toLocaleTimeString().replace(/:\d{2} /, ' ')

    setTimeout(()=>{
        clock.innerHTML = `<div>${time}</div>`
    }, 200)
}

setInterval(updateClock, 1000)


