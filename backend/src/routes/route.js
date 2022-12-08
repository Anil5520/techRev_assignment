const express = require('express');
const { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const router = express.Router();


//----------------------------- User's API -----------------------------//

router.post('/insertCustomer', createCustomer);
router.get('/selectCustomers', getCustomers);
router.get('/selectCustomerById/:customerId', getCustomerById);
router.put('/updateCustomer/:customerId', updateCustomer);
router.delete('/deleteCustomer/:customerId', deleteCustomer);


//----------------------------- For invalid end URL -----------------------------//

router.all('/**', function (_, res) {
    return res.status(400).send({ status: false, message: "Invalid http request" });
})

module.exports = router; 