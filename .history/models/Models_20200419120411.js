const mongoose = require('mongoose'),
    //console.log(connection)
    //const AutoIncrement = require('mongoose-sequence')(mongoose);
    //let AutoIncrement = require('simple-mongoose-autoincrement');
    //autoIncrement.initialize(connection);
    Schema = mongoose.Schema,
    crypto = require('crypto');


    const detailSchema = new Schema( {
        unique_id:Number,
        Name: String,
        image1:String,
        image2:String,
        image3:String,
        added_date:{
            type: Date,
            default: Date.now
        }
    });

const UserSchema = new Schema({
    fullName: { type: String, default: '', match: /[a-z]/ },
    email: {
        type: String,
    },
    agentType: { type: String, default: 'direct' },
    isAgent: { //isSuspended
        type: Boolean,
        default: false,
        required: false
    },
    isSuspended: { //
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
    },
    tempPhone: {
        type: String,
        trim: true,
    },
    phoneVerificationCode: {
        type: String,
        required: true,
        trim: true,
        unique: false,
        default: '000000'
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    isMobileVerified: { type: Boolean, required: true, default: false },

    bankName: { type: String, default: 'No Bank' }, ///5def916e8ddfcf0004ead045
    superAgent: { type: String, default: '' }, ///5def916e8ddfcf0004ead045
    bankAccountNum: { type: String, default: '1234506789' },
    accessToken: String,
    address: String,
    dod: Date,
    // singleFlag: {type: String, required: true, default: '', unique:true},
    accountCredit: { type: Number, default: 0.00 },
    actualBalance: { type: Number, default: 0.00 },
    winningBalance: { type: Number, default: 0.00 },
    bonusBalance: { type: Number, default: 0.00 },
    totalBalance: { type: Number, default: 0.00 },
    userId: { type: Number, unique: true, required: true }
}, { timestamps: true });
UserSchema.index({ phone: 1 }, { unique: true });
UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}

UserSchema.methods.createUser = function (fullName, userId, email, password) {
    //this.salt = crypto.randomBytes(16).toString('hex');
    this.fullName = fullName
    this.userId = userId
    this.email = email
    this.password = password
}

UserSchema.methods.createUserLittle = function (fullName, userId, phone, email, password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.fullName = fullName
    this.userId = userId
    this.phone = phone
    this.email = email
    this.password = password
    this.singleFlag = singleFlag
    this.superAgent = superAgent
    this.agentType = agentType
    this.isAgent = true
    this.actualBalance = 0.0
    this.bonusBalance = 0.0
    this.totalBalance = 0.0
    this.isMobileVerified = true
    this.isAgent = true
    this.isSuspended = false;
}

UserSchema.methods.countUser = function () {
    return mongoose.models['User'].countDocuments({})
}

const PerpetratorSchema = new Schema({
    userId: { type: String, default: "" },
    caseType: { type: String, default: "" },
    fname: { type: String, default: "" },
    lname: { type: String, default: "" },
    age: { type: String, default: "" },
    gender: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    identityNumber: { type: String, default: "" },
    facebook: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    companyName: { type: String, default: "" },
    companySize: { type: String, default: "" },
    companyAddress: { type: String, default: "" },
    companyWebpage: { type: String, default: "" },
    companyFacebook: { type: String, default: "" },
    companyLinkedIn: { type: String, default: "" },
}, { timestamps: true });

PerpetratorSchema.methods.createPerpetrator = function (
    userId, caseType, fname, lname, age, gender, phone, email, identityNumber, facebook, linkedin,
    companyName, companySize, companyAddress, companyWebpage, companyFacebook, companyLinkedIn) {
    this.userId = userId
    this.caseType = caseType
    this.fname = fname
    this.lname = lname
    this.age = age
    this.gender = gender
    this.phone = phone
    this.email = email
    this.identityNumber = identityNumber
    this.facebook = facebook
    this.linkedin = linkedin
    this.companyName = companyName
    this.companySize = companySize
    this.companyAddress = companyAddress
    this.companyWebpage = companyWebpage
    this.companyFacebook = companyFacebook
    this.companyLinkedIn = companyLinkedIn

}

