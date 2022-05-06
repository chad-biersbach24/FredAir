const asyncHandler = require( 'express-async-handler')

const Flight = require('../models/flightModel')
const User = require('../models/userModel')
//@desc Get Flights
//@route GET /api/flights
//@access Private

const getFlights = asyncHandler(async (req, res) => {
        const filters = req.query
        const flights = await Flight.find(filters) //returns users flights, for all flights have .find() empty
        //console.log(filters)
        res.status(200).json(flights)
})

//@desc Set Flights
//@route POST /api/flights
//@access Private

const setFlight = asyncHandler(async (req, res) => {
    if(!req.body.from){
        res.status(400)
        throw new Error('Please add a flight origin')
    }

    const flight = await Flight.create({
        departure_date: req.body.departure_date,
        arrival_date: req.body.arrival_date,
        flight_id: req.body.flight_id,
        departure_time: req.body.departure_time,
        arrival_time: req.body.arrival_time,
        max_seats: req.body.max_seats,
        seats_avail: req.body.seats_avail,
        from: req.body.from,
        to: req.body.to,
    })

    res.status(200).json(flight)
})

//@desc Update Flight
//@route PUT /api/flights/:id
//@access Private

const updateFlight = asyncHandler(async (req, res) => {
const flight = await Flight.findById(req.params.id)

if(!flight) {
    res.status(400)
    throw new Error('Flight not found')
}

const user = await User.findById(req.user.id)

//check for user
if (!user){
    res.status(401)
    throw new Error('User not found')
}

//make sure the logged in user matches the goal user
if (flight.user.toString() !== user.id) {
    res.status(401)
    throw new Error('User not authorized')
}

const updatedFlight = await Flight.findByIdAndUpdate(req.params.id, req.body, {new: true,})

    res.status(200).json(updatedFlight)
})

//@desc Delete Flights
//@route DELETE /api/flights/:id
//@access Private

const deleteFlight = asyncHandler(async (req, res) => {
const flight = await Flight.findById(req.params.id)

if(!flight) {
    res.status(400)
    throw new Error('Flight not found')
}

const user = await User.findById(req.user.id)

//check for user
if(!user){
    res.status(401)
    throw new Error('User not found')
}

//make sure the logged in user matches the goal user
if(flight.user.toString() !== user.id) {
    res.status(401)
    throw new Error('User not authorized')
}

await flight.remove()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getFlights,
    setFlight,
    updateFlight,
    deleteFlight,


}