const asyncHandler = require( 'express-async-handler')

const Reservation = require('../models/reservationModel')
const User = require('../models/userModel')
//@desc Get Reservations
//@route GET /api/reservations
//@access Private

const getReservations = asyncHandler(async (req, res) => {
    const reservations = await Reservation.find({ user: req.user.id }) //returns users Reservations, for all reservations have .find() empty

    res.status(200).json(reservations)
})

//@desc Set Reservation
//@route POST /api/reservations
//@access Private

const setReservation = asyncHandler(async (req, res) => {
    if(!req.body.from){
        res.status(400)
        throw new Error('Please add a reservered flight origin')
    }

    const reservation = await Reservation.create({
        confirmation_num: req.body.confirmation_num,
        name: req.body.name,
        email: req.body.email,
        flight_id: req.body.flight_id,
        from: req.body.from,
        to: req.body.to,
        departure_date: req.body.departure_date,
        arrival_date: req.body.arrival_date,
        departure_time: req.body.departure_time,
        arrival_time: req.body.arrival_time,
        roundtrip: req.body.roundtrip,
        flight_id2: req.body.flight_id2,
        from2: req.body.from2,
        to2: req.body.to2,
        departure_date2: req.body.departure_date2,
        arrival_date2: req.body.arrival_date2,
        departure_time2: req.body.departure_time2,
        arrival_time2: req.body.arrival_time2,
        amount_paid: req.body.amount_paid
        
    })

    res.status(200).json(reservation)
})

//@desc Update 
//@route PUT /api/flights/:id
//@access Private

//const updateFlight = asyncHandler(async (req, res) => {
//const flight = await Flight.findById(req.params.id)

//if(!flight) {
   // res.status(400)
  //  throw new Error('Flight not found')
//}

//const user = await User.findById(req.user.id)

//check for user
//if (!user){
  //  res.status(401)
  //  throw new Error('User not found')
//}

//make sure the logged in user matches the goal user
//if (flight.user.toString() !== user.id) {
  //  res.status(401)
  //  throw new Error('User not authorized')
//}

//const updatedFlight = await Flight.findByIdAndUpdate(req.params.id, req.body, {new: true,})

 //   res.status(200).json(updatedFlight)
//})

//@desc Delete Reservations
//@route DELETE /api/reservations/:id
//@access Private

const deleteReservation = asyncHandler(async (req, res) => {
const reservation = await Reservation.findById(req.params.id)

if(!reservation) {
    res.status(400)
    throw new Error('Flight not found')
}

const user = await User.findById(req.user.id)

//check for user
if(!user){
    res.status(401)
    throw new Error('User not found')
}

//make sure the logged in user matches the reservation user
if(reservation.user.toString() !== user.id) {
    res.status(401)
    throw new Error('User not authorized')
}

await reservation.remove()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getReservations,
    setReservation,
    deleteReservation,


}