const CaseSchema = new Schema({
    userId: { type: String, default: "" },
    caseType: { type: String, default: "" },
    fname: { type: String, default: "" },
    lname: { type: String, default: "" },
    age: { type: String, default: "" },
    gender: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    identityNumber: { type: String, default: "" },
    facebook: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    companyName: { type: String, default: "" },
    companySize: { type: String, default: "" },
    companyAddress: { type: String, default: "" },
    companyWebpage: { type: String, default: "" },
    companyFacebook: { type: String, default: "" },
    companyLinkedIn: { type: String, default: "" },
    deleted:{type:Boolean, default: false},
    deleteDate: {type: String, default: "" }
}, { timestamps: true });

CaseSchema.methods.createCase = function (
    userId, caseType, fname, lname, age, gender, phone, email, identityNumber, facebook, linkedin,
    companyName, companySize, companyAddress, companyWebpage, companyFacebook, companyLinkedIn) {
    this.userId = userId
    this.caseType = caseType
    this.fname = fname
    this.lname = lname
    this.age = age
    this.gender = gender
    this.phone = phone
    this.email = email
    this.identityNumber = identityNumber
    this.facebook = facebook
    this.linkedin = linkedin
    this.companyName = companyName
    this.companySize = companySize
    this.companyAddress = companyAddress
    this.companyWebpage = companyWebpage
    this.companyFacebook = companyFacebook
    this.companyLinkedIn = companyLinkedIn
    this.deleted = false

}

const IncidentSchema = new Schema({
    //caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' }, //performeeId
    //userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //performeeId
    caseId: { type: String, default: "" },//{ type: mongoose.Schema.Types.ObjectId, ref: 'Case' }
    userId: { type: String, default: "" },
    title: { type: String, default: "" },
    date: { type: Date },
    time: { type: String },
    location: { type: String, default: "" },
    narration: { type: String, default: "" },
    images: { type: Array, "default": [] },
    videos: { type: Array, "default": [] },
    audio: { type: Array, "default": [] },
    howyoufeel: { type: String, default: "" },
    deleted:{type:Boolean, default: false},
    deleteDate: {type: String, default: "" }
}, { timestamps: true });

IncidentSchema.methods.createIncident = function (
    caseId, userId, title, date, time, location, narration, howyoufeel) {// images, videos, audio,
    this.caseId = caseId
    this.userId = userId
    this.title = title
    this.date = date
    this.time = time
    this.location = location
    this.narration = narration
    // this.images = images
    // this.videos = videos
    // this.audio = audio
    this.howyoufeel = howyoufeel
    this.deleted = false
}

const TransactionSchema = new Schema({
    transactionIdNumber: { type: Number, unique: true, required: true },
    performerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //performeeId
    performeeId: { type: String, default: "" }, //
    performerEventId: { type: String, default: "" },


    gameType: { type: String, default: '', required: false },
    playedNumber: { type: String, default: '', required: false },
    winningNumber: { type: String, default: '', required: false },

    initialActualBalance: { type: Number, default: 0.00 },
    finalActualBalance: { type: Number, default: 0.00 },
    initialBonusBalance: { type: Number, default: 0.00 },
    finalBonusBalance: { type: Number, default: 0.00 },
    initialCreditBalance: { type: Number, default: 0.00 },
    finalCreditBalance: { type: Number, default: 0.00 },

    superAgentinitialBalance: { type: Number, default: 0.00 },
    superAgentfinalBalance: { type: Number, default: 0.00 },
    superAgentInitialCredit: { type: Number, default: 0.00 },
    superAgentFinalCredit: { type: Number, default: 0.00 },

    eventAmount: { type: Number, default: 0.00 },
    action: { type: String, default: "game" },
    actionType: { type: String, default: "" }, //action: {game, addmoney, widthraw}
    status: { type: Number, default: 0 }, //takes 0/1
    agentStatus: { type: Number, default: 0 }, //takes 0/1
    superAgent: { type: String, default: "" },
}, { timestamps: true });

TransactionSchema.methods.createTransaction = function ( //action:game, addfund, transfer
    transactionIdNumber, performerId, performerEventId, initialActualBalance, finalActualBalance,
    initialBonusBalance, finalBonusBalance, initialCreditBalance, finalCreditBalance, eventAmount,
    action, status, actionType, superAgent) {
    this.transactionIdNumber = transactionIdNumber
    this.performerId = performerId
    this.performerEventId = performerEventId
    this.initialActualBalance = initialActualBalance
    this.finalActualBalance = finalActualBalance
    this.initialBonusBalance = initialBonusBalance
    this.finalBonusBalance = finalBonusBalance
    this.initialCreditBalance = initialCreditBalance
    this.finalCreditBalance = finalCreditBalance
    this.eventAmount = eventAmount
    this.action = action
    this.status = status
    this.actionType = actionType
    this.superAgent = superAgent
}

TransactionSchema.methods.createTransactionWinning = function ( //action:game, addfund, transfer
    transactionIdNumber, performerId, performerEventId, initialActualBalance, finalActualBalance,
    initialBonusBalance, finalBonusBalance, initialCreditBalance, finalCreditBalance, eventAmount,
    action, status, actionType, superAgent, gameType, playedNumber, winningNumber) {
    this.transactionIdNumber = transactionIdNumber
    this.performerId = performerId
    this.performerEventId = performerEventId
    this.initialActualBalance = initialActualBalance
    this.finalActualBalance = finalActualBalance
    this.initialBonusBalance = initialBonusBalance
    this.finalBonusBalance = finalBonusBalance
    this.initialCreditBalance = initialCreditBalance
    this.finalCreditBalance = finalCreditBalance
    this.eventAmount = eventAmount
    this.action = action
    this.status = status
    this.actionType = actionType
    this.superAgent = superAgent

    this.gameType = gameType
    this.playedNumber = playedNumber
    this.winningNumber = winningNumber

    // gameType: { type: String, default: '', required: false },
    // playedNumber: { type: String, default: '', required: false },
    // winningNumber: { type: String, default: '', required: false },
}

TransactionSchema.methods.createTransactionSuper = function ( //action:game, addfund, transfer
    transactionIdNumber, performerId, performeeId, performerEventId, initialActualBalance, finalActualBalance,
    initialBonusBalance, finalBonusBalance, initialCreditBalance, finalCreditBalance,
    superAgentinitialBalance, superAgentfinalBalance, superAgentInitialCredit, superAgentFinalCredit, eventAmount,
    action, status, actionType, superAgent) {

    this.transactionIdNumber = transactionIdNumber
    this.performerId = performerId
    this.performeeId = performeeId
    this.performerEventId = performerEventId

    this.initialActualBalance = initialActualBalance
    this.finalActualBalance = finalActualBalance
    this.initialBonusBalance = initialBonusBalance
    this.finalBonusBalance = finalBonusBalance
    this.initialCreditBalance = initialCreditBalance
    this.finalCreditBalance = finalCreditBalance

    this.superAgentinitialBalance = superAgentinitialBalance
    this.superAgentfinalBalance = superAgentfinalBalance
    this.superAgentInitialCredit = superAgentInitialCredit
    this.superAgentFinalCredit = superAgentFinalCredit

    this.eventAmount = eventAmount
    this.action = action
    this.status = status
    this.actionType = actionType
    this.superAgent = superAgent
}

TransactionSchema.methods.count = function () {
    return mongoose.models['Transaction'].countDocuments({})
}

const GameSchema = new Schema({
    gameType: { type: String, default: '' }, //PICK_THREE, PICK_FOUR, MONGO_BINGO, BINGO_PACK
    addedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isVisible: { type: Boolean },
    singleFlag: { type: String, required: true },
    dateString: { type: String, required: true, },
    orderingId: { type: Number, required: true },
    gameTime: {
        year: Number,
        month: Number,
        day: Number,
        hour: Number,
        minute: Number,
        duration: Number
    }
}, { timestamps: true });
GameSchema.index({ singleFlag: 1 }, { unique: true });

const GamePlaySchema = new Schema({
    gameType: { type: String, default: '', required: true }, //PICK_THREE, PICK_FOUR, MONGO_BINGO, BINGO_PACK
    friendlyName: { type: String, default: '' },
    subType: { type: String, default: '', required: false }, //PICK_THREE, PICK_FOUR, MONGO_BINGO, BINGO_PACK
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    gamePlayIdNumber: { type: Number, required: true, Number, unique: true },
    //playerIdNumber: {type: Number, required: true, Number},// userId: {type: Number, unique: true, required: true}
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    initialBalance: { type: Number, default: 0.0 },
    stakeAmount: { type: Number, default: 0.0 },
    finalBalance: { type: Number, default: 0.0 },
    pick: { type: String, default: '', required: true },
    winningNumbers: { type: String, default: '' },
    isWin: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    spot: { type: String, default: 0, required: true } //game choice
}, { timestamps: true });

