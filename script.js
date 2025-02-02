
// Initial start
const clock = document.getElementById("clock")
const date = new Date()
clock.innerHTML = `<div>${date.toLocaleTimeString().replace(/:\d{2} /, ' ')}</div>`

let days = [1,2,3,4,5]
let shiftData = [
    {
        date: "2025-02-01",
        shifts: [
            {start: "09:00", end: "12:00"},
            {start: "13:00", end: "17:00"},
        ]
    },
    {
        date: "2025-02-02",
        shifts: [
            {start: "09:00", end: "12:00"},
            {start: "13:00", end: "17:00"},
            {start: "18:30", end: "23:00"},
        ]
    },
    {
        date: "2025-02-03",
        shifts: [
            {start: "09:00", end: "12:00"},
            {start: "18:00",},
        ]
    },
]

const timeToMinutes =(timeStr)=>{
    const parts = timeStr.split(":")
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
}

const getCUrrentTime =()=>{
    const now = new Date()
    return now.toTimeString().slice(0, 5)
}

const formatMinutes = (totalMinutes)=>{
    const hours = Math.floor(totalMinutes/ 60)
    const minutes = totalMinutes % 60
    const pad = (m)=> (m < 10 ? "0" + m : m)
    return hours + ":" + pad(minutes)
}

const getSunday =(date)=>{
    const sunday = new Date(date)
    // getDay() returns 0 (sunday) to 6 (Saturday)
    sunday.setDate(date.getDate() - date.getDay())
    return sunday
}

const getWeekDates = (sundayDate)=>{
    const dates = []
    for(let i = 0; i < 7; i++){
        const date = new Date(sundayDate)
        date.setDate(sundayDate.getDate() + i)
        dates.push(date)
    }

    return dates
}

// const getDayName = (date)=>{
//     return date.toLocaleDateString("en-US", {weekday: "long"})
// }

const renderDays=(weekDates, shiftData)=>{
    const container = document.getElementById("dayContainer")
    container.className = "day-container"
    container.innerHTML = ""

    weekDates.map((date) =>{
        // Div for each day
        const dayData = shiftData.find(day => new Date(day.date).toDateString() === date.toDateString()) || { date, shifts: []}

        const dayItem = document.createElement("div")
        dayItem.className = "day-item"

        //  Header for the date
        const dateHeader = document.createElement("div")
        dateHeader.className = "date-header"
        dateHeader.textContent = `${date.toLocaleDateString("en-US", {weekday: "short", year: "numeric", month: "short", day: "numeric"})}`
        dayItem.appendChild(dateHeader)

        // Create the timeline container (24-hour view)
        const timeLine = document.createElement("div")
        timeLine.className = "time-line day"

        // Render each shift on the time line
        dayData.shifts.map((shift) =>{
            // Calculate start in minutes and duration
            const startMinutes = timeToMinutes(shift.start)
            const shiftEnd = shift.end || getCUrrentTime()
            const endMinutes = timeToMinutes(shiftEnd)
            const duration = endMinutes - startMinutes
            const minsIn24Hours = 1440

            // Compute timeline worked hours percentages (24-hours = 1440 mintes)
            const leftPercent = (startMinutes / minsIn24Hours) * 100
            const widthPercent = (duration / minsIn24Hours) * 100

            const shiftBar = document.createElement("div")
            shiftBar.className = "hours"
            shiftBar.style.left = leftPercent + "%"
            shiftBar.style.width = widthPercent + "%"
            shiftBar.title = `${shift.start} - ${shift.end}`

            timeLine.appendChild(shiftBar)
        })

        dayItem.appendChild(timeLine)
        container.appendChild(dayItem)
    })
}




const updateClock =()=>{
    const date = new Date()
    const time = date.toLocaleTimeString().replace(/:\d{2} /, ' ')

    setTimeout(()=>{
        clock.innerHTML = `<div>${time}</div>`
        console.log(time)
    }, 200)
}

setInterval(updateClock, 1000)


document.addEventListener("DOMContentLoaded", ()=>{
    const currentSunday = getSunday(new Date())
    const weekDates = getWeekDates(currentSunday)

    const filteredShifts = weekDates.map(date=>({
        date,
        shifts: shiftData.find(day => day.date === date)?.shifts || []
    }))

    renderDays(weekDates, shiftData)
})