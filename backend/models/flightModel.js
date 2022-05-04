const mongoose = require('mongoose')

const flightSchema = mongoose.Schema({
    user:{ //makes a user associated with a flight, probably dont want this
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
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