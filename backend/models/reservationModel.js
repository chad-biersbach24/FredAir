const mongoose = require('mongoose')

const reservationSchema = mongoose.Schema({
    confirmation_num:{
        type: String,

        required: [true, 'Please enter confirmation num'],
        unique: true

        required: [true, 'Please enter confirmation num']

    },
    name:{
        type: String,
        required: [true, 'Please enter user name']
    },
    email:{
        type: String,
        required: [true, 'Please enter user email']
    },
    flight_id:{
        type: String,
        required: [true, 'Please enter flight id']
    },
    from:{
        type: String,
        required: [true, 'Please enter flight origin']
    },
    to:{
        type: String,
        required: [true, 'Please enter flight destination']
    },
    departure_date:{
        type: Date,
        required: [true,'Please enter flight departure date']
    },
    arrival_date:{
        type: Date,
        required: [true,'Please enter flight arrival date']
    },
    departure_time:{
        type:String,
        required: [true, 'Please enter departure time']
    },
    arrival_time:{
        type:String,
        required: [true, 'Please enter arrival time']
    },
    roundtrip:{

        type: String,
        required: [false, 'Please enter "false" for one-way or "true" for roundtrip']
    },
    flight_id2:{
        type: String,
        required: [false, 'Please enter flight id']
    },
    from2:{
        type: String,
        required: [false, 'Please enter flight origin']
    },
    to2:{
        type: String,
        required: [false, 'Please enter flight destination']
    },
    departure_date2:{
        type: Date,
        required: [false,'Please enter flight departure date']
    },
    arrival_date2:{
        type: Date,
        required: [false,'Please enter flight arrival date']
    },
    departure_time2:{
        type:String,
        required: [false, 'Please enter departure time']
    },
    arrival_time2:{
        type:String,
        required: [false, 'Please enter arrival time']
        type: boolean,
        required: [true, 'Please enter "false" for one-way or "true" for roundtrip']
    },
    flight_id2:{
        type: String,
        required: [true, 'Please enter flight id']
    },
    from2:{
        type: String,
        required: [true, 'Please enter flight origin']
    },
    to2:{
        type: String,
        required: [true, 'Please enter flight destination']
    },
    departure_date2:{
        type: Date,
        required: [true,'Please enter flight departure date']
    },
    arrival_date2:{
        type: Date,
        required: [true,'Please enter flight arrival date']
    },
    departure_time2:{
        type:String,
        required: [true, 'Please enter departure time']
    },
    arrival_time2:{
        type:String,
        required: [true, 'Please enter arrival time']
    },
    amount_paid:{
        type: String,
        required: [true, 'Please enter the amount paid']
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Reservation', reservationSchema)