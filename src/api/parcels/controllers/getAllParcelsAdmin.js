
const Parcels = require('../../../models/Parcels');


const getAllParcelsAdmin =  async (req, res, next) => {

    const startDateString = req.query.start;
    const endDateString = req.query.end;

  const startDateObj = new Date(startDateString);
  const endDateObj = new Date(endDateString);

  try{
    const result = await Parcels.aggregate([
      {
        $addFields: {
          // Convert the req_date field to a Date object
          converted_req_date: {
            $toDate: "$req_date"
          }
        }
      },
      {
        $match: {
          converted_req_date: {
            $gte: startDateObj,
            $lte: endDateObj
          }
        }
      },
      {
        $sort: {
          converted_req_date: -1 
        }
      }
    ])
  
      res.send(result)
  }catch(error){
    next(error);
  }

  }

  module.exports = getAllParcelsAdmin;