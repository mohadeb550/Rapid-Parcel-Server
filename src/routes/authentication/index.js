
const generateJwtToken = require('../../api/authentication/controllers/generateJwtToken');

const router = require('express').Router();


router.post('/jwt', generateJwtToken)

module.exports = router;