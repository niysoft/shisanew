let
    service = require('./functions.js'),
    fileuploader = require('./fileuploader'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Game = mongoose.model('Game'),
    GamePlay = mongoose.model('GamePlay'),
    Transaction = mongoose.model('Transaction'),
    Notification = mongoose.model('Notification'),
    Perpetrator = mongoose.model('Perpetrator'),
    Case = mongoose.model('Case'),
    Incident = mongoose.model('Incident'),
    Upload = mongoose.model('Upload'),
    //Detail = mongoose.model('Detail');
    Joi = require('@hapi/joi'),
    // rp = require('request-promise'),
    //axios = require('axios'),
    unirest = require("unirest"),
    moment = require('moment'),
    sha1 = require('sha1'),
    //multer = require('multer'),
    // upload = multer({ dest: 'uploads/' }),
    momentTimeZone = require('moment-timezone'),


    //upload = multer({ storage: storage }),//upload = multer({ dest: 'uploads/' })
    path = require('path')
momentTimeZone().tz("Africa/Lagos").format();

module.exports.upload_files = function (req, res, next) {
    if (!req.body && !req.files) {
        res.json({ success: false });
    } else {
        var c;
        let originalFileName = req.files
        //console.log(originalFileName)
        let queryArray = [];
        originalFileName.forEach(element => {
            queryArray.push({
                fileType: "image",
                fileName: element.filename,
                userId: req.body.userId,
                caseId: req.body.caseId,
                incidentId: req.body.incidentId,
               
            });
        });
        Upload.insertMany(queryArray, function (error, upload) {
            if (!error) {
                SuccessResponse.response_string = "Success! Images added successfully"
                SuccessResponse.data = upload
                res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
            } else {
                handleErrorServer(null, res, "Error! Something went wrong. Please retry action")
            }
        });
    }
}

module.exports.create_case = function (req, res) {//add_incident
    let missingRequestFlag = false
    let userTypes = [req.body.userId, req.body.accessToken, req.body.caseType, req.body.fname, req.body.lname, req.body.age,
    req.body.gender]// req.body.phone, req.body.perpEmail, req.body.ssn, , req.body.fb
    for (let i = 0; i < userTypes.length; i++) {
        if (!isSet(userTypes[i]) || userTypes[i].trim() == "") {
            missingRequestFlag = true
            break
        }
    }
    if (missingRequestFlag) {//one mandatory fields ommited
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    } else {
        User.find({
            $and: [{
                accessToken: req.body.accessToken,
                _id: req.body.userId
            }]
        })
            .then(user => {
                if (user.length > 0) {
                    let case_ = new Case()
                    case_.createCase(
                        req.body.userId,
                        req.body.caseType,
                        req.body.fname,
                        req.body.lname,
                        req.body.age,
                        req.body.gender,
                        req.body.phone,
                        req.body.perpEmail,
                        req.body.ssn,
                        req.body.fb,
                        req.body.linkedin,
                        req.body.companyName,
                        req.body.companySize,
                        req.body.companyAddress,
                        req.body.companyWebpage,
                        req.body.companyFacebook,
                        req.body.companyLinkedIn,
                    )
                    //console.log(perpetrator)
                    case_.save().then(function (case___) {
                        //user.password = null
                        SuccessResponse.response_string = 'Registration started successfully. Please proceed to the next stage'
                        SuccessResponse.data = case___
                        SuccessResponse.response_string = "Success! Case created successfully"
                        res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                    }).catch(function (err) {
                        // if (err.code === 11000)
                        //     ServerErrorResponse.error_string = "Duplicate record exist. Try password reset should you forget your password"
                        // else
                        ServerErrorResponse.error_string = err.message
                        handleErrorServer(null, res, ServerErrorResponse.error_string)
                    })
                } else {
                    handleErrorServer(null, res, "Error! Invalid login credentials. Please retry")
                }

            })
            .catch(function (err) {
                handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
            });
    }
    return;
}

module.exports.load_cases = function (req, res) { //load_incidents
    let missingRequestFlag = false
    let userTypes = [req.body.userId, req.body.accessToken]
    for (let i = 0; i < userTypes.length; i++) {
        if (!isSet(userTypes[i]) || userTypes[i].trim() == "") {
            missingRequestFlag = true
            break
        }
    }
    if (missingRequestFlag) {//one mandatory fields ommited
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    } else {
        User.find({
            $and: [{
                accessToken: req.body.accessToken,
                _id: req.body.userId
            }]
        })//{'session.channel':{'$ne':k+''}}
            .then(user => {
                Case.find({
                    $and: [{
                        userId: req.body.userId,
                        deleted: { '$ne': true }//deleted: true
                    }]
                }) //{accessToken: req.body.accessToken}, {_id: req.body.playerId},
                    .then(perpetrator => {
                        let SuccessResponse = {}
                        SuccessResponse.status = true
                        SuccessResponse.response_string = "Success! Cases loaded successfully"
                        SuccessResponse.data = perpetrator
                        // handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
                        res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)//SUCCESS_RESPONSE_CODE
                    }).catch(function (err) {
                        handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
                    });
            }).catch(function (err) {
                handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
            });
    }
}

module.exports.load_incidents = function (req, res) { //load_incident_content
    let missingRequestFlag = false
    if(isSet(req.body.loadfile)){
        console.log("loadfile")
    }
    let userTypes = [req.body.userId, req.body.accessToken, req.body.caseId]
    for (let i = 0; i < userTypes.length; i++) {
        if (!isSet(userTypes[i]) || userTypes[i].trim() == "") {
            missingRequestFlag = true
            break
        }
    }
    if (missingRequestFlag) {//one mandatory fields ommited
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    } else {
        User.find({
            $and: [{
                accessToken: req.body.accessToken,
                _id: req.body.userId
            }]
        })
            .then(user => {
                Case.find({ _id: req.body.caseId }) //{accessToken: req.body.accessToken}, {_id: req.body.playerId},
                    .then(cases => {

                        Incident.find(
                            {
                                $and: [{
                                    caseId: req.body.caseId,
                                    deleted: { '$ne': true }//deleted: true
                                }]
                            }) //{accessToken: req.body.accessToken}, {_id: req.body.playerId},
                            .then(incid => {
                                let SuccessResponse = {}
                                // SuccessResponse.case_details = cases
                                SuccessResponse.status = true
                                SuccessResponse.response_string = "Success! Incidents loaded successfully"
                                SuccessResponse.case_details = cases[0]
                                SuccessResponse.incidents = incid

                                if(.isSet(req.body.loadfile) && req.body.loadfile == true){
                                    SuccessResponse.upload = []
                                    res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                                } else {
                                    res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                                }
                                // handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
                                //SUCCESS_RESPONSE_CODE
                            }).catch(function (err) {
                                handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
                            });
                    }).catch(function (err) {
                        handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
                    });
            }).catch(function (err) {
                handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
            });
    }
}

module.exports.add_incident = function (req, res) {//caseId, userId, title, date, location, narration, images, videos, audio, howyoufeel
    let missingRequestFlag = false
    let userTypes = [req.body.caseId, req.body.accessToken, req.body.userId, req.body.title, req.body.date, req.body.time,
    req.body.location, req.body.narration, req.body.howyoufeel]
    //console.log(userTypes[i])
    for (let i = 0; i < userTypes.length; i++) {
        console.log(userTypes[i])
        if (!isSet(userTypes[i]) || userTypes[i].trim() == "") {
            missingRequestFlag = true
            break
        }
    }
    // return
    if (missingRequestFlag) {//one mandatory fields ommited
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    } else {
        User.find({
            $and: [{
                accessToken: req.body.accessToken,
                _id: req.body.userId
            }]
        })
            .then(user => {
                if (user.length > 0) {
                    let incident = new Incident() // caseId, userId, title, date, location, narration, howyoufeel
                    incident.createIncident(
                        req.body.caseId,
                        req.body.userId,
                        req.body.title,
                        req.body.date,
                        req.body.time,
                        req.body.location,
                        req.body.narration,
                        req.body.howyoufeel
                    )
                    //console.log(perpetrator)
                    incident.save().then(function (incident_) {
                        SuccessResponse.data = incident_
                        SuccessResponse.response_string = "Success! Incident created successfully"
                        res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                    }).catch(function (err) {
                        ServerErrorResponse.error_string = err.message
                        handleErrorServer(null, res, ServerErrorResponse.error_string)
                    })
                } else {
                    handleErrorServer(null, res, "Error! Invalid login credentials. Please retry")
                }

            })
            .catch(function (err) {
                handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
            });
        //continue insertion

    }
}

module.exports.load_incident_content = function (req, res) { //
    let missingRequestFlag = false
    let userTypes = [req.body.userId, req.body.accessToken, req.body.caseId, req.body.incidentId]
    for (let i = 0; i < userTypes.length; i++) {
        if (!isSet(userTypes[i]) || userTypes[i].trim() == "") {
            missingRequestFlag = true
            break
        }
    }
    if (missingRequestFlag) {//one mandatory fields ommited
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    } else {
        User.find({
            $and: [{
                accessToken: req.body.accessToken,
                _id: req.body.userId
            }]
        })
            .then(user => {
                if (user.length > 0) {
                    Case.find({ _id: req.body.caseId }) //{accessToken: req.body.accessToken}, {_id: req.body.playerId},
                        .then(cases => {
                            Incident.find({ _id: req.body.incidentId }) //{accessToken: req.body.accessToken}, {_id: req.body.playerId},
                                .then(incid => {
                                    let SuccessResponse = {}
                                    // SuccessResponse.case_details = cases
                                    SuccessResponse.status = true
                                    SuccessResponse.response_string = "Success! Incidents loaded successfully"
                                    SuccessResponse.case_details = cases[0]
                                    SuccessResponse.incidents = incid
                                    // handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
                                    res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)//SUCCESS_RESPONSE_CODE
                                }).catch(function (err) {
                                    handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
                                });
                        }).catch(function (err) {
                            handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
                        });
                } else {
                    handleErrorServer(null, res, "Error! Invalid login credentials")
                }
            }).catch(function (err) {
                handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
            });
    }
}

module.exports.edit_perpetrator = function (req, res) { //edit_company
    let missingRequestFlag = false
    let userTypes = [req.body.userId, req.body.accessToken, req.body.caseId, req.body.fname, req.body.lname, req.body.age, req.body.gender]
    let userTypes_ = [req.body.phone, req.body.perpEmail, req.body.ssn, req.body.fb, req.body.linkedin]
    let issueField = ""
    for (let i = 0; i < userTypes.length; i++) {
        if (!isSet(userTypes[i]) || userTypes[i].trim() == "") {
            missingRequestFlag = true
            break
        }
    }
    for (let i = 0; i < userTypes_.length; i++) {
        if (!isSet(userTypes_[i])) {
            missingRequestFlag = true
            break
        }
    }
    if (missingRequestFlag) {//one mandatory fields ommited
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    } else {
        User.find({
            $and: [{
                accessToken: req.body.accessToken,
                _id: req.body.userId
            }]
        })
            .then(user => {
                if (user.length > 0) {
                    //console.log(req.body); return;
                    let query = Case.findOneAndUpdate({
                        _id: req.body.caseId
                    }, {
                        $set: {
                            fname: req.body.fname,
                            lname: req.body.lname,
                            age: req.body.age,
                            gender: req.body.gender,
                            phone: req.body.phone,
                            email: req.body.perpEmail,
                            identityNumber: req.body.ssn,
                            facebook: req.body.fb,
                            linkedin: req.body.linkedin,
                        }
                    }, {
                        new: true
                    })
                    query.exec().then(function (doc) { // <- this is the Promise interface.
                        if (doc != null) {
                            //doc.password = null
                            SuccessResponse.data = doc
                            SuccessResponse.response_string = "Success! Perpetrator updated successfully."
                            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                        } else {
                            handleErrorServer(null, res, "Error! perpetrator could not be updated at the moment. Please retry")
                        }
                    }, function (err) {
                        //console.log(err)
                        handleErrorServer(null, res, "Error! Details could not be updated at the moment. Please retry")
                    })
                } else {
                    handleErrorServer(null, res, "Error! Invalid login credentials. Please retry")
                }
            })
            .catch(function (err) {
                handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
            });
    }
}

module.exports.edit_company = function (req, res) { //edit_company
    let missingRequestFlag = false
    let userTypes = [req.body.userId, req.body.accessToken, req.body.caseId, req.body.companyName, req.body.companySize]
    let userTypes_ = [req.body.companyWebpage, req.body.companyFacebook, req.body.companyLinkedIn, req.body.companyAddress]
    for (let i = 0; i < userTypes.length; i++) {
        if (!isSet(userTypes[i]) || userTypes[i].trim() == "") {
            missingRequestFlag = true
            break
        }
    }
    for (let i = 0; i < userTypes_.length; i++) {
        if (!isSet(userTypes_[i])) {
            missingRequestFlag = true
            break
        }
    }
    if (missingRequestFlag) {//one mandatory fields ommited
        // console.log(req.body); return;
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    } else {
        User.find({
            $and: [{
                accessToken: req.body.accessToken,
                _id: req.body.userId
            }]
        })
            .then(user => {
                if (user.length > 0) {
                    //console.log(req.body); return;
                    let query = Case.findOneAndUpdate({
                        _id: req.body.caseId
                    }, {
                        $set: {
                            companyName: req.body.companyName,
                            companySize: req.body.companySize,
                            companyAddress: req.body.companyAddress,
                            companyWebpage: req.body.companyWebpage,
                            companyFacebook: req.body.companyFacebook,
                            companyLinkedIn: req.body.companyLinkedIn
                        }
                    }, {
                        new: true
                    })
                    query.exec().then(function (doc) { // <- this is the Promise interface.
                        if (doc != null) {
                            //doc.password = null
                            SuccessResponse.data = doc
                            SuccessResponse.response_string = "Success! Company updated successfully."
                            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                        } else {
                            handleErrorServer(null, res, "Error! Company could not be updated at the moment. Please retry")
                        }
                    }, function (err) {
                        //console.log(err)
                        handleErrorServer(null, res, "Error! Details could not be updated at the moment. Please retry")
                    })
                } else {
                    handleErrorServer(null, res, "Error! Invalid login credentials. Please retry")
                }
            })
            .catch(function (err) {
                handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
            });
    }
}

