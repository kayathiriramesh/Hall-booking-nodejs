const express = require("express")
const app = express()

app.use(express.json())

const rooms = [
    {
        name: "First Class",
        seats: 100,
        amenities: "wifi,projection screen,AC",
        price: 1500,
        roomId: "first",
        bookingDetails: [{
            customerName: "Ramesh",
            date: new Date("2023-03-10"),
            start: "09:00",
            end: "12:00",
            status: "confirmed"
        }]
    },
    {
        name: "Second Class",
        seats: 150,
        amenities: "wifi,projection screen,AC",
        price: 2500,
        roomId: "second",
        bookingDetails: [{
            customerName: "Kumar",
            date: new Date("2023-03-15"),
            start: "16:00",
            end: "18:00",
            status: "Payment Pending"
        }]
    }
]



//create room
app.post("/CreateRoom", (req, res) => {

    rooms.push({
        name: req.body.name,
        seats: req.body.seats,
        amenities: req.body.amenities,
        price: req.body.price,
        roomId: "Third",
        bookingDetails: [{}]
    })
    res.send("Room Created")
})

//List room along with booking details

app.get("/listRooms", (req, res) => {
    res.send(rooms)
})


//Book rooms
app.post("/bookRoom", (req, res, next) => {
    for (let i = 0; i < rooms.length; i++) {
        console.log("a")
        if (!(rooms[i].roomId === req.body.roomId)) {
            return res.status(400).send({ error: "Invalid" })

        }
        else {
            let booking = {
                customerName: req.body.name,
                date: new Date(req.body.date),
                start: req.body.start,
                end: req.body.end,
             
                status: "confirmed"
            }
            let result = undefined;
            rooms[i].bookingDetails.forEach((book) => {
                if (book.date.getTime() == booking.date.getTime() && book.start === booking.start) {
                    result = 0
                    console.log("in booking")
                    //  return res.status(400).send({error:"Please select different time slot"})

                }
                else {
                    result = 1
                    rooms[i].bookingDetails.push(booking)
                    // return res.status(200).send("Booking confirmed")
                }
            })
            if (result)
                return res.status(200).send("Booking confirmed")
            else
                return res.status(400).send({ error: "Please select different time slot" })

        }

    }
})


//List the customers

app.get("/listCustomer", (req, res) => {

    let customerArray = []

    rooms.forEach((room) => {
        let customerObj = { roomName: room.name }

        room.bookingDetails.forEach((customer) => {
            customerObj.customerName = customer.customerName
            customerObj.date = customer.date
            customerObj.start = customer.start
            customerObj.end = customer.end

            customerArray.push(customerObj)
        })
    })

    res.send(customerArray)

})



const port = 3050
app.listen(port, () => {
    console.log("server running in port", port)
})