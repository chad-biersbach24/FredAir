const express = require('express')
const router = express.Router()
const {
    getReservations,
    setReservation,
    deleteReservation,
    } = require('../controllers/reservationController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getReservations).post(protect, setReservation)
router.route('/:id').delete(protect, deleteReservation)

module.exports = router