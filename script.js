const STORAGE_KEY = "shiftData"

const loadShiftData =()=>{
    let data = localStorage.getItem(STORAGE_KEY)

    return data ? JSON.parse(data) : []
}

const saveShiftData =(data)=>{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const removeOldData =(data)=>{
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    return data.filter(day =>{
        const dayDate = new Date(day.date)
        return dayDate >= threeMonthsAgo
    })
}

// let days = [1,2,3,4,5]
// let shiftData = [
//     {
//         date: "2025-02-01",
//         shifts: [
//             {start: "09:00", end: "12:00"},
//             {start: "13:00", end: "17:00"},
//         ]
//     },
//     {
//         date: "2025-02-02",
//         shifts: [
//             {start: "09:00", end: "12:00"},
//             {start: "13:00", end: "17:00"},
//             {start: "18:30"},
//         ]
//     },
//     {
//         date: "2025-02-03",
//         shifts: [
//             {start: "09:00", end: "12:00"},
//             {start: "18:00",},
//         ]
//     },
// ]

const timeToMinutes =(timeStr)=>{
    const parts = timeStr.split(":")
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
}

const getCurrentTime =()=>{
    const now = new Date()
    return now.toTimeString().slice(0, 5)
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

const formatMinutes = (totalMinutes)=>{
    const hours = Math.floor(totalMinutes/ 60)
    const minutes = totalMinutes % 60
    const pad = (m)=> (m < 10 ? "0" + m : m)
    return hours + ":" + pad(minutes)
}

const renderDays=(weekDates, shiftData)=>{
    const container = document.getElementById("dayContainer")
    container.className = "day-container"
    container.innerHTML = ""

    weekDates.forEach((date) =>{
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
            const shiftEnd = shift.end || getCurrentTime()
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

const startShift =()=>{
    const now = new Date()
    const currentTime = now.toTimeString().slice(0,5)
    const currentDate = now.toISOString().slice(0,10)

    // load and purge old data first
    let data = removeOldData(loadShiftData())

    // look for at today
    let dayEntry = data.find(day => day.date === currentDate)
    if(!dayEntry){
        dayEntry = {date: currentDate, shifts: []}
        data.push(dayEntry)
    }

    // Prevent starting a new shift if theres an ongoing one
    const ongoingShift = dayEntry.shifts.find(shift => !shift.end)
    if(ongoingShift){
        alert("A shift is already in progress!")
        return
    }

    // Add a new shift with the current time as the start time
    dayEntry.shifts.push({start: currentTime})
    saveShiftData(data)
    refreshDisplay()
}

const endShift =()=>{
    const now = new Date()
    const currentTime = now.toTimeString().slice(0,5)
    const currentDate = now.toISOString().slice(0,10)

    // load and purge old data first
    let data = removeOldData(loadShiftData())

    // look for at today
    let dayEntry = data.find(day => day.date === currentDate)
    if(!dayEntry){
        alert("No shift was started yet!")
        return
    }

    // Find an ongoing shift
    const ongoingShift = dayEntry.shifts.find(shift => !shift.end)
    if(!ongoingShift){
        alert("No ongoing shift to end!")
        return
    }

    // End a current shift with the end time
    ongoingShift.end = currentTime
    saveShiftData(data)
    refreshDisplay()
}

const refreshDisplay =()=>{
    const currentSunday = getSunday(new Date())
    const weekDates = getWeekDates(currentSunday)
    const data = removeOldData(loadShiftData())
    renderDays(weekDates, data)
}


setInterval(updateClock, 1000)


document.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("startShift").addEventListener("click", startShift)
    document.getElementById("endShift").addEventListener("click", endShift)
    refreshDisplay()
})