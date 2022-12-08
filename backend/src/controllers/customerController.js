const customerModel = require("../models/customerModel");
const addressModel = require("../models/addressModel");
const upload = require('../.aws/config');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}


let emailRegex = /^([0-9a-z]([-_\\.]*[0-9a-z]+)*)@([a-z]([-_\\.]*[a-z]+)*)[\\.]([a-z]{2,9})+$/;
let phoneRegex = /^[6-9]\d{9}$/;
let pincodeRegex = /^[1-9][0-9]{5}$/;




//======================================== CreateCustomer Api ====================================================//

const createCustomer = async function (req, res) {
    try {
        const data = req.body;
        let files = req.files;
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Please provide customer details" });
        }

        //Object Destructuring
        let { firstName, lastName, userName, email, phone, dob, gender, password, confirmPassword, image, address, landmark, city, state, country, zipCode } = data;

        if (!isValid(firstName)) return res.status(400).send({ status: false, message: "Please enter firstName" });
        if (!isValid(lastName)) return res.status(400).send({ status: false, message: "Please enter lastName" });
        if (!isValid(userName)) return res.status(400).send({ status: false, message: "Please enter userName" });
        if (!isValid(email)) return res.status(400).send({ status: false, message: "Please enter email" });
        if (!isValid(phone)) return res.status(400).send({ status: false, message: "Please enter phone" });
        if (!isValid(password)) return res.status(400).send({ status: false, message: "Please enter password" });
        if (!isValid(confirmPassword)) return res.status(400).send({ status: false, message: "Please enter confirmPassword" });
        if (!isValid(address)) return res.status(400).send({ status: false, message: "Please enter address" });
        if (!isValid(landmark)) return res.status(400).send({ status: false, message: "Please enter landmark" });
        if (!isValid(city)) return res.status(400).send({ status: false, message: "Please enter city" });
        if (!isValid(state)) return res.status(400).send({ status: false, message: "Please enter state" });
        if (!isValid(country)) return res.status(400).send({ status: false, message: "Please enter country" });
        if (!isValid(zipCode)) return res.status(400).send({ status: false, message: "Please enter zipCode" });

        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, message: "password length should be in the range of 8 to 15 only", });
        }
        if (password !== confirmPassword) return res.status(400).send({ status: false, message: "password and confirmPassword doesn't match" });

        // checking validation for email, phone and zipCode
        if (!emailRegex.test(email)) {
            return res.status(400).send({ status: false, message: "Entered email is invalid" });
        }
        if (!phoneRegex.test(phone)) {
            return res.status(400).send({ status: false, message: "The user phone number should be indian may contain only 10 number" });
        }
        if (!pincodeRegex.test(zipCode)) {
            return res.status(400).send({ status: false, message: "pincode must be number and can not start from 0" });
        }

        // validation for gender
        if (gender && ["male", "female", "other"].indexOf(gender) == -1) {
            return res.status(400).send({ status: false, msg: "gender must be 'male', 'female' or 'other' only" });
        }

        // checking uniqueness of email, phone and userName
        const dupUserName = await customerModel.findOne({ userName });
        if (dupUserName) return res.status(409).send({ status: false, message: `${userName} userName already exists` });

        const dupEmail = await customerModel.findOne({ email });
        if (dupEmail) return res.status(409).send({ status: false, message: `${email} email already exists` });

        const dupPhone = await customerModel.findOne({ phone });
        if (dupPhone) return res.status(409).send({ status: false, message: `${phone} phone already exists` });

        //-----------Bcrypting Password -----------//
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        // if photo is provided then cheking extension of file.
        if (files && files.length > 0) {
            let check = files[0].originalname.split(".");
            const extension = ["png", "jpg", "jpeg", "webp"];
            if (extension.indexOf(check[check.length - 1]) == -1) {
                return res.status(400).send({ status: false, message: "Please provide image only" });
            }
            //upload to s3 and get the uploaded link
            let uploadedFileURL = await upload.uploadFile(files[0]);
            image = uploadedFileURL;
        }

        //customer creation in customer table
        let forCustomer = { firstName, lastName, userName, email, phone, dob, gender, password, image }
        let savedCustomer = await customerModel.create(forCustomer);

        //Address creation in address table
        let forAddress = { customerId: savedCustomer._id, address, landmark, city, state, country, zipCode }
        let savedAdd = await addressModel.create(forAddress);
        return res.status(201).send({ status: true, message: "Customer creation successfull...!", customer: savedCustomer, address: savedAdd });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}




//========================================= Get Customers Data ===================================================//

const getCustomers = async function (req, res) {
    try {
        //filter the data which isn't deleted
        const filter = { isDeleted: false };
        let queryparams = req.query;

        if (isValidRequestBody(queryparams)) {
            let { firstName, lastName, userName, gender } = queryparams;

            if ("firstName" in queryparams) {
                if (Object.keys(firstName).length === 0) {
                    return res.status(400).send({ status: false, message: 'firstName query is empty, either provide query value or deselect it.' });
                }
                filter['firstName'] = firstName;
            }
            if ("lastName" in queryparams) {
                if (Object.keys(lastName).length === 0) {
                    return res.status(400).send({ status: false, message: 'lastName query is empty, either provide query value or deselect it.' });
                }
                filter['lastName'] = lastName;
            }
            if ("userName" in queryparams) {
                if (Object.keys(userName).length === 0) {
                    return res.status(400).send({ status: false, message: 'userName query is empty, either provide query value or deselect it.' });
                }
                filter['userName'] = userName;
            }
            if ("gender" in queryparams) {
                if (Object.keys(gender).length === 0) {
                    return res.status(400).send({ status: false, message: 'gender query is empty, either provide query value or deselect it.' });
                }
                filter['gender'] = gender;
            }
        }
        let limit = req.query.limit || 5;
        let page = req.query.page || 1;

        const customers = await customerModel.find(filter).select({ _id: 1, firstName: 1, lastName: 1, email: 1 }).sort({}).skip(limit * (page - 1)).limit(limit);
        if (customers.length == 0) {
            return res.status(404).send({ status: false, message: "No such document exist with the given filters." });
        }
        return res.status(200).send({ status: true, data: customers });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}



//========================================= Get customer By Id ===================================================//

const getCustomerById = async function (req, res) {
    try {
        const customerId = req.params.customerId;

        //validation for given customerId
        if (!mongoose.isValidObjectId(customerId)) {
            return res.status(400).send({ status: false, message: "please enter valid customerId" });
        }

        //----------------------------- Getting customer Detail -----------------------------//
        const customerDetail = await customerModel.findOne({ _id: customerId, isDeleted: false });
        const addressDetail = await addressModel.findOne({ customerId: customerId, isDeleted: false });

        if (!customerDetail || !addressDetail) {
            return res.status(404).send({ status: false, message: "customer not found" });
        }
        return res.status(200).send({ status: true, message: "Customer Detail", customerDetail, addressDetail });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}





//========================================= Update customer Api ====================================================//


const updateCustomer = async function (req, res) {
    try {
        let customerId = req.params.customerId;
        //validation for given customerId
        if (!mongoose.isValidObjectId(customerId)) {
            return res.status(400).send({ status: false, message: "please enter valid customerId" });
        }
        //----------------------------- Checking if Customer exist or not -----------------------------//
        const customerFound = await customerModel.findOne({ _id: customerId, isDeleted: false });
        if (!customerFound) {
            return res.status(404).send({ status: false, message: "No customer found with this customerId" });
        }
        const addFound = await addressModel.findOne({ customerId, isDeleted: false });
        if (!addFound) {
            return res.status(404).send({ status: false, message: "No address found with this customerId" });
        }

        const data = req.body;
        let files = req.files;

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Provide data details" });
        }

        let { firstName, lastName, userName, email, phone, password, address, landmark, city, state, country, zipCode } = data;

        //----------------------------- Updating firstName -----------------------------//
        if ("firstName" in data) {
            if (!isValid(firstName)) return res.status(400).send({ status: false, message: "Please enter firstName" });
            customerFound.firstName = firstName;
        }

        //----------------------------- Updating lastName -----------------------------//
        if ("lastName" in data) {
            if (!isValid(lastName)) return res.status(400).send({ status: false, message: "Please enter lastName" });
            customerFound.lastName = lastName;
        }

        //----------------------------- Updating userName -----------------------------//
        if ("userName" in data) {
            if (!isValid(userName)) return res.status(400).send({ status: false, message: "userName is not Valid" });

            let uniqueUserName = await customerModel.findOne({ userName });
            if (uniqueUserName) return res.status(409).send({ status: false, message: "This userName already exists, Please try another one." });

            customerFound.userName = userName;
        }

        //----------------------------- Updating email -----------------------------//
        if ("email" in data) {
            if (!isValid(email) || !emailRegex.test(email)) return res.status(400).send({ status: false, message: "email is not Valid" });

            let uniqueEmail = await customerModel.findOne({ email });
            if (uniqueEmail) return res.status(409).send({ status: false, message: "This email already exists, Please try another one." });

            customerFound.email = email;
        }

        //----------------------------- Updating phone -----------------------------//
        if ("phone" in data) {
            if (!isValid(phone) || !phoneRegex.test(phone)) return res.status(400).send({ status: false, message: "phone is not Valid" });

            let uniquephone = await customerModel.findOne({ phone });
            if (uniquephone) return res.status(409).send({ status: false, message: "This phone already exists, Please try another one." });

            customerFound.phone = phone;
        }

        //----------------------------- Updating Bcrypted Password -----------------------------//
        if ("password" in data) {
            if (password.length > 8 || password.length < 15) {
                let saltRounds = await bcrypt.genSalt(10);
                password = await bcrypt.hash(password, saltRounds);
            }
            else {
                return res.status(400).send({ status: false, message: "password length should be in the range of 8 to 15 only" });
            }
            customerFound.password = password;
        }

        //----------------------------- Updating Profile Image -----------------------------//       
        if (files && files.length != 0) {
            let check = files[0].originalname.split(".");
            const extension = ["png", "jpg", "jpeg", "webp"];
            if (extension.indexOf(check[check.length - 1]) == -1) {
                return res.status(400).send({ status: false, message: "Please provide image only" });
            }
            let uploadedFileURL = await upload.uploadFile(files[0]);
            customerFound.image = uploadedFileURL;
        }

        //----------------------------- Updating address -----------------------------//
        if ("address" in data) {
            if (!isValid(address)) return res.status(400).send({ status: false, message: "Please enter address" });
            addFound.address = address;
        }

        //----------------------------- Updating landmark -----------------------------//
        if ("landmark" in data) {
            if (!isValid(landmark)) return res.status(400).send({ status: false, message: "Please enter landmark" });
            addFound.landmark = landmark;
        }

        //----------------------------- Updating city -----------------------------//
        if ("city" in data) {
            if (!isValid(city)) return res.status(400).send({ status: false, message: "Please enter city" });
            addFound.city = city;
        }

        //----------------------------- Updating state -----------------------------//
        if ("state" in data) {
            if (!isValid(state)) return res.status(400).send({ status: false, message: "Please enter state" });
            addFound.state = state;
        }

        //----------------------------- Updating country -----------------------------//
        if ("country" in data) {
            if (!isValid(country)) return res.status(400).send({ status: false, message: "Please enter country" });
            addFound.country = country;
        }

        //----------------------------- Updating zipCode -----------------------------//
        if ("zipCode" in data) {
            if (!isValid(zipCode)) return res.status(400).send({ status: false, message: "Please enter zipCode" });
            addFound.zipCode = zipCode;
        }

        //----------------------------- Saving Updates -----------------------------//
        await customerFound.save();
        await addFound.save();
        return res.status(200).send({ status: true, message: "customer updatation successful...", customerFound, addFound });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}





//====================================== Delete customer ==========================================//

let deleteCustomer = async function (req, res) {
    try {
        let customerId = req.params.customerId;
        //validation for given customerId
        if (!mongoose.isValidObjectId(customerId)) {
            return res.status(400).send({ status: false, message: "please enter valid customerId" });
        }

        await customerModel.findByIdAndUpdate({ _id: customerId }, { $set: { isDeleted: true } }, { new: true });
        await addressModel.findOneAndUpdate({ customerId }, { $set: { isDeleted: true } }, { new: true });

        return res.status(200).send({ status: true, message: "Customer deleted Successfully..." });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}




module.exports = { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer }