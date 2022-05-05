const mongoose = require('mongoose')

const flightSchema = mongoose.Schema({
    departure_date:{
        type: Date,
        required: [true,'Please enter flight departure date']
    },
    arrival_date:{
        type: Date,
        required: [true,'Please enter flight arrival date']
    },
    flight_id:{
        type: String,
        required: [true, 'Please enter flight id']
    },
    departure_time:{
        type:String,
        required: [true, 'Please enter departure time']
    },
    arrival_time:{
        type:String,
        required: [true, 'Please enter arrival time']
    },
    max_seats:{
        type:String,
        required: [true, 'Please enter maximum seats']
    },
    seats_avail:{
        type:String,
        required: [true, 'Please enter the amount of seats available']
    },
    from:{
        type: String,
        required: [true, 'Please enter flight origin']
    },
    to:{
        type: String,
        required: [true, 'Please enter flight destination']
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Flight', flightSchema)