GamePlaySchema.methods.createGamePlay = function (gameType, friendlyName, gamePlayIdNumber, playerIdNumber, gameId, playerId, initialBalance, stakeAmount, finalBalance, pick, spot, subType) {
    this.gameType = gameType
    this.friendlyName = friendlyName
    this.gamePlayIdNumber = gamePlayIdNumber
    //this.playerIdNumber = playerIdNumber
    this.gameId = gameId
    this.playerId = playerId
    this.initialBalance = initialBalance
    this.stakeAmount = stakeAmount
    this.finalBalance = finalBalance
    this.pick = pick
    this.spot = spot
    this.subType = subType
}
GamePlaySchema.methods.countGamePlay = function () {
    return mongoose.models['GamePlay'].countDocuments({})
}

const NotificationSchema = new Schema({
    title: { type: String, default: '' }, //PICK_THREE, PICK_FOUR, MONGO_BINGO, BINGO_PACK
    text: { type: String, default: '' },
    userType: { type: String, default: '' }
}, { timestamps: true });

NotificationSchema.methods.createNotification = function (title, text) {
    this.title = title
    this.text = text
}

const uploadSchema = new Schema({
    fileType: { type: String, default: '' }, //PICK_THREE, PICK_FOUR, MONGO_BINGO, BINGO_PACK
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
    incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
    fileName: { type: String, required: true },
}, { timestamps: true });

uploadSchema.methods.createUpload = function (fileType, userId, caseId, incidentId, fileName) {
   this.fileType = fileType
   this.userId = userId
   this.caseId = caseId
   this.incidentId = incidentId
   this.fileName = fileName
}

mongoose.model('User', UserSchema);
mongoose.model('Game', GameSchema);
mongoose.model('GamePlay', GamePlaySchema);
mongoose.model('Transaction', TransactionSchema);
mongoose.model('Notification', NotificationSchema);//PerpetratorSchema
mongoose.model('Perpetrator', PerpetratorSchema);//
mongoose.model('Case', CaseSchema);//IncidentSchema
mongoose.model('Incident', IncidentSchema);//
//mongoose.model('Detail', detailSchema);
mongoose.model('Upload', uploadSchema);
    
//module.exports = Detail;


/*UserSchema.pre('save', function (next) {
    let user = this
    mongoose.models['User'].count(function (err, data) {
        if (err) {
            return next(err);
        }
        user.userId = data+1
        //console.log('pre save count==', data);
        return next();
    });
    //console.log('usertools = ', `Running test at ${new Date().toISOString()}`)
    /!*bcrypt.genSalt(10, function (err, salt) {
        if (err) { return next(err) }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) { return next(err) }
            user.password = hash
            return next()
        })
    })*!/
})*/
/*let User = mongoose.model('User')
UserSchema.pre('save', function (next) {
   /!* mongoose.models['User'].count(function (err, data) {
        if (err) {
            return next(err);
        }
        console.log('pre save count==', data);
        return next();
    });*!/
    if (this.isNew) {
        User.countDocuments({})
            .then(function (count) {
                this.userId = count+1000
                console.log(this.userId )
                next();
            })
            .catch(function (err) {
                next(err);
            })
    }

});*/

/*UserSchema.methods.count = function () {
    db.orders.countDocuments({})
}*/

/*UserSchema.pre('save', function (next) {

    // Only increment when the document is new
    if (this.isNew) {
        UserSchema.countDocuments({}).then(res => {
            this._id = res; // Increment count
            next();
        });
    } else {
        next();
    }
});*/

/*let User = mongoose.model('User', Schema);
UserSchema.pre('save', function (next) {
    User.count(function (err, count) {
        if (err) {
            console.log(err)
        } else {
            console.log('there are %d kittens', count);
        }
        next();
    });
})*/

//UserSchema.plugin(autoIncrement, {field: 'user_id'});

//GameSchema.plugin(AutoIncrement, {field: 'game_id'});
//GamePlaySchema.plugin(AutoIncrement, {field: 'gameplay_id'});
//UserSchema.plugin(autoIncrement.plugin, 'User');
//var Book = connection.model('Book', bookSchema);
//UserSchema.plugin(autoIncrement.plugin, 'User');