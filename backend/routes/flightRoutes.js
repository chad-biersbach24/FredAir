const express = require('express')
const router = express.Router()
const {
    getFlights,
    setFlight,
    updateFlight,
    deleteFlight,
    } = require('../controllers/flightController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getFlights).post(protect, setFlight)
router.route('/:id').delete(protect, deleteFlight).put(protect, updateFlight)

module.exports = router