module.exports.load_profile = function (req, res) { //load_incident_content
    let missingRequestFlag = false
    let userTypes = [req.body.userId, req.body.accessToken]
    for (let i = 0; i < userTypes.length; i++) {
        if (!isSet(userTypes[i]) || userTypes[i].trim() == "") {
            missingRequestFlag = true
            break
        }
    }
    if (missingRequestFlag) {//one mandatory fields ommited
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    } else {
        User.find({
            $and: [{
                accessToken: req.body.accessToken,
                _id: req.body.userId
            }]
        })
            .then(user => {
                if (user.length > 0) {
                    SuccessResponse.status = true
                    SuccessResponse.response_string = "Success! Profile loaded successfully"
                    user[0].password = null
                    SuccessResponse.data = user[0]
                    // handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
                    res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)//SUCCESS_RESPONSE_CODE
                } else {
                    handleErrorServer(null, res, "Error! Invalid credentials. Please retry your action")
                }
            }).catch(function (err) {
                handleErrorServer(null, res, err.message)
            });
    }
}

module.exports.update_profile = function (req, res) { //update_profile
    //console.log(req.body)
    //return
    let missingRequestFlag = false
    let userTypes = [req.body.userId, req.body.accessToken, req.body.fname, req.body.lname, req.body.useremail]
    let userTypes_ = [req.body.address]
    console.log(req.body)
    for (let i = 0; i < userTypes.length; i++) {
        if (!isSet(userTypes[i]) || userTypes[i].trim() == "") {
            missingRequestFlag = true
            break
        }
    }
    for (let i = 0; i < userTypes_.length; i++) {
        if (!isSet(userTypes_[i])) {
            missingRequestFlag = true
            break
        }
    }
    if (missingRequestFlag) {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    } else {
        User.find({
            $and: [{
                accessToken: req.body.accessToken,
                _id: req.body.userId
            }]
        })
            .then(user => {
                if (user.length > 0) {
                    let query = User.findOneAndUpdate({
                        accessToken: req.body.accessToken,
                    }, {
                        $set: {
                            fullName: req.body.fname + " " + req.body.lname,
                            email: req.body.useremail,
                            address: req.body.address,
                        }
                    }, {
                        new: true
                    })
                    query.exec().then(function (doc) { // <- this is the Promise interface.
                        console.log(doc)
                        if (doc != null) {
                            doc.password = null
                            SuccessResponse.data = doc
                            SuccessResponse.response_string = "Success! Profile updated successfully."
                            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                        } else {
                            handleErrorServer(null, res, "Error! Profile could not be updated at the moment. Please retry")
                        }
                    }, function (err) {
                        //console.log(err)
                        handleErrorServer(null, res, "Error! Profile could not be updated at the moment. Please retry")
                    })
                } else {
                    handleErrorServer(null, res, "Error! Invalid login credentials. Please retry")
                }
            })
            .catch(function (err) {
                handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
            });
    }
}

module.exports.delete_case = function (req, res) { //delete_incident
    let missingRequestFlag = false
    let userTypes = [req.body.userId, req.body.accessToken, req.body.caseId]
    for (let i = 0; i < userTypes.length; i++) {
        if (!isSet(userTypes[i]) || userTypes[i].trim() == "") {
            missingRequestFlag = true
            break
        }
    }
    if (missingRequestFlag) {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    } else {
        User.find({
            $and: [{
                accessToken: req.body.accessToken,
                _id: req.body.userId
            }]
        })
            .then(user => {
                if (user.length > 0) {
                    let query = Case.findOneAndUpdate({
                        _id: req.body.caseId,
                    }, {
                        $set: {
                            deleted: true,
                            deleteDate: new Date()
                        }
                    }, {
                        new: true
                    })
                    query.exec().then(function (doc) { // <- this is the Promise interface.
                        // console.log(doc)
                        if (doc != null) {
                            //doc.password = null
                            SuccessResponse.data = doc
                            SuccessResponse.response_string = "Success! Case deleted successfully."
                            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                        } else {
                            handleErrorServer(null, res, "Error! Case could not be deleted at the moment. Please retry")
                        }
                    }, function (err) {
                        //console.log(err)
                        handleErrorServer(null, res, "Error! Case could not be deleted at the moment. Please retry")
                    })
                } else {
                    handleErrorServer(null, res, "Error! Invalid login credentials. Please retry")
                }
            })
            .catch(function (err) {
                handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
            });
    }
}

module.exports.delete_incident = function (req, res) { //delete_incident
    let missingRequestFlag = false
    let userTypes = [req.body.userId, req.body.accessToken, req.body.incidentId]
    for (let i = 0; i < userTypes.length; i++) {
        if (!isSet(userTypes[i]) || userTypes[i].trim() == "") {
            missingRequestFlag = true
            break
        }
    }
    if (missingRequestFlag) {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    } else {
        User.find({
            $and: [{
                accessToken: req.body.accessToken,
                _id: req.body.userId
            }]
        })
            .then(user => {
                if (user.length > 0) {
                    let query = Incident.findOneAndUpdate({
                        _id: req.body.incidentId,
                    }, {
                        $set: {
                            deleted: true,
                            deleteDate: new Date()
                        }
                    }, {
                        new: true
                    })
                    query.exec().then(function (doc) { // <- this is the Promise interface.
                        // console.log(doc)
                        if (doc != null) {
                            //doc.password = null
                            SuccessResponse.data = doc
                            SuccessResponse.response_string = "Success! Incident deleted successfully."
                            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                        } else {
                            handleErrorServer(null, res, "Error! Case could not be deleted at the moment. Please retry")
                        }
                    }, function (err) {
                        //console.log(err)
                        handleErrorServer(null, res, "Error! Case could not be deleted at the moment. Please retry")
                    })
                } else {
                    handleErrorServer(null, res, "Error! Invalid login credentials. Please retry")
                }
            })
            .catch(function (err) {
                handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
            });
    }
}

module.exports.simple_signup_self = function (req, res) {
    if (isSet(req.body.fullName) && isSet(req.body.phone) && isSet(req.body.email)) {
        let userTypes = ["direct", "notdirect", "superagent"]
        let newUser = new User()
        let fullName = req.body.fullName.trim()
        let email = req.body.email.trim()
        let phone = req.body.phone.trim()
        let password = "12345678"
        let agentType = "" //direct, notdirect, superagent
        let superAgent = ""
        let isAgent = false
        let schema = Joi.object().keys({
            fullName: Joi.string().required(),
            phone: Joi.string().min(11).required()
        })
        let data = {
            fullName,
            phone
        }
        Joi.validate(data, schema, (err, value) => {
            if (err) {
                res.status(CLIENT_ERROR_RESPONSE_CODE).json(ClientErrorResponse)
            } else {
                let singleFlag = phone
                newUser.countUser()
                    .then(function (count) {
                        let userId = count + 1000
                        //fullName, userId, phone, email, password, singleFlag, agentType, superAgent, isAgent, actualBalance, bonusBalance
                        newUser.createUser(fullName, userId, phone, email, hashPass(password), singleFlag, agentType, superAgent, isAgent, 0, 0)
                        newUser.save().then(function (user) {
                            //user.password = null
                            SuccessResponse.response_string = 'Registration started successfully. Please proceed to the next stage'
                            user.password = null
                            SuccessResponse.data = user
                            let phoneVerificationCode = generateVerificationCode()
                            let message = "Hey buddy, welcome to Bingo9ja. Your verification code is: " + phoneVerificationCode
                            SuccessResponse.response_string = "Success! Registration successfully but verification code not be sent. Please request 'Resend Code' to retry sending it"
                            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                        }).catch(function (err) {
                            if (err.code === 11000)
                                ServerErrorResponse.error_string = "Duplicate record exist. Try password reset should you forget your password"
                            else
                                ServerErrorResponse.error_string = "Registration could not proceed. Please retry your action"
                            //handleErrorServer(null, res, ServerErrorResponse.error_string)
                            handleErrorServer(null, res, ServerErrorResponse.error_string)
                        })
                    })
                    .catch(function (err) {
                        next(err);
                    })
            }
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}

module.exports.simple_signup = function (req, res) {
    if (isSet(req.body.fullName) && isSet(req.body.phone) && isSet(req.body.accessToken)) {
        let userTypes = ["direct", "notdirect", "superagent"]
        let newUser = new User()
        let fullName = req.body.fullName.trim()
        let accessToken = req.body.accessToken
        // let email = req.body.email.trim()
        let phone = req.body.phone.trim()
        let password = "12345678"
        let agentType = isSet(req.body.agentType) ? req.body.agentType : "direct" //direct, notdirect, superagent
        let superAgent = isSet(req.body.superAgent) ? req.body.superAgent : ""
        if (agentType == "superagent")
            superAgent = ""
        let isAgent = isSet(req.body.isAgent) ? req.body.isAgent : false
        let schema = Joi.object().keys({
            fullName: Joi.string().required(),
            phone: Joi.string().min(11).required()
        })
        let data = {
            fullName,
            phone
        }
        if (!userTypes.includes(agentType)) {
            handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
            return
        }
        Joi.validate(data, schema, (err, value) => {
            if (err) {
                res.status(CLIENT_ERROR_RESPONSE_CODE).json(ClientErrorResponse)
            } else {
                let query = User.findOne({
                    accessToken: accessToken
                })
                query.exec().then(function (doc) { // <- this is the Promise interface.
                    if (doc != null && doc.agentType == "superagent") { //check provided accesstoken as superAgent
                        let singleFlag = phone
                        newUser.countUser()
                            .then(function (count) {
                                let userId = count + 1000
                                newUser.createUser(fullName, userId, phone, phone, hashPass(password), singleFlag, agentType, superAgent, isAgent, 0, 0)
                                newUser.save().then(function (user) {
                                    //user.password = null
                                    SuccessResponse.response_string = 'Registration started successfully. Please proceed to the next stage'
                                    user.password = null
                                    SuccessResponse.data = user
                                    let phoneVerificationCode = generateVerificationCode()
                                    let message = "Hey buddy, welcome to Bingo9ja. Your verification code is: " + phoneVerificationCode
                                    SuccessResponse.response_string = "Success! Registration successfully but verification code not be sent. Please request 'Resend Code' to retry sending it"
                                    res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                                }).catch(function (err) {
                                    if (err.code === 11000)
                                        ServerErrorResponse.error_string = "Duplicate record exist. Try password reset should you forget your password"
                                    else
                                        ServerErrorResponse.error_string = "Registration could not proceed. Please retry your action"
                                    //handleErrorServer(null, res, ServerErrorResponse.error_string)
                                    handleErrorServer(null, res, ServerErrorResponse.error_string)
                                })
                            })
                            .catch(function (err) {
                                next(err);
                            })
                    } else {
                        handleErrorServer(null, res, "Error! Invalid login credentials. Please retry with valid details")
                    }
                }, function (err) {
                    handleErrorServer(null, res, "")
                })
            }
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}

module.exports.start_signup = function (req, res) {
    if (isSet(req.body.fullName) && isSet(req.body.password) && isSet(req.body.phone)) {
        let userTypes = ["direct", "notdirect", "superagent"]
        let newUser = new User()
        let fullName = req.body.fullName.trim()
        // let email = req.body.email.trim()
        let phone = req.body.phone.trim()
        let password = req.body.password.trim()
        let agentType = isSet(req.body.agentType) ? req.body.agentType : "direct" //direct, notdirect, superagent
        let superAgent = isSet(req.body.superAgent) ? req.body.superAgent : ""
        if (agentType == "superagent")
            superAgent = ""
        let isAgent = isSet(req.body.isAgent) ? req.body.isAgent : false
        let schema = Joi.object().keys({
            fullName: Joi.string().required(),
            //email: Joi.string().email({
            //    minDomainSegments: 2
            //}),
            // email: Joi.string().required(),
            password: Joi.string().required(),
            phone: Joi.string().min(13).required()
        })
        let data = {
            fullName,
            //email,
            password,
            phone
        }
        if (!userTypes.includes(agentType)) {
            handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
            return
        }
        Joi.validate(data, schema, (err, value) => {
            if (err) {
                res.status(CLIENT_ERROR_RESPONSE_CODE).json(ClientErrorResponse)
            } else {
                let singleFlag = phone
                newUser.countUser()
                    .then(function (count) {
                        let userId = count + 1000
                        //fullName, userId, phone, email, password, singleFlag, agentType, superAgent, isAgent, actualBalance, bonusBalance
                        newUser.createUser(fullName, userId, phone, phone, hashPass(password), singleFlag, agentType, superAgent, isAgent, 0, 0)
                        newUser.save().then(function (user) {
                            //user.password = null
                            SuccessResponse.response_string = 'Registration started successfully. Please proceed to the next stage'
                            user.password = null
                            SuccessResponse.data = user
                            let phoneVerificationCode = generateVerificationCode()
                            let message = "Hey buddy, welcome to Bingo9ja. Your verification code is: " + phoneVerificationCode
                            sendVerificationCode(phone, message).end(function (response) {
                                if (response.code === 200) //code sent successfully
                                {
                                    User.findOneAndUpdate({
                                        phone: phone
                                    }, {
                                        $set: {
                                            phoneVerificationCode: phoneVerificationCode
                                        }
                                    }, {
                                        new: true
                                    }, function (err, doc) {
                                        if (err) {
                                            handleErrorClient(null, res, "Error! Registration could not continue.")
                                        } else {
                                            SuccessResponse.response_string = "Success! Registration successful. Verification code has been sent to your provide mobile number."
                                            doc.phoneVerificationCode = null
                                            doc.password = null
                                            SuccessResponse.data = doc //{phoneVerificationCode: phone}
                                            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                                        }
                                    })
                                } else {
                                    SuccessResponse.response_string = "Success! Registration successfully but verification code not be sent. Please request 'Resend Code' to retry sending it"
                                    res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                                }
                            })
                        }).catch(function (err) {
                            if (err.code === 11000)
                                ServerErrorResponse.error_string = "Duplicate record exist. Try password reset should you forget your password"
                            else
                                ServerErrorResponse.error_string = "Registration could not proceed. Please retry your action"
                            //handleErrorServer(null, res, ServerErrorResponse.error_string)
                            handleErrorServer(null, res, err.message)
                        })
                    })
                    .catch(function (err) {
                        next(err);
                    })
                //}


            }
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
        //res.status(CLIENT_ERROR_RESPONSE_CODE).json(ClientErrorResponse)
    }
}
module.exports.verify_phone = function (req, res) {
    if (isSet(req.body.phoneVerificationCode) && isSet(req.body._id)) {
        let phoneVerificationCode = req.body.phoneVerificationCode.trim()
        let _id = req.body._id.trim()
        let accessToken = makeAccessToken()
        let query = User.findOneAndUpdate({
            phoneVerificationCode: phoneVerificationCode,
            _id: _id
        }, {
            $set: {
                isMobileVerified: true,
                accessToken: accessToken
            }
        }, {
            new: true
        })
        query.exec().then(function (doc) { // <- this is the Promise interface.
            if (doc != null) {
                GamePlay.countDocuments({
                    playerId: doc._id
                }).exec().then(function (gameCount) {
                    console.log(gameCount)
                    SuccessResponse.response_string = "Success! Login successful."
                    SuccessResponse.gameCount = gameCount
                    doc.password = null
                    SuccessResponse.data = doc
                    res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                }).catch(err => handleErrorClient(null, res, ""))
            } else {
                handleErrorServer(null, res, "Record does not exist. Please signup to join Bingo9ja")
            }
        }, function (err) {
            handleErrorServer(err, res, "")
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}
module.exports.resend_phone_code = function (req, res) {
    if (isSet(req.body.phone) && isSet(req.body._id)) {
        let phone = req.body.phone.trim()
        let _id = req.body._id.trim()
        let phoneVerificationCode = generateVerificationCode()
        sendVerificationCode(phoneVerificationCode, phone).end(function (response) {
            if (response.code === 200) //code sent successfully
            {
                let query = User.findOneAndUpdate({
                    phone: phone,
                    _id: _id
                }, {
                    $set: {
                        phoneVerificationCode: phoneVerificationCode
                    }
                }, {
                    new: true
                })
                query.exec().then(function (doc) { // <- this is the Promise interface.
                    if (doc != null) {
                        SuccessResponse.response_string = "Success! Verification code has been sent to your provided mobile number."
                        doc.password = null
                        SuccessResponse.data = doc //{phoneVerificationCode: phone}
                        res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                    } else {
                        handleErrorServer(null, res, "Error! Verification could not be sent at the moment")
                        // handleError(null, res, "Error! Verification could not be sent at the moment")
                    }
                }, function (err) {
                    // Error! Verification could not be sent at the moment
                    handleErrorServer(null, res, "Error! Verification could not be sent at the moment")
                })
            } else {
                handleErrorServer(null, res, "Error! Verification could not be sent at the moment")
            }
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}
module.exports.login = function (req, res) {
    if (isSet(req.body.email) && isSet(req.body.password)) {
        console.log(req.body.email)
        let email = req.body.email.trim()
        let password = hashPass(req.body.password)
        let accessToken = makeAccessToken()
        let query = User.findOneAndUpdate({
            email: email,
            password: password,
            isMobileVerified: true
        }, {
            $set: {
                accessToken: accessToken
            }
        }, {
            new: true
        })
        query.exec().then(function (doc) { // <- this is the Promise interface.
            if (doc != null) {
                //console.log(doc)
                GamePlay.countDocuments({
                    playerId: doc._id
                }).exec().then(function (gameCount) {
                    // console.log(gameCount)
                    SuccessResponse.response_string = "Success! Login successful."
                    SuccessResponse.gameCount = gameCount
                    SuccessResponse.totalBalance = doc.accountBalance; // + doc.bonusBalance
                    doc.password = null //totalBalance
                    //doc.totalBalance =  doc.password
                    SuccessResponse.data = doc
                    res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                }).catch(err => handleErrorClient(null, res, ""))
            } else {
                handleErrorServer(null, res, "Error! Invalid login credentials. Please retry with valid details")
            }
        }, function (err) {
            handleErrorServer(null, res, "")
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}
module.exports.load_details = function (req, res) {
    if (isSet(req.body.accessToken)) {
        let accessToken = req.body.accessToken
        let query = User.findOne({
            accessToken: accessToken
        })
        query.exec().then(function (doc) { // <- this is the Promise interface.
            if (doc != null) {
                doc.password = null
                GamePlay.countDocuments({
                    playerId: doc._id
                }).exec().then(function (gameCount) {
                    console.log(gameCount)
                    SuccessResponse.response_string = "Success! Login successful."
                    SuccessResponse.gameCount = gameCount
                    SuccessResponse.data = doc
                    res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                }).catch(err => handleErrorClient(null, res, ""))
            } else {
                handleErrorServer(null, res, "Error! Invalid login credentials. Please retry with valid details")
            }
        }, function (err) {
            handleErrorServer(null, res, "")
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}
module.exports.logout = function (req, res) {
    if (isSet(req.body.phone) && isSet(req.body.accessToken)) {
        let phone = req.body.phone.trim()
        let accessToken = req.body.accessToken
        let query = User.findOneAndUpdate({
            phone: phone,
            accessToken: accessToken
        }, {
            $set: {
                accessToken: ''
            }
        }, {
            new: true
        })
        query.exec().then(function (doc) { // <- this is the Promise interface.
            if (doc != null) {
                SuccessResponse.response_string = "Success! Logout successful."
                SuccessResponse.data = {}
                res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
            } else {
                handleErrorServer(null, res, "Error! Invalid credentials. Please retry with valid details")
            }
        }, function (err) {
            handleErrorServer(null, res, "")
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
} //user_access_logout
module.exports.update_password = function (req, res) {
    if (isSet(req.body.password) && isSet(req.body.accessToken)) {
        let accessToken = req.body.accessToken.trim()
        let password = hashPass(req.body.password)
        let query = User.findOneAndUpdate({
            accessToken: accessToken
        }, {
            $set: {
                password: password
            }
        }, {
            new: true
        })
        query.exec().then(function (doc) { // <- this is the Promise interface.
            if (doc != null) {
                SuccessResponse.response_string = "Success! Password update successfully."
                res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
            } else {
                handleErrorServer(null, res, "Error! Password could not be updated at the moment")
            }
        }, function (err) {
            handleErrorServer(null, res, "")
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}
module.exports.start_update_phone = function (req, res) {
    if (isSet(req.body.accessToken) && isSet(req.body.newPhone)) {
        let accessToken = req.body.accessToken.trim()
        let newPhone = req.body.newPhone
        let phoneVerificationCode = generateVerificationCode()
        let query = User.findOneAndUpdate({
            accessToken: accessToken
        }, {
            $set: {
                phoneVerificationCode: phoneVerificationCode,
                tempPhone: newPhone
            }
        }, {
            new: true
        })
        query.exec().then(function (doc) { // <- this is the Promise interface.
            if (doc != null) {
                sendVerificationCode(newPhone, "Your just tried to update your mobile number. Use this code to complete action: " + phoneVerificationCode).end(function (response) {
                    if (response.code === 200) //code sent successfully
                    {
                        SuccessResponse.response_string = "Success! phone update initiated. Enter code to complete action"
                        res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                    } else {
                        handleErrorServer(null, res, "Error! phone update initiated but code could not be sent")
                    }
                })
            } else {
                handleErrorServer(null, res, "rror! phone could not be updated at the moment")
            }
        }, function (err) {
            handleErrorServer(null, res, "")
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}
module.exports.complete_update_phone = function (req, res) {
    console.log(req.body)
    if (isSet(req.body.accessToken) && isSet(req.body.phoneVerificationCode) && isSet(req.body.newPhone)) {
        let accessToken = req.body.accessToken.trim()
        let newPhone = req.body.newPhone.trim()
        let phoneVerificationCode = req.body.phoneVerificationCode
        let query = User.findOneAndUpdate({
            accessToken: accessToken,
            phoneVerificationCode: phoneVerificationCode
        }, {
            $set: {
                phone: newPhone
            }
        }, {
            new: true
        })
        query.exec().then(function (doc) { // <- this is the Promise interface.
            if (doc != null) {
                SuccessResponse.response_string = "Success! phone update initiated. Enter code to complete action"
                res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
            } else {
                handleErrorServer(null, res, "Error! phone could not be updated at the moment")
            }
        }, function (err) {
            handleErrorServer(null, res, "")
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
} //complete_update_phone
// module.exports.update_profile = function (req, res) {
//     if (isSet(req.body.accessToken) && isSet(req.body.fullName) && isSet(req.body.email) &&
//         isSet(req.body.bankName) && isSet(req.body.bankAccountNum)) {
//         let accessToken = req.body.accessToken.trim()
//         let fullName = req.body.fullName
//         let email = req.body.email
//         let bankName = req.body.bankName
//         let bankAccountNum = req.body.bankAccountNum
//         let query = User.findOneAndUpdate({
//             accessToken: accessToken
//         }, {
//             $set: {
//                 fullName: fullName,
//                 email: email,
//                 bankName: bankName,
//                 bankAccountNum: bankAccountNum
//             }
//         }, {
//             new: true
//         })
//         query.exec().then(function (doc) { // <- this is the Promise interface.
//             if (doc != null) {
//                 doc.password = null
//                 SuccessResponse.data = doc
//                 SuccessResponse.response_string = "Success! Details update successfully."
//                 res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
//             } else {
//                 handleErrorServer(null, res, "Error! Details could not be updated at the moment. Please retry")
//             }
//         }, function (err) {
//             handleErrorServer(err, res, "Error! Details could not be updated at the moment. Please retry")
//         })
//     } else {
//         handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
//     }
// }
module.exports.update_password = function (req, res) {
    if (isSet(req.body.accessToken) && isSet(req.body.currentPassword) && isSet(req.body.newPassword)) {
        let accessToken = req.body.accessToken.trim()
        let currentPassword = hashPass(req.body.currentPassword)
        let newPassword = hashPass(req.body.newPassword)
        let query = User.findOneAndUpdate({
            $and: [{
                accessToken: accessToken
            }, {
                password: currentPassword
            }]
        }, //{accessToken: accessToken},
            {
                $set: {
                    password: newPassword
                }
            }, {
            new: true
        })
        query.exec().then(function (doc) { // <- this is the Promise interface.
            if (doc != null) {
                doc.password = null
                SuccessResponse.data = doc
                SuccessResponse.response_string = "Success! Details update successfully."
                res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
            } else {
                handleErrorServer(null, res, "Error! Details could not be updated at the moment. Please retry")
            }
        }, function (err) {
            handleErrorServer(err, res, "Error! Details could not be updated at the moment. Please retry")
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}

module.exports.reset_password = function (req, res) {
    if (isSet(req.body.phone)) {
        let phone = req.body.phone
        let pass1 = generatePassword()
        let password = hashPass(pass1)
        let query = User.findOneAndUpdate({
            phone: phone
        }, {
            $set: {
                password: password
            }
        }, {
            new: true
        })
        query.exec().then(function (doc) { // <- this is the Promise interface.
            if (doc != null) {
                sendVerificationCode(doc.phone, "Your temporary password is: " + pass1 + ". Change it on signing in").end(function (response) {
                    if (response.code === 200) //code sent successfully
                    {
                        SuccessResponse.response_string = "Success! New password has been sent to your provided mobile number"
                        res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                    } else {
                        handleErrorServer(null, res, "Error! Password could not be reset. Please retry later")
                    }
                })
            } else {
                //console.log(req.body)
                handleErrorServer(null, res, "Error! Password could not be reset. Please retry later")
            }
        }, function (err) {
            handleErrorServer(null, res, "Error! Password could not be reset. Please retry later")
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}
module.exports.add_game = function (req, res) {
    if (isSet(req.body.gameType) &&
        isSet(req.body.addedBy) &&
        isSet(req.body.isVisible) &&
        isSet(req.body.date) &&
        isSet(req.body.duration)) {
        let times = req.body.date.split("-")
        let times_ = times[3].split(":")
        //let newGame = new Game()
        let gameType = req.body.gameType
        let year = times[0] //req.body.year
        let month = times[1]
        let day = times[2] //req.body.day
        let hour = times_[0] //req.body.hour
        let minute = times_[1] //req.body.minute
        let addedBy = req.body.addedBy
        let isVisible = req.body.isVisible
        let duration = req.body.duration
        let schema = Joi.object().keys({
            gameType: Joi.string().required(),
            addedBy: Joi.string().required(),
            isVisible: [Joi.number().min(1).max(1)],
            duration: Joi.number()
        })
        let data = {
            gameType,
            addedBy,
            isVisible
        }
        //let data = {gameType, year, month, day, hour, minute, addedBy, isVisible}
        Joi.validate(data, schema, (err, value) => {
            if (err) {
                console.log(err)
                res.status(CLIENT_ERROR_RESPONSE_CODE).json(ClientErrorResponse)
            } else {
                let newGame = new Game({
                    gameType: gameType,
                    addedBy: '5d623284b8ef3535001ca35f',
                    isVisible: 1,
                    singleFlag: gameType + "_" + year + "_" + month + "_" + day,
                    gameTime: {
                        year: year,
                        month: month,
                        day: day,
                        hour: hour,
                        minute: minute,
                        duration: duration //3 hrs
                    }
                })
                newGame.save().then(function (game) {
                    SuccessResponse.response_string = "Success! Game added successfully"
                    SuccessResponse.data = game
                    res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                }).catch(function (err) {
                    handleErrorServer(null, res, "")
                })
            }
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}
module.exports.add_all_game = function (req, res) {
    if (isSet(req.body.addedBy) &&
        isSet(req.body.date)) {
        let times = req.body.date.split("-")
        //let newGame = new Game()
        //let gameType = req.body.gameType
        let year = times[0] //req.body.year
        let month = times[1]
        let day = times[2] //req.body.day
        let addedBy = req.body.addedBy
        let isVisible = req.body.isVisible
        //let duration = req.body.duration
        let schema = Joi.object().keys({
            // gameType: Joi.string().required(),
            addedBy: Joi.string().required(),
            isVisible: [Joi.number().min(1).max(1)],
            //duration: Joi.number()
        })
        let data = {
            addedBy,
            isVisible
        }
        Joi.validate(data, schema, (err, value) => {
            if (err) {
                //console.log(err)
                res.status(CLIENT_ERROR_RESPONSE_CODE).json(ClientErrorResponse)
            } else {
                let gamesArr = ["PICK_THREE", "PICK_FOUR", "BINGO_PERM", "GANA_570"]; //, "MEGA_BINGO", "BINGO_PERM", "GANA_570" "MEGA_BINGO",
                let startingTimeArray = [7, 11.5, 15.5];
                let durationArray = [4.5, 4, 8];
                let queryArray = [];
                let orderingId = 1;
                for (let x = 1; x <= 3; x++) {
                    for (let i = 0; i < gamesArr.length; i++) {
                        queryArray.push({
                            gameType: gamesArr[i],
                            addedBy: req.body.addedBy,
                            isVisible: 1,
                            singleFlag: gamesArr[i] + "_" + year + "_" + month + "_" + day + "_" + x,
                            orderingId: orderingId,
                            dateString: year + "_" + month + "_" + day,
                            gameTime: {
                                year: year,
                                month: month,
                                day: day,
                                hour: startingTimeArray[x - 1],
                                minute: 0,
                                duration: durationArray[x - 1] //3 hrs
                            }
                        });
                        orderingId++;
                    }
                }
                Game.insertMany(queryArray, function (error, game) {
                    if (!error) {
                        SuccessResponse.response_string = "Success! Game added successfully"
                        SuccessResponse.data = game
                        res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                    } else {
                        handleErrorServer(null, res, "Error! Duplicate game exist for the same day")
                    }
                });
            }
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}
module.exports.add_mega_bingo = function (req, res) {
    if (isSet(req.body.addedBy) &&
        isSet(req.body.starting_date) && isSet(req.body.accessToken)) {
        let times = req.body.starting_date.split("-")
        let year = times[0] //req.body.year
        let month = times[1]
        let day = times[2] //req.body.day
        let addedBy = req.body.addedBy
        let accessToken = req.body.accessToken
        var myDate = new Date();
        myDate.setFullYear(year);
        myDate.setMonth(month - 1);
        myDate.setDate(day);
        let dayDay = myDate.getDay()
        /*  console.log(myDate)
          console.log(dayDay)
          return*/
        if (dayDay != 6) { //starting day is not satuday
            handleErrorClient(null, res, "Error! Mega Bingo draw can only start on Saturdays. Please update you date")
            return
        }
        let queryArray = [];
        for (let x = 0; x < 8; x++) {
            let dateToUse = new Date(+myDate + (7 * 86400000 * x));
            queryArray.push({
                gameType: "MEGA_BINGO",
                addedBy: req.body.addedBy,
                isVisible: 1,
                singleFlag: "MEGA_BINGO_" + dateToUse.getFullYear() + "_" + (dateToUse.getMonth() + 1) + "_" + (dateToUse.getDate()) + "_" + x,
                orderingId: x,
                dateString: "MEGA_BINGO_" + year + "_" + month,
                gameTime: {
                    year: dateToUse.getFullYear(),
                    month: dateToUse.getMonth() + 1,
                    day: dateToUse.getDate(),
                    hour: 10,
                    minute: 0,
                    duration: 156
                }
            });
        }
        Game.insertMany(queryArray, function (error, game) {
            if (!error) {
                SuccessResponse.response_string = "Success! Game added successfully"
                SuccessResponse.data = game
                res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
            } else {
                handleErrorServer(null, res, "")
            }
        });
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}
module.exports.delete_game_by_date = function (req, res) { //
    if (isSet(req.body.date) && isSet(req.body.accessToken)) {
        let date = req.body.date
        let accessToken = req.body.accessToken
        let times = date.split("-")
        let year = times[0]
        let month = times[1]
        let day = times[2]
        let dateString = year + "_" + month + "_" + day
        Game.remove({
            dateString: dateString
        }).then(function (game) {
            SuccessResponse.response_string = `Success! Games under . ${date} successfully deleted`
            SuccessResponse.data = {}
            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
        }).catch(function (err) {
            handleErrorServer(null, res, "Error! Game could not be deleted at the moment. Please retry")
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}
module.exports.edit_game = function (req, res) {
    if (isSet(req.body.gameType) &&
        isSet(req.body._id) &&
        isSet(req.body.day) &&
        isSet(req.body.hour) &&
        isSet(req.body.minute) &&
        isSet(req.body.duration)) {

        let gameType = req.body.gameType
        let _id = req.body._id
        let day = req.body.day
        let hour = req.body.hour
        let minute = req.body.minute
        let duration = req.body.duration
        let schema = Joi.object().keys({
            gameType: Joi.string().required(),
            day: Joi.number(),
            hour: Joi.number(),
            minute: Joi.number(),
            duration: Joi.number()
        })
        let data = {
            gameType,
            day,
            hour,
            minute,
            duration
        }
        Joi.validate(data, schema, (err, value) => {
            if (err) {
                //console.log(err)
                res.status(CLIENT_ERROR_RESPONSE_CODE).json(ClientErrorResponse)
            } else {
                //console.log(_id)
                //let newGame = new Game()
                let query = Game.findOneAndUpdate({
                    _id: _id
                }, {
                    $set: {
                        'gameTime.day': day,
                        'gameTime.hour': hour,
                        'gameTime.minute': minute,
                        'gameTime.duration': duration
                    }
                }, {
                    new: true
                })
                query.exec().then(function (doc) { // <- this is the Promise interface.
                    if (doc != null) {
                        //doc.password = null
                        SuccessResponse.data = doc
                        SuccessResponse.response_string = "Success! Game updated successfully."
                        res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                    } else {
                        handleErrorServer(null, res, "Error! Game could not be updated at the moment. Please retry")
                    }
                }, function (err) {
                    console.log(err)
                    handleErrorServer(null, res, "Error! Details could not be updated at the moment. Please retry")
                })
            }
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}

module.exports.delete_game = function (req, res) { //delete_incident
    if (isSet(req.body._id)) {
        let _id = req.body._id
        let schema = Joi.object().keys({
            _id: Joi.string().required()
        })
        let data = {
            _id
        }
        Joi.validate(data, schema, (err, value) => {
            if (err) {
                res.status(CLIENT_ERROR_RESPONSE_CODE).json(ClientErrorResponse)
            } else {
                Game.remove({
                    _id: _id
                }).then(function (game) {
                    SuccessResponse.response_string = "Success! Game deleted successfully."
                    res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                }).catch(function (err) {
                    handleErrorServer(null, res, "Error! Game could not be deleted at the moment. Please retry")
                })
            }
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}

module.exports.load_games = function (req, res) {
    if (isSet(req.body.date) && isSet(req.body.playerId) && isSet(req.body.gameType)) {
        let date = req.body.date.split("-")
        Game.find({
            'gameTime.year': date[0],
            'gameTime.month': date[1],
            'gameTime.day': date[2],
            'gameType': req.body.gameType
        }).then(games => {
            //SuccessResponse.data = ""
            if (games.length > 0) {
                let outArr = {
                    games: games[0]
                };
                console.log(games[0])
                GamePlay.countDocuments({
                    playerId: req.body.playerId
                }).exec().then(function (gameCount) {
                    User.find({
                        '_id': req.body.playerId
                    }).then(user => {
                        if (user.length > 0) {
                            //user.totalPlayed = gameCount
                            user[0].password = null
                            outArr.user = user[0]
                            outArr.totalPlayed = gameCount
                            // SuccessResponse.data.game = games[0]
                            // SuccessResponse.data.user = user[0]
                            SuccessResponse.data = outArr
                            console.log(SuccessResponse)
                            SuccessResponse.response_string = "Success! Games loaded successfully."
                            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                        } else {
                            handleErrorServer(null, res, "Error! Invalid user ID provided")
                        }
                    }).catch(function (err) {
                        handleErrorServer(null, res, "Error! Game could not be loaded at the moment. Please retry")
                    });
                }).catch(err => handleErrorClient(null, res, ""))
            } else {
                handleErrorServer(null, res, `Error! invalid game type: ${req.body.gameType} re game type ${req.body.gameType} not available at moment. Please retry`)
            }
        }).catch(function (err) {
            handleErrorServer(null, res, "Error! Game could not be loaded at the moment. Please retry")
        });
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }

} //load_all_games
module.exports.load_daily_games = function (req, res) {
    if (isSet(req.body.accessToken) && isSet(req.body.playerId)) {
        let today = new Date().toLocaleString('en-US', {
            timeZone: 'Africa/Lagos'
        });
        let tomorrow = new Date(new Date().getTime() + (1 * 24 * 60 * 60 * 1000)).toLocaleString('en-US', {
            timeZone: 'Africa/Lagos'
        });
        let tomorrow_ = new Date(new Date().getTime() + (1 * 24 * 60 * 60 * 1000));
        let d = new Date(); // for now
        let todayDay = d.getDate()
        let tommorowDay = tomorrow_.getDate()
        let currentInSeconds = d.getSeconds() + d.getMinutes() * 60 + d.getHours() * 3600; // => 9
        console.log(currentInSeconds)
        let todayFlag = makeDateFlag(today);
        let tomorrowFlag = makeDateFlag(tomorrow);
        let megaBingoFlag = "MEGA_BINGO_" + d.getFullYear() + "_" + (d.getMonth() + 1)
        // console.log(tomorrowFlag)// return;//{dateString: todayFlag},
        User.find({
            $and: [{
                accessToken: req.body.accessToken
            }, {
                _id: req.body.playerId
            }]
        }) //{accessToken: req.body.accessToken}, {_id: req.body.playerId},
            .then(user => { // .sort('gameType').sort('orderingId').then(user => {
                if (user.length > 0) {
                    Game.find({
                        $or: [{
                            dateString: todayFlag
                        }]
                    }).sort('gameType').sort('orderingId').then(games => {
                        if (games.length > 0) {

                            let outArr = {}
                            let allGames = [],
                                gameToplay = [],
                                pickThree = [],
                                pickFour = [],
                                bingoPerm = []
                            gana = []
                            console.log(tomorrowFlag)
                            Game.find({
                                dateString: tomorrowFlag
                            }).sort('gameType').sort('orderingId').then(games_tomoro => {
                                if (games_tomoro.length > 0) {
                                    Game.find({
                                        dateString: megaBingoFlag
                                    }).sort('orderingId').then(megabingo => {
                                        allGames = games.concat(games_tomoro);
                                        allGames.forEach(function (item, index) {
                                            let dis = item.gameTime
                                            if (((dis.hour + dis.duration - 1) * 3600) + (dis.minute * 60) > currentInSeconds && dis.day == todayDay //get game of today not expired
                                                ||
                                                dis.day == tommorowDay) {
                                                switch (item.gameType) {
                                                    case 'PICK_THREE':
                                                        if (pickThree.length < 2) pickThree.push(item)
                                                        break

                                                    case 'PICK_FOUR':
                                                        if (pickFour.length < 2) pickFour.push(item)
                                                        break

                                                    case 'BINGO_PERM':
                                                        if (bingoPerm.length < 2) bingoPerm.push(item)
                                                        break

                                                    case 'GANA_570':
                                                        if (gana.length < 2) gana.push(item)
                                                        break
                                                }

                                            }
                                        });
                                        let megaBingo = []
                                        megabingo.forEach(function (item, index) {
                                            let dis = item.gameTime
                                            if (((dis.hour + dis.duration) * 3600) + (dis.minute * 60) > currentInSeconds) {
                                                if (megaBingo.length < 2) megaBingo.push(item)
                                            }
                                        });
                                        // console.log(megaBingo)
                                        gameToplay = {
                                            pickThree: pickThree,
                                            pickFour: pickFour,
                                            bingoPerm: bingoPerm,
                                            megaBingo: megaBingo,
                                            gana: gana
                                        }
                                        GamePlay.countDocuments({
                                            playerId: req.body.playerId
                                        }).exec().then(function (gameCount) {
                                            User.find({
                                                '_id': req.body.playerId
                                            }).then(user => {
                                                if (user.length > 0) {
                                                    user[0].password = null
                                                    outArr.user = user[0]
                                                    outArr.games = gameToplay
                                                    outArr.totalPlayed = gameCount
                                                    SuccessResponse.totalBalance = outArr.user.accountBalance; // + outArr.user.bonusBalance
                                                    SuccessResponse.data = outArr
                                                    SuccessResponse.response_string = "Success! Games loaded successfully." //today
                                                    SuccessResponse.today = today //today
                                                    res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                                                } else {
                                                    handleErrorServer(null, res, "Error! Invalid user ID provided")
                                                }
                                            }).catch(function (err) {
                                                handleErrorServer(null, res, "Error! Game could not be loaded at the moment. Please retry")
                                            });
                                        }).catch(err => handleErrorClient(null, res, "Error! Game could not be loaded at the moment. Please retry"))
                                        /*}
                                        else {
                                            handleErrorServer(null, res, `Error! Game not available at moment. Please retry`)
                                        }*/
                                    })
                                } else {
                                    handleErrorServer(null, res, err.toString())
                                }
                            }).catch(err => handleErrorClient(null, res, `Error! Game not available at moment. Please retry`))
                        } else {
                            handleErrorServer(null, res, `Error! Game not available at moment. Please retry`)
                        }
                    }).catch(function (err) {
                        handleErrorServer(null, res, "Error! Game could not be loaded at the moment. Please retry")
                    });
                } else {
                    handleErrorServer(null, res, `Error! Game not available at moment. Please retry`)
                }
            }).catch(function (err) {
                handleErrorServer(null, res, "Error! Game could not be loaded at the moment. Please retry")
            });

    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}
module.exports.load_all_games_date_ = function (req, res) {
    if (isSet(req.body.accessToken) && isSet(req.body.playerId)) {
        let today = new Date().toLocaleString('en-US', {
            timeZone: 'Africa/Lagos'
        });
        let tomorrow = new Date(new Date().getTime() + (1 * 24 * 60 * 60 * 1000)).toLocaleString('en-US', {
            timeZone: 'Africa/Lagos'
        });
        let d = new Date(); // for now
        let todayDay = d.getDate()
        let currentInSeconds = d.getSeconds() + d.getMinutes() * 60 + d.getHours() * 3600; // => 9
        //console.log(currentInSeconds)
        let todayFlag = makeDateFlag(today);
        let tomorrowFlag = makeDateFlag(tomorrow);
        let megaBingoFlag = "MEGA_BINGO_" + d.getFullYear() + "_" + (d.getMonth() + 1)
        // console.log(mega_bingo_flag); return;
        Game.find({
            dateString: todayFlag
        }).sort('gameType').sort('orderingId').then(games => {
            if (games.length > 0) {
                let outArr = {}
                let allGames = [],
                    gameToplay = [],
                    pickThree = [],
                    pickFour = [],
                    bingoPerm = []
                gana = []
                console.log(tomorrowFlag)
                Game.find({
                    dateString: tomorrowFlag
                }).sort('gameType').sort('orderingId').then(games_tomoro => {
                    if (games_tomoro.length > 0) {
                        Game.find({
                            dateString: megaBingoFlag
                        }).sort('orderingId').then(megabingo => {
                            //if (megabingo.length > 0) {
                            //console.log(megabingo)
                            //let current_vs =
                            allGames = games.concat(games_tomoro);
                            allGames.forEach(function (item, index) {
                                let dis = item.gameTime
                                if (((dis.hour + dis.duration) * 3600) + (dis.minute * 60) > currentInSeconds && dis.day == todayDay //get game of today not expired
                                    ||
                                    dis.day == todayDay + 1) {
                                    switch (item.gameType) {
                                        case 'PICK_THREE':
                                            if (pickThree.length < 2) pickThree.push(item)
                                            break

                                        case 'PICK_FOUR':
                                            if (pickFour.length < 2) pickFour.push(item)
                                            break

                                        case 'BINGO_PERM':
                                            if (bingoPerm.length < 2) bingoPerm.push(item)
                                            break

                                        case 'GANA_570':
                                            if (gana.length < 2) gana.push(item)
                                            break
                                    }

                                }
                            });
                            let megaBingo = []
                            megabingo.forEach(function (item, index) {
                                let dis = item.gameTime
                                if (((dis.hour + dis.duration) * 3600) + (dis.minute * 60) > currentInSeconds) {
                                    if (megaBingo.length < 2) megaBingo.push(item)
                                }
                                /*  if  (d.getMonth()+1 == dis.month//get game for this month  && d.getDate() >= dis.day
                                      || d.getMonth()+1 < dis.month/!**get games for next month*!/) {  //console.log(item) //|| d.getMonth()+1 < dis.month
                                      console.log(item)
                                      if (megaBingo.length < 2) megaBingo.push(item)
                                  }*/
                            });
                            console.log(megaBingo)
                            gameToplay = {
                                pickThree: pickThree,
                                pickFour: pickFour,
                                bingoPerm: bingoPerm,
                                megaBingo: megaBingo,
                                gana: gana
                            }
                            GamePlay.countDocuments({
                                playerId: req.body.playerId
                            }).exec().then(function (gameCount) {
                                User.find({
                                    '_id': req.body.playerId
                                }).then(user => {
                                    if (user.length > 0) {
                                        user[0].password = null
                                        outArr.user = user[0]
                                        outArr.games = gameToplay
                                        outArr.totalPlayed = gameCount
                                        SuccessResponse.data = outArr //outArr
                                        SuccessResponse.response_string = "Success! Games loaded successfully." //today
                                        SuccessResponse.today = today //today
                                        res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                                    } else {
                                        handleErrorServer(null, res, "Error! Invalid user ID provided")
                                    }
                                }).catch(function (err) {
                                    handleErrorServer(null, res, "Error! Game could not be loaded at the moment. Please retry")
                                });
                            }).catch(err => handleErrorClient(null, res, "y1"))
                            /* }
                             else {
                                 handleErrorServer(null, res, `Error! Game not available at moment. Please retry`)
                             }*/
                        })
                    } else {
                        handleErrorServer(null, res, err.toString())
                    }
                }).catch(err => handleErrorClient(null, res, "y2"))
            } else {
                handleErrorServer(null, res, `Error! Game not available at moment. Please retry`)
            }
        }).catch(function (err) {
            handleErrorServer(null, res, "Error! Game could not be loaded at the moment. Please retry")
        });
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}

module.exports.play_game = async function (req, res) {
    let newGamePlay = new GamePlay()
    let newTransaction = new Transaction()
    if (isSet(req.body.gameType) && isSet(req.body.gameId) && isSet(req.body.playerId) &&
        isSet(req.body.stakeAmount) && isSet(req.body.pick) && isSet(req.body.spot) && isSet(req.body.accessToken)) {
        let pick = req.body.pick
        let gameType = req.body.gameType
        let stakeAmount = parseFloat(req.body.stakeAmount)
        let playerId = req.body.playerId
        let gameId = req.body.gameId
        let spot = req.body.spot
        let initialBalance = 0
        let finalBalance = 0
        let flag = false
        let subType = isSet(req.body.subType) ? req.body.subType : "";
        let pickArray = JSON.parse("[" + pick + "]")
        let gameNames = {
            'PICK_THREE': 'PICK 3',
            'PICK_FOUR': 'PICK 4',
            'MEGA_BINGO': 'Mega Bingo',
            'BINGO_PERM': 'Bingo Perm',
            'KENO': 'Keno',
            'GANA': 'Gana 5/70',
        }
        let friendlyName = gameNames[gameType]
        console.log(friendlyName)
        switch (gameType) {
            case 'PICK_THREE':
                flag = (pickArray.length === 3)
                break

            case 'PICK_FOUR': //Mega bingo
                flag = (pickArray.length === 4)
                break

            case 'MEGA_BINGO': //Mega bingo
                flag = (pickArray.length === 6) //BINGO_PERM
                break

            case 'BINGO_PERM': //Mega bingo
                flag = (pickArray.length === 5) //
                break

            case 'KENO': //Mega bingo
                flag = (pickArray.length === parseInt(spot)) //
                break

            case 'GANA': //Mega bingo
                flag = (pickArray.length === parseInt(spot)) //
                break

            default:
                flag = false
        }
        if (flag) {
            User.find({
                'accessToken': req.body.accessToken
            }).then(user_ => {
                if (user_ != null) {
                    let user = user_[0]
                    let finalBonusBalance, finalTotalBalance, finalActualBalance = 0
                    let initialTotalBalance = user.actualBalance + user.bonusBalance
                    let initialBonusBalance = user.bonusBalance
                    let initialActualBalance = user.actualBalance
                    if (initialBonusBalance > stakeAmount) { //if bonus is greater, remove from bonus
                        finalBonusBalance = initialBonusBalance - stakeAmount
                        finalActualBalance = initialActualBalance
                        finalTotalBalance = finalActualBalance + finalBonusBalance
                    } else { //add bonus to main account and remove all
                        finalBonusBalance = 0
                        finalTotalBalance = finalActualBalance = initialActualBalance + initialBonusBalance - stakeAmount
                    }
                    if (finalTotalBalance > 1) {
                        let query = User.findOneAndUpdate({
                            '_id': req.body.playerId
                        }, {
                            $set: {
                                actualBalance: finalActualBalance,
                                bonusBalance: 0,
                                totalBalance: finalTotalBalance
                            }
                        }, {
                            new: true
                        })
                        query.exec().then(function (user) { // <- this is the Promise interface.
                            if (user != null) {
                                newGamePlay.countGamePlay()
                                    .then(function (count) {
                                        console.log(count)
                                        let gamePlayId = count + 1000
                                        console.log(gamePlayId)
                                        newGamePlay.createGamePlay(
                                            //gameType, friendlyName, gamePlayIdNumber, playerIdNumber, gameId, playerId, initialBalance,
                                            //stakeAmount, finalBalance, pick, spot, subType
                                            gameType, friendlyName, gamePlayId, user.userId, gameId, playerId, initialTotalBalance, stakeAmount, finalTotalBalance, pick, spot, subType
                                        )
                                        newGamePlay.save()
                                            .then(function (game) { //playerIdNumber
                                                //console.log(game)
                                                SuccessResponse.response_string = "Success! Your game was successful"

                                                SuccessResponse.data = game
                                                res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                                            }).catch(err => handleErrorClient(null, res, err.toString()))
                                    }).catch(err => function () { })
                            } else {
                                handleErrorServer(null, res, "Error! Error finding player by specified details")
                            }
                        }, function (err) {
                            handleErrorServer(null, res, "Error! Error finding player by specified details")
                        })
                    } else {
                        handleErrorClient(null, res, "Error! Insufficient account balance. game could not be initiated")
                    }
                } else {
                    handleErrorClient(null, res, "Can't find user specified as player")
                }
            }).catch(err => handleErrorClient(null, res, "Error! Error finding player by specified details"))
        } else {
            handleErrorClient(null, res, "Invalid game request. Please retry your action")
        }
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}

module.exports.add_fund = async function (req, res) {
    let newTransaction = new Transaction()
    if (isSet(req.body.amount) && isSet(req.body.accessToken) && isSet(req.body.agentId)) {
        let agentId = req.body.agentId
        let accessToken = req.body.accessToken
        let amount = req.body.amount
        let method = req.body.method
        let superAgentId = req.body.superAgentId
        if (method == "credit") {
            //funds account from credit balance accessToken & agentId are for same user
            await addFundsFromCreditDone(accessToken, amount, agentId, res)
        } else if (method == "fund_agent_super") {
            //super agent funds agent 's account; accessToken is for superAgent & agentId is for current agent to fund
            await fundAgentBySuperAgent(accessToken, amount, agentId, superAgentId, res)
        } else if (method == "credit_pending") {
            //agent cash out credit from superAgent 
            await cashOutCredit(accessToken, amount, agentId, res)
        } else {
            //transfer, card, cash for direct self acount funding agentId by either agent or superAgent
            await addFundsFromOthers(accessToken, amount, agentId, method, res)
        }
    } else { //
        handleErrorClient(null, res, "One or more required fields omitted")
    }
}

module.exports.load_game_history = function (req, res) { //
    if (isSet(req.body.accessToken) && isSet(req.body.playerId)) {
        User.find({
            $and: [{
                accessToken: req.body.accessToken
            }, {
                _id: req.body.playerId
            }]
        }) //{accessToken: req.body.accessToken}, {_id: req.body.playerId},
            .then(user => { // .sort('gameType').sort('orderingId').then(user => {
                if (user.length > 0) {
                    let condition = null
                    if (isSet(req.body.gamePlayIdNumber)) {
                        condition = {
                            $and: [{
                                gamePlayIdNumber: req.body.gamePlayIdNumber
                            }]
                        }
                        //GamePlay.find(condition)
                    } else {
                        condition = {
                            $and: [{
                                playerId: req.body.playerId
                            }]
                        }
                    }
                    GamePlay.find(condition) //{accessToken: req.body.accessToken}, {_id: req.body.playerId},
                        .sort({
                            'createdAt': -1
                        }).then(gamePlay => { // .sort('gameType').sort('orderingId').then(user => {
                            let SuccessResponse = {}
                            SuccessResponse.status = true
                            SuccessResponse.response_string = "Success! Game history loaded successfully"
                            SuccessResponse.data = gamePlay
                            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                        }).catch(function (err) {
                            handleErrorServer(null, res, "Error! Game history could not be loaded at the moment. Please retry")
                        });
                } else {
                    handleErrorServer(null, res, `Error! Game history not available at moment. Please retry`)
                }
            }).catch(function (err) {
                handleErrorServer(null, res, "Error! Game history could not be loaded at the moment. Please retry")
            });

    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}
module.exports.load_transaction = function (req, res) { //load_notifications
    if (isSet(req.body.accessToken) && isSet(req.body.userId)) {
        // let superAgent = isSet(req.body.superAgent) ? req.body.superAgent : "";
        let loadType = isSet(req.body.loadType) ? req.body.loadType : ""; //superagent{credit, funding}, ""
        let superAgentId = isSet(req.body.superAgentId) ? req.body.superAgentId : "";
        let condition = ""
        if (loadType == "superagent_agent" && superAgentId != "") {
            //load transactions for superAgent: between superAgent: superAgentId & agent: userId
            condition = { // //{ performerId: superAgentId }, { performeeId: "5e09931459c3ae590408da6b" }, { actionType: "credit" } super_to_agent
                $or: [{
                    $and: [{
                        performerId: req.body.userId
                    }, {
                        actionType: "credit"
                    }]
                },
                {
                    $and: [{
                        performerId: superAgentId
                    }, {
                        performeeId: req.body.userId
                    }, {
                        actionType: "super_to_agent"
                    }]
                }
                ]
            }
        } else if (loadType == "superagent_bingo") {
            //load transactions for superAgent: between superAgent: superAgentId & agent: userId
            condition = {
                $and: [{
                    performerId: req.body.userId
                }, {
                    actionType: "transfer"
                }]
            }
        } else {
            condition = {
                $or: [{
                    performerId: req.body.userId
                }]
            }
        }
        //console.log(condition)

        User.find({
            $and: [{
                accessToken: req.body.accessToken
            }]
        }) //{accessToken: req.body.accessToken}, {_id: req.body.playerId},
            .then(user => { // .sort('gameType').sort('orderingId').then(user => {
                if (user.length > 0) {
                    Transaction.find(condition) //{accessToken: req.body.accessToken}, {_id: req.body.playerId},
                        .sort({
                            'createdAt': -1
                        }).then(transaction => { // .sort('gameType').sort('orderingId').then(user => {
                            let SuccessResponse = {}
                            SuccessResponse.status = true
                            SuccessResponse.count = transaction.length
                            SuccessResponse.response_string = "Success! Transactions loaded successfully"
                            SuccessResponse.data = transaction
                            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                        }).catch(function (err) {
                            handleErrorServer(null, res, err.message)
                        });
                } else {
                    handleErrorServer(null, res, "Error! User not valid with provided credentials")
                }
            }).catch(function (err) {
                handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
            });

    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}

module.exports.load_winning = function (req, res) { //load_notifications
    if (isSet(req.body.accessToken) && isSet(req.body.agentId)) {
        //let superAgent = isSet(req.body.superAgent) ? req.body.superAgent : "";
        let condition = {
            $and: [{
                performerId: req.body.agentId
            }, {
                action: "claim_winning"
            }]
        }
        User.find({
            $and: [{
                accessToken: req.body.accessToken
            }]
        }) //{accessToken: req.body.accessToken}, {_id: req.body.playerId},
            .then(user => { // .sort('gameType').sort('orderingId').then(user => {
                if (user.length > 0) {
                    Transaction.find(condition) //{accessToken: req.body.accessToken}, {_id: req.body.playerId},
                        .sort({
                            'createdAt': -1
                        }).then(transaction => { // .sort('gameType').sort('orderingId').then(user => {
                            let SuccessResponse = {}
                            SuccessResponse.status = true
                            SuccessResponse.count = transaction.length
                            SuccessResponse.response_string = "Success! Transactions loaded successfully"
                            SuccessResponse.data = transaction
                            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                        }).catch(function (err) {
                            handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
                        });
                } else {
                    handleErrorServer(null, res, "Error! Invalid user credentials. Please retry")
                }
            }).catch(function (err) {
                handleErrorServer(null, res, "Error! Error fetching user with provided details. Please retry")
            });

    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}
module.exports.add_notifications = function (req, res) {
    let newNotification = new Notification()
    if (isSet(req.body.accessToken) && isSet(req.body.title) && isSet(req.body.text)) {
        let accessToken = req.body.accessToken
        let title = req.body.title
        let text = req.body.text

        User.find({
            'accessToken': accessToken
        }).then(user => {
            //console.log(user)
            if (user.length > 0) {
                newNotification.createNotification(title, text)
                newNotification.save()
                    .then(function (out) {
                        let SuccessResponse = {}
                        SuccessResponse.status = true
                        SuccessResponse.response_string = "Success! Notification added successfully"
                        res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                    }).catch(err => handleErrorClient(null, res, ""))
            } else {
                handleErrorServer(null, res, "Error! Specified user cannot be found")
            }
        }).catch(err => handleErrorServer(null, res, "Error! Application error. Please retry later"))
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}
module.exports.load_notifications = function (req, res) { //
    if (isSet(req.body.accessToken)) {
        User.find({
            $and: [{
                accessToken: req.body.accessToken
            }]
        }) //{accessToken: req.body.accessToken}, {_id: req.body.playerId},
            .then(user => { // .sort('gameType').sort('orderingId').then(user => {
                if (user.length > 0) {
                    Notification.find({}) //{accessToken: req.body.accessToken}, {_id: req.body.playerId},
                        .then(notification => { // .sort('gameType').sort('orderingId').then(user => {
                            let SuccessResponse = {}
                            SuccessResponse.status = true
                            SuccessResponse.response_string = "Success! Notifications loaded"
                            SuccessResponse.data = notification
                            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                        }).catch(function (err) {
                            handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
                        });
                } else {
                    handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
                }
            }).catch(function (err) {
                handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
            });

    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}
///
module.exports.get_game_by_id = function (req, res) { //
    if (isSet(req.body.accessToken) && isSet(req.body.gameIdNumber)) {
        User.find({
            $and: [{
                accessToken: req.body.accessToken
            }]
        }) //{accessToken: req.body.accessToken}, {_id: req.body.playerId},
            .then(user => { // .sort('gameType').sort('orderingId').then(user => {
                if (user.length > 0) {
                    GamePlay.find({
                        gamePlayIdNumber: req.body.gameIdNumber
                    }) //{accessToken: req.body.accessToken}, {_id: req.body.playerId},
                        .then(gameplay => { // .sort('gameType').sort('orderingId').then(user => {
                            let SuccessResponse = {}
                            SuccessResponse.status = true
                            SuccessResponse.response_string = "Success! Game loaded"
                            SuccessResponse.data = gameplay
                            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                        }).catch(function (err) {
                            handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
                        });
                } else {
                    handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
                }
            }).catch(function (err) {
                handleErrorServer(null, res, "Error! Action could be completed at the moment. Please retry")
            });

    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}

module.exports.claim_winning = async function (req, res) { //load_agents
    let newTransaction = new Transaction()
    if (isSet(req.body.amount) && isSet(req.body.accessToken) &&
        isSet(req.body.agentId) && isSet(req.body.performerEventId) && isSet(req.body.from) && isSet(req.body.gameType) &&
        isSet(req.body.playedNumber) && isSet(req.body.winningNumber)) {
        let agentId = req.body.agentId
        let accessToken = req.body.accessToken
        let amount = req.body.amount
        let performerEventId = req.body.performerEventId
        let from = req.body.from //{sales, bingo, superagent} 
        let gameType = ""
        let playedNumber = ""
        let winningNumber = ""
        let superAgent = isSet(req.body.superAgent) ? req.body.superAgent : ""
        if (from == "sales" || from == "bingo" || from == "superagent") {
            if (from == "sales") {
                await payWinningFromSales(accessToken, amount, performerEventId, agentId, superAgent, gameType, playedNumber, winningNumber, res);
            } else {
                await payWinningFromOthers(accessToken, amount, performerEventId, agentId, superAgent, from, gameType, playedNumber, winningNumber, res);
            }
        } else {
            handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
        }
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}

module.exports.load_agents = async function (req, res) { //
    if (isSet(req.body.accessToken) && isSet(req.body.id)) {
        let accessToken = req.body.accessToken
        let id = req.body.id
        let query = User.findOne({ //check that superagent is login and active
            accessToken: accessToken,
            _id: id
        })
        query.exec().then(function (doc_) { // <- this is the Promise interface.
            if (doc_ != null && doc_.agentType == "superagent" && doc_.accessToken == accessToken && doc_._id == id) { //
                console.log(doc_)
                let query = User.find({ //load agents that are under this super agent
                    superAgent: id,
                    isAgent: true
                }, {
                    password: 0
                })
                query.exec().then(function (doc) { // <- this is the Promise interface.
                    //  console.log(doc)
                    if (doc != null) {
                        SuccessResponse.response_string = "Success! Agents loaded successfully"
                        SuccessResponse.count = doc.length
                        SuccessResponse.data = doc
                        res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                    } else {
                        handleErrorServer(null, res, "Error! Agents could not be loaded at the moment. Please retry with valid details")
                    }
                }, function (err) {
                    handleErrorServer(null, res, err.message)
                })
            } else {
                handleErrorServer(null, res, "Error! Invalid access credentials. Please retry with valid details")
            }
        }, function (err) {
            handleErrorServer(null, res, err.message)
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}

module.exports.add_subagent = async function (req, res) { //update_suspension
    if (isSet(req.body.accessToken) && isSet(req.body.id)) {
        let accessToken = req.body.accessToken
        let id = req.body.id
        let query = User.findOne({
            accessToken: accessToken
        })
        query.exec().then(function (doc_) { // <- this is the Promise interface.

            if (doc_ != null && doc_.agentType == "superagent" && doc_.accessToken == accessToken && doc_._id == id) { //
                newUser.createUser(fullName, userId, phone, email, hashPass(password), singleFlag, agentType, superAgent, isAgent, 0, 1500.00)
                newUser.save().then(function (user) {
                    //user.password = null
                    SuccessResponse.response_string = 'Registration started successfully. Please proceed to the next stage'
                    user.password = null
                    SuccessResponse.data = user
                    let phoneVerificationCode = generateVerificationCode()
                    let message = "Hey buddy, welcome to Bingo9ja. Your verification code is: " + phoneVerificationCode
                    sendVerificationCode(phone, message).end(function (response) {
                        if (response.code === 200) //code sent successfully
                        {
                            User.findOneAndUpdate({
                                phone: phone
                            }, {
                                $set: {
                                    phoneVerificationCode: phoneVerificationCode
                                }
                            }, {
                                new: true
                            }, function (err, doc) {
                                if (err) {
                                    handleErrorClient(null, res, "Error! Registration could not continue.")
                                } else {
                                    SuccessResponse.response_string = "Success! Registration successful. Verification code has been sent to your provide mobile number."
                                    doc.phoneVerificationCode = null
                                    doc.password = null
                                    SuccessResponse.data = doc //{phoneVerificationCode: phone}
                                    res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                                }
                            })
                        } else {
                            SuccessResponse.response_string = "Success! Registration successfully but verification code not be sent. Please request 'Resend Code' to retry sending it"
                            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                        }
                    })
                }).catch(function (err) {
                    if (err.code === 11000)
                        ServerErrorResponse.error_string = "Duplicate record exist. Try password reset should you forget your password"
                    else
                        ServerErrorResponse.error_string = "Registration could not proceed. Please retry your action"
                    //handleErrorServer(null, res, ServerErrorResponse.error_string)
                    handleErrorServer(null, res, err.message)
                })
            } else {
                handleErrorServer(null, res, "Error! Invalid access credentials. Please retry with valid details")
            }
        }, function (err) {
            handleErrorServer(null, res, err.message)
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}

module.exports.add_subagent = async function (req, res) { //update_suspension
    if (isSet(req.body.accessToken) && isSet(req.body.id)) {
        let accessToken = req.body.accessToken
        let id = req.body.id
        let query = User.findOne({
            accessToken: accessToken
        })
        query.exec().then(function (doc_) { // <- this is the Promise interface.

            if (doc_ != null && doc_.agentType == "superagent" && doc_.accessToken == accessToken && doc_._id == id) { //
                newUser.createUser(fullName, userId, phone, email, hashPass(password), singleFlag, agentType, superAgent, isAgent, 0, 1500.00)
                newUser.save().then(function (user) {
                    //user.password = null
                    SuccessResponse.response_string = 'Registration started successfully. Please proceed to the next stage'
                    user.password = null
                    SuccessResponse.data = user
                    let phoneVerificationCode = generateVerificationCode()
                    let message = "Hey buddy, welcome to Bingo9ja. Your verification code is: " + phoneVerificationCode
                    sendVerificationCode(phone, message).end(function (response) {
                        if (response.code === 200) //code sent successfully
                        {
                            User.findOneAndUpdate({
                                phone: phone
                            }, {
                                $set: {
                                    phoneVerificationCode: phoneVerificationCode
                                }
                            }, {
                                new: true
                            }, function (err, doc) {
                                if (err) {
                                    handleErrorClient(null, res, "Error! Registration could not continue.")
                                } else {
                                    SuccessResponse.response_string = "Success! Registration successful. Verification code has been sent to your provide mobile number."
                                    doc.phoneVerificationCode = null
                                    doc.password = null
                                    SuccessResponse.data = doc //{phoneVerificationCode: phone}
                                    res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                                }
                            })
                        } else {
                            SuccessResponse.response_string = "Success! Registration successfully but verification code not be sent. Please request 'Resend Code' to retry sending it"
                            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                        }
                    })
                }).catch(function (err) {
                    if (err.code === 11000)
                        ServerErrorResponse.error_string = "Duplicate record exist. Try password reset should you forget your password"
                    else
                        ServerErrorResponse.error_string = "Registration could not proceed. Please retry your action"
                    //handleErrorServer(null, res, ServerErrorResponse.error_string)
                    handleErrorServer(null, res, err.message)
                })
            } else {
                handleErrorServer(null, res, "Error! Invalid access credentials. Please retry with valid details")
            }
        }, function (err) {
            handleErrorServer(null, res, err.message)
        })
    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}

module.exports.update_suspension = async function (req, res) { //approve_winning_superagent
    if (isSet(req.body.accessToken) && isSet(req.body.agentId) && isSet(req.body.flag)) {
        let accessToken = req.body.accessToken
        let agentId = req.body.agentId
        let flag = req.body.flag

        await updateSuspension(accessToken, agentId, flag, res)

    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}

module.exports.approve_winning_subagent = async function (req, res) { //
    if (isSet(req.body.accessToken) && isSet(req.body.transactionId) && isSet(req.body.status)) {
        let accessToken = req.body.accessToken
        let transactionId = req.body.transactionId
        let status = req.body.status
        await approveWinningSubAgent(accessToken, transactionId, status, res) //(accessToken, agentId, flag, res)

    } else {
        handleErrorClient(null, res, "One or more mandatory fields are missing. Please retry your action")
    }
}

function flip(o) {
    var newObj = {}
    Object.keys(o).forEach((el, i) => {
        newObj[o[el]] = el;
    });
    return newObj;
}


function makeAccessToken(pass, phone) {
    return sha1(pass + phone + moment() + generateVerificationCode())
}

function handleErrorClient(err, res, message) {
    if (message != "") {
        ClientErrorResponse.error_string = message
    } else {
        ClientErrorResponse.error_string = "Error! Something went wrong. Request could not continue."
    }
    res.status(CLIENT_ERROR_RESPONSE_CODE).json(ClientErrorResponse)
}

function handleErrorServer(err, res, message) {
    if (err != null && err.code == 11000) {
        ServerErrorResponse.error_string = "Error! Duplicate key update discovered. Please retry"
    } else if (message != "") {
        // console.log(message)
        ServerErrorResponse.error_string = message
    } else {
        ServerErrorResponse.error_string = "Error! Something went wrong. Request could not continue."
    }
    res.status(SERVER_ERROR_RESPONSE_CODE).json(ServerErrorResponse)
}

function sendVerificationCode(phone, message) {
    let req = unirest("POST", "https://nexmo-nexmo-messaging-v1.p.rapidapi.com/send-sms")
    req.query({
        "text": message,
        "from": "Bingo9ja",
        "to": phone
    })
    req.headers({
        "x-rapidapi-host": "nexmo-nexmo-messaging-v1.p.rapidapi.com",
        "x-rapidapi-key": "f676b36206mshd98e3c1ffdd7e7ap109bb1jsnbd2648fee358",
        "content-type": "application/x-www-form-urlencoded"
    })
    req.form({})
    return req
}

function hashPass(item) {
    return sha1(item)
}

isSet = function (item) {
    return (typeof item !== "undefined")
}

module.exports.isSet = function (item) {
    return (typeof item !== "undefined")
}

generateVerificationCode = function () {
    var numbers = ""
    for (var i = 0; i < 6; i++) {
        numbers += "" + Math.floor(Math.random() * (9 - 0 + 1) + 0)
    }
    return numbers
}

generatePassword = function () {
    var numbers = ""
    for (var i = 0; i < 8; i++) {
        numbers += "" + Math.floor(Math.random() * (9 - 0 + 1) + 0)
    }
    return numbers
}


makeDateFlag = function (today) {
    let firstExplode = today.split(",");
    let secondExplode = firstExplode[0].trim().split("/")
    return secondExplode[2] + "_" + secondExplode[0] + "_" + secondExplode[1];
}

async function approveWinningSubAgent(accessToken, transactionId, status, res) {
    console.log(accessToken)
    let session = await mongoose.startSession();
    session.startTransaction();
    try {
        let opts = {
            session,
            new: true
        };
        let A = await User.findOne({
            accessToken: accessToken
        }, null, opts);
        //console.log(A)
        //return;
        if (A != null && A.agentType == "superagent") {
            let trans = await Transaction.findOneAndUpdate({
                _id: transactionId
            }, {
                $set: {
                    status: status
                }
            }, opts);
            await session.commitTransaction();
            session.endSession();

            let SuccessResponse = {}
            SuccessResponse.status = true
            SuccessResponse.response_string = `Success! Winning approved successfully.`
            SuccessResponse.data = {}
            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
        } else {
            await session.abortTransaction();
            session.endSession();
            handleErrorClient(null, res, "Provided credential is not a SuperAgent")
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        handleErrorClient(null, res, "") //"Provided credential is not a SuperAgent"
    }
}

async function updateSuspension(accessToken, agentId, flag, res) {
    console.log(accessToken)
    let session = await mongoose.startSession();
    session.startTransaction();
    try {
        let opts = {
            session,
            new: true
        };
        let A = await User.findOne({
            accessToken: accessToken
        }, null, opts);
        //console.log(A)
        //return;
        if (A != null && A.agentType == "superagent") {
            let game = await User.findOneAndUpdate({
                _id: agentId
            }, {
                $set: {
                    isSuspended: flag
                }
            }, opts);
            await session.commitTransaction();
            session.endSession();

            let SuccessResponse = {}
            SuccessResponse.status = true
            SuccessResponse.response_string = `Success! Suspension updated successfully.`
            SuccessResponse.data = {}
            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
        } else {
            await session.abortTransaction();
            session.endSession();
            handleErrorClient(null, res, "Provided credential is not a SuperAgent")
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        handleErrorClient(null, res, "") //"Provided credential is not a SuperAgent"
    }
}

async function payWinningFromSales(accessToken, amount, gameIdNumber, agentId, superAgent, gameType, playedNumber, winningNumber, res) {
    let session = await mongoose.startSession();
    session.startTransaction();
    try {
        let opts = {
            session,
            new: true
        };
        let A = await User.findOneAndUpdate({
            accessToken: accessToken
        }, {
            $inc: {
                winningBalance: amount //increament winning balance
            }
        }, opts);
        //console.log(A)
        if (A != null) {
            //console.log("yes")
            let number = await Transaction.countDocuments();
            let transactionIdNumber = number + 1000
            let newTransaction = new Transaction()
            newTransaction.createTransactionWinning(
                transactionIdNumber, agentId, gameIdNumber,
                A.totalBalance, A.totalBalance, 0, 0, A.initialCreditBalance, A.finalCreditBalance,
                amount, 'claim_winning', 0, 'sales', superAgent, gameType, playedNumber, winningNumber
            )
            await newTransaction.save(opts)
            let game = await GamePlay.findOneAndUpdate({
                gamePlayIdNumber: gameIdNumber
            }, {
                $set: {
                    isWin: true
                }
            }, opts);
            await session.commitTransaction();
            session.endSession();

            let SuccessResponse = {}
            SuccessResponse.status = true
            SuccessResponse.response_string = `Success! Winning claimed successfully. You now have a credit of N${amount} in your account balance`
            SuccessResponse.data = []
            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
            return true
        } else {
            await session.abortTransaction();
            session.endSession();
            handleErrorClient(null, res, "Error!Invalid credentials. Please try again")
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        handleErrorClient(null, res, "Error! Invalid credentials. Please try again")
    }
}

async function payWinningFromOthers(accessToken, amount, performerEventId, agentId, superAgent, from, gameType, playedNumber, winningNumber, res) {
    console.log(accessToken)
    let session = await mongoose.startSession();
    session.startTransaction();
    try {
        let opts = {
            session,
            new: true
        };
        let A = await User.findOne({
            accessToken: accessToken
        }, null, opts);

        if (A != null) {

            //console.log("yes")
            let number = await Transaction.countDocuments();
            let transactionIdNumber = number + 1000
            let newTransaction = new Transaction()
            newTransaction.createTransactionWinning(
                transactionIdNumber,
                agentId,
                performerEventId,
                A.totalBalance,
                A.totalBalance,
                0,
                0,
                A.initialCreditBalance,
                A.finalCreditBalance,
                amount,
                'claim_winning',
                0,
                from,
                superAgent,
                gameType, playedNumber, winningNumber
            )
            await newTransaction.save(opts)
            await session.commitTransaction();
            session.endSession();

            let SuccessResponse = {}
            SuccessResponse.status = true
            SuccessResponse.response_string = `Success! Winning claimed successfully. You now have a credit of N${amount} in your account balance`
            SuccessResponse.data = []
            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
            return true
        } else {
            await session.abortTransaction();
            session.endSession();
            handleErrorClient(null, res, "Error! Invalid credentials. Please try again")
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        handleErrorClient(null, res, "")
    }
}

async function addFundsFromCreditDone(accessToken, amount, agentId, res) { //fundAgentBySuperAgent
    let session = await mongoose.startSession();
    session.startTransaction();
    try {
        let opts = {
            session,
            new: true
        };
        let A = await User.findOneAndUpdate({
            accessToken: accessToken
        }, {
            $inc: {
                accountCredit: -amount,
                actualBalance: amount,
            },
        }, opts); //,  {$inc: {actualBalance: amount}}

        let B = await User.findOneAndUpdate({
            accessToken: accessToken
        }, {
            $set: {
                totalBalance: A.actualBalance + A.bonusBalance
            }
        }, opts);
        let number = await Transaction.countDocuments();
        let transactionIdNumber = number + 1000
        let newTransaction = new Transaction()
        let thisTransaction = new Transaction({
            transactionIdNumber: transactionIdNumber,
            performerId: agentId,
            performerEventId: "",
            initialActualBalance: A.actualBalance - amount,
            finalActualBalance: A.actualBalance,
            initialBonusBalance: 0,
            finalBonusBalance: 0,
            initialCreditBalance: A.accountCredit + parseFloat(amount),
            finalCreditBalance: A.accountCredit - amount,
            eventAmount: amount,
            action: 'addfund',
            actionType: 'credit', //action: {game, addmoney, widthraw}
            status: 1, //takes 0/1
            superAgent: "",
        })
        if (A.accountCredit >= 0) {
            await thisTransaction.save(opts)
            await session.commitTransaction();
            session.endSession();

            let SuccessResponse = {}
            SuccessResponse.status = true
            SuccessResponse.response_string = `Success! Account funded successfully. You have received corresponding amount in your account balance`
            SuccessResponse.data = {
                accountCredit: A.accountCredit,
                actualBalance: A.actualBalance,
                bonusBalance: 0,
                totalBalance: A.actualBalance
            }
            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
        } else {
            await session.abortTransaction();
            session.endSession();
            handleErrorClient(null, res, "Error! Provided amount greater than available credit")
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        handleErrorServer(null, res, "Error! Provided amount greater than available credit")
        //throw error; // Rethrow so calling function sees error
    }
}

async function fundAgentBySuperAgent(accessToken, amount, agentId, superAgentId, res) { //
    //deduct from supperAgent and credit agent with transaction
    console.log(accessToken)
    let error = false
    let errorString = ""
    let session = await mongoose.startSession();
    session.startTransaction();
    try {
        let opts = {
            session,
            new: true
        };
        let A = await User.findOneAndUpdate({ //
            accessToken: accessToken
        }, {
            $inc: {
                actualBalance: -amount,
            },
        }, opts); //,  {$inc: {actualBalance: amount}}

        // return
        if (parseFloat(A.actualBalance) < 0) {
            error = true
            await session.abortTransaction();
            session.endSession();
            handleErrorClient(null, res, "Error! Provided amount greater than available credit")
        } else {
            console.log(A)
            let B = await User.findOneAndUpdate({
                _id: agentId
            }, {
                $inc: {
                    actualBalance: amount,
                },
            }, opts);
            let number = await Transaction.countDocuments();
            let transactionIdNumber = number + 1000
            let newTransaction = new Transaction()
            newTransaction.createTransactionSuper(
                transactionIdNumber,
                superAgentId,
                agentId,
                "",
                parseFloat(B.actualBalance) - parseFloat(amount),
                B.actualBalance,
                0,
                0,
                B.accountCredit,
                B.accountCredit,

                parseFloat(A.actualBalance) + parseFloat(amount), //superagent
                A.actualBalance, ///superagent
                A.accountCredit, //superagent
                A.accountCredit, //superagent
                amount,
                'addfund',
                1,
                'super_to_agent',
                superAgentId
            )
            await newTransaction.save(opts)
            await session.commitTransaction();
            session.endSession();

            let SuccessResponse = {}
            SuccessResponse.status = true
            SuccessResponse.response_string = `Success! Account funded successfully. You have received corresponding amount in your account balance`
            SuccessResponse.data = {
                accountCredit: A.accountCredit,
                actualBalance: A.actualBalance,
                bonusBalance: A.bonusBalance,
                totalBalance: A.actualBalance
            }
            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
        }

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        handleErrorServer(null, res, error.message)
    }
}

async function cashOutCredit(accessToken, amount, agentId, res) {
    let session = await mongoose.startSession();
    session.startTransaction();
    try {
        let opts = {
            session,
            new: true
        };
        let A = await User.findOneAndUpdate({
            accessToken: accessToken
        }, {
            $inc: {
                accountCredit: -amount,
                //actualBalance: amount,
            },
        }, opts);
        let number = await Transaction.countDocuments();
        let transactionIdNumber = number + 1000
        // let newTransaction = new Transaction()
        let thisTransaction = new Transaction({
            transactionIdNumber: transactionIdNumber,
            performerId: agentId,
            performerEventId: "",
            initialActualBalance: A.actualBalance,
            finalActualBalance: A.actualBalance,
            initialBonusBalance: 0,
            finalBonusBalance: 0,
            initialCreditBalance: A.accountCredit + parseFloat(amount),
            finalCreditBalance: A.accountCredit,
            eventAmount: amount,
            action: 'addfund',
            actionType: 'credit', //action: {game, addmoney, widthraw}
            status: 0, //takes 0/1
            superAgent: "",
        })
        if (A.accountCredit >= 0) {
            await thisTransaction.save(opts)
            await session.commitTransaction();
            session.endSession();

            let SuccessResponse = {}
            SuccessResponse.status = true
            SuccessResponse.response_string = `Success! Account funded successfully. You have received corresponding amount in your account balance`
            SuccessResponse.data = {
                accountCredit: A.accountCredit,
                actualBalance: A.actualBalance,
                bonusBalance: 0,
                totalBalance: A.actualBalance
            }
            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
        } else {
            await session.abortTransaction();
            session.endSession();
            handleErrorClient(null, res, "Error! Provided amount greater than available credit")
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        handleErrorServer(null, res, "Error! Provided amount greater than available credit")
        //throw error; // Rethrow so calling function sees error
    }
}

async function addFundsFromOthers(accessToken, amount, agentId, method, res) {
    await User.find({
        'accessToken': accessToken
    }).then(user_ => {
        if (user_.length > 0) {
            //console.log(user_)
            let user = user_[0]
            let newTransaction = new Transaction()
            newTransaction.count()
                .then(function (count) {
                    let transactionIdNumber = count + 1000
                    let thisTransaction = new Transaction({
                        transactionIdNumber: transactionIdNumber,
                        performerId: agentId,
                        performerEventId: "",
                        initialActualBalance: user.actualBalance,
                        finalActualBalance: user.actualBalance,
                        initialBonusBalance: 0,
                        finalBonusBalance: 0,
                        initialCreditBalance: user.accountCredit,
                        finalCreditBalance: user.accountCredit,
                        eventAmount: amount,
                        action: 'addfund',
                        actionType: method, //action: {game, addmoney, widthraw}
                        status: 0, //takes 0/1
                        superAgent: "",
                    })
                    thisTransaction.save()
                        .then(function (out) {
                            let SuccessResponse = {}
                            SuccessResponse.status = true
                            SuccessResponse.response_string = `Success! Winning claimed successfully. You will receive corresponding amount in your account when approved`
                            SuccessResponse.data = []
                            res.status(SUCCESS_RESPONSE_CODE).json(SuccessResponse)
                        }).catch(err => handleErrorClient(null, res, ""))
                }).catch(err => function () { })
        } else {
            handleErrorServer(null, res, "Error! Specified user cannot be found")
        }
    }).catch(err =>
        handleErrorServer(null, res, err.toString())
    )
}


/***Algorithms start here***/
function vowelsCounter(text) {
    let Vowels = ["a", "e", "i", "o", "u"]
    // Initialize counter
    let counter = 0;
    // Loop through text to test if each character is a vowel
    for (let letter of text.toLowerCase()) {
        if (Vowels.includes(letter)) {
            counter++
        }
    }
    // Return number of vowels
    return counter
}

function isAnagram(stringA, stringB) {
    let sanitizeString = function (str) {
        return str.toLowerCase().replace(/[^a-z\d]/g, '').split('').sort().join('');
    }
    return sanitizeString(stringA) == sanitizeString(stringB)
}

function reverseString(text) {
    return text.split("").reverse().join("")
}

function searchReplace(str, word, newWord) {
    if (word[0] === word[0].toUpperCase()) {
        newWord = newWord[0].toUpperCase() + newWord.slice(1)
    }
    return str.replace(word, newWord)
}

function split(arr, howMany) {
    let newArr = [],
        start = 0,
        end = howMany;
    for (let i = 1; i <= Math.ceil(arr.length / howMany); i++) {
        newArr.push(arr.slice(start, end));
        start = start + howMany;
        end = end + howMany
    }
    return newArr
}

function longestWord(text) {
    let wordArray = text.split(' ')
    let maxLength = 0
    let result = ''

    for (let i = 0; i < wordArray.length; i++) {
        if (wordArray[i].length > maxLength) {
            maxLength = wordArray[i].length
            result = wordArray[i]
        }
    }

    return result

}

function hammingDistance(stringA, stringB) {
    let result = 0

    if (stringA.length == stringB.length) {
        for (let i = 0; i < stringA.length; i++) {
            if (stringA[++i].toLowerCase() != stringB[++i].toLowerCase()) {
                result++
            }
        }
        return result
    } else {
        throw new Error('Strings do not have equal length')
    }
}

function palindromeChecker(text) {
    var reversedText = text.toLowerCase()
        .split('').reverse().join('')

    return text === reversedText
}

function maxRecurringChar(text) {
    let charMap = {}
    let maxCharValue = 0
    let maxChar = ''

    for (let char of text) {
        if (charMap.hasOwnProperty(char)) {
            charMap[char]++
        } else {
            charMap[char] = 1
        }
    }

    for (let char in charMap) {
        if (charMap[char] > maxCharValue) {
            maxCharValue = charMap[char]
            maxChar = char
        }
    }

    return maxChar
}

let fizzBuzz = number => {
    let output = [];
    for (let i = 1; i <= number; i++) {
        if (i % 6 === 0) output.push("Fizz Buzz");
        else if (i % 2 === 0) output.push("Fizz");
        else if (i % 3 === 0) output.push("Buzz");
        else output.push(i);
    }
    return output;
};

function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        let mid = left + Math.floor((right - left) / 2);
        if (arr[mid] === target) {
            return mid;
        }
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

function bfs(graph, root) {
    var nodesLen = {};

    for (var i = 0; i < graph.length; i++) {
        nodesLen[i] = Infinity;
    }
    nodesLen[root] = 0;

    var queue = [root];
    var current;

    while (queue.length != 0) {
        current = queue.shift();

        var curConnected = graph[current];
        var neighborIdx = [];
        var idx = curConnected.indexOf(1);
        while (idx != -1) {
            neighborIdx.push(idx);
            idx = curConnected.indexOf(1, idx + 1);
        }

        for (var j = 0; j < neighborIdx.length; j++) {
            if (nodesLen[neighborIdx[j]] == Infinity) {
                nodesLen[neighborIdx[j]] = nodesLen[current] + 1;
                queue.push(neighborIdx[j]);
            }
        }
    }
    return nodesLen;
}

/*var exBFSGraph = [
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0]
];
console.log(bfs(exBFSGraph, 1));*/
// Creates a stack
let Stack = function () {
    this.count = 0;
    this.storage = {};

    // Adds a value onto the end of the stack
    this.push = function (value) {
        this.storage[this.count] = value;
        this.count++;
    }

    // Removes and returns the value at the end of the stack
    this.pop = function () {
        if (this.count === 0) {
            return undefined;
        }

        this.count--;
        var result = this.storage[this.count];
        delete this.storage[this.count];
        return result;
    }

    this.size = function () {
        return this.count;
    }

    // Returns the value at the end of the stack
    this.peek = function () {
        return this.storage[this.count - 1];
    }
}
let myStack = new Stack();

/*myStack.push(1);
myStack.push(2);
console.log(myStack.peek());
console.log(myStack.pop());
console.log(myStack.peek());
myStack.push("freeCodeCamp");
console.log(myStack.size());
console.log(myStack.peek());
console.log(myStack.pop());
console.log(myStack.peek());*/
function mySet() {
    // the var collection will hold the set
    var collection = [];
    // this method will check for the presence of an element and return true or false
    this.has = function (element) {
        return (collection.indexOf(element) !== -1);
    };
    // this method will return all the values in the set
    this.values = function () {
        return collection;
    };
    // this method will add an element to the set
    this.add = function (element) {
        if (!this.has(element)) {
            collection.push(element);
            return true;
        }
        return false;
    };
    // this method will remove an element from a set
    this.remove = function (element) {
        if (this.has(element)) {
            index = collection.indexOf(element);
            collection.splice(index, 1);
            return true;
        }
        return false;
    };
    // this method will return the size of the collection
    this.size = function () {
        return collection.length;
    };
    // this method will return the union of two sets
    this.union = function (otherSet) {
        var unionSet = new mySet();
        var firstSet = this.values();
        var secondSet = otherSet.values();
        firstSet.forEach(function (e) {
            unionSet.add(e);
        });
        secondSet.forEach(function (e) {
            unionSet.add(e);
        });
        return unionSet;
    };
    // this method will return the intersection of two sets as a new set
    this.intersection = function (otherSet) {
        var intersectionSet = new mySet();
        var firstSet = this.values();
        firstSet.forEach(function (e) {
            if (otherSet.has(e)) {
                intersectionSet.add(e);
            }
        });
        return intersectionSet;
    };
    // this method will return the difference of two sets as a new set
    this.difference = function (otherSet) {
        var differenceSet = new mySet();
        var firstSet = this.values();
        firstSet.forEach(function (e) {
            if (!otherSet.has(e)) {
                differenceSet.add(e);
            }
        });
        return differenceSet;
    };
    // this method will test if the set is a subset of a different set
    this.subset = function (otherSet) {
        var firstSet = this.values();
        return firstSet.every(function (value) {
            return otherSet.has(value);
        });
    };
}

/*let setA = new mySet();
let setB = new mySet();
setA.add("a");
setB.add("b");
setB.add("c");
setB.add("a");
setB.add("d");
console.log(setA.subset(setB));
console.log(setA.intersection(setB).values());
console.log(setB.difference(setA).values());

var setC = new Set();
var setD = new Set();
setC.add("a");
setD.add("b");
setD.add("c");
setD.add("a");
setD.add("d");
console.log(setD.values())
setD.delete("a");
console.log(setD.has("a"));
console.log(setD.add("d"));*/
function Queue() {
    collection = [];
    this.print = function () {
        console.log(collection);
    };
    this.enqueue = function (element) {
        collection.push(element);
    };
    this.dequeue = function () {
        return collection.shift();
    };
    this.front = function () {
        return collection[0];
    };
    this.size = function () {
        return collection.length;
    };
    this.isEmpty = function () {
        return (collection.length === 0);
    };
}

let q = new Queue();

/*q.enqueue('a');
q.enqueue('b');
q.enqueue('c');
q.print();
q.dequeue();
console.log(q.front());
q.print();*/

function PriorityQueue() {
    var collection = [];
    this.printCollection = function () {
        (console.log(collection));
    };
    this.enqueue = function (element) {
        if (this.isEmpty()) {
            collection.push(element);
        } else {
            var added = false;
            for (var i = 0; i < collection.length; i++) {
                if (element[1] < collection[i][1]) { //checking priorities
                    collection.splice(i, 0, element);
                    added = true;
                    break;
                }
            }
            if (!added) {
                collection.push(element);
            }
        }
    };
    this.dequeue = function () {
        var value = collection.shift();
        return value[0];
    };
    this.front = function () {
        return collection[0];
    };
    this.size = function () {
        return collection.length;
    };
    this.isEmpty = function () {
        return (collection.length === 0);
    };
}

/*let pq = new PriorityQueue();
pq.enqueue(['Beau Carnes', 2]);
pq.enqueue(['Quincy Larson', 3]);
pq.enqueue(['Ewa Mitulska-Wójcik', 1])
pq.enqueue(['Briana Swift', 2])
pq.printCollection();
pq.dequeue();
console.log(pq.front());
pq.printCollection();*/