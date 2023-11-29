
const Parcels = require('../../../models/Parcels');


const getStatistics = async (req, res) => {
    const result = await Parcels.aggregate([

      {
        $group : {
          _id : '$booking_date',
          totalBooking : { $sum : 1}
        }
      },
      {
        $sort: {
          totalBooking: -1
        }
      },
      {
        $project :{
          _id: 0,
          date: '$_id',
          totalBooking: 1
        }
      }

    ])
    
    const bookingByDate = [];
     result.forEach(item => {
      bookingByDate.push([item.date, item.totalBooking])
     })
     bookingByDate.unshift([ 'Date', 'Booking'])
     res.send(bookingByDate)
  }

  module.exports = getStatistics;