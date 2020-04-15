const routes = require('express').Router()
const userController = require('../../controllers/controller.js')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
        cb(null, 'uploads/')
       // path.resolve(__dirname, 'build')
        //cb(null, path.resolve(__dirname, 'uploads'))
    },
    // fileFilter: function (req, file, callback) {
    //     var ext = path.extname(file.originalname);
    //     if (ext === '.png') {// && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg'
    //         cb(null, false)//  return callback(new Error('Only images are allowed'))
    //     } else {
    //         callback(null, true)
    //     }

    // },
    filename: function (req, file, cb) {
        //req.body.phone
        //console.log(req.headers)req.headers.email + "_" + 
        let filename = req.headers.caseid + "_" + req.headers.incidentid + "_" + Date.now() + path.extname(file.originalname)//req.cookies.incidentId//JSON.parse(req.cookies.userData)
        cb(null, filename) //Appending extension
    },

    fileFilter: function (req, file, cb) {
        var ext = path.extname(file.originalname)
        if (ext !== '.png' || ext !== '.jpg' || ext !== '.gif' || ext !== '.jpeg') {
            return callback(/*res.end('Only images are allowed')*/ null, false)
        }
        callback(null, true)
        // var type = file.mimetype;
        // var typeArray = type.split("/");
        // if (typeArray[0] == "video" || typeArray[0] == "image") {
        //   cb(null, true);
        // }else {
        //   cb(null, false);
        // }
    }
})



const upload = multer({ storage: storage })//upload = multer({ dest: 'uploads/' })
const path = require('path')

routes.post('/upload_files', upload.array('images', 10),  userController.upload_files)
routes.post('/start_signup', userController.start_signup);
routes.post('/create_case', userController.create_case);//perpetrators
routes.post('/load_cases', userController.load_cases);//perpetrators
routes.post('/add_incident', userController.add_incident);//perpetrators
routes.post('/load_incidents', userController.load_incidents);//load_incident_content
routes.post('/load_incident_content', userController.load_incident_content);//
routes.post('/edit_perpetrator', userController.edit_perpetrator);//edit_company
routes.post('/edit_company', userController.edit_company);//load_profile
routes.post('/load_profile', userController.load_profile);//update_profile
routes.post('/update_profile', userController.update_profile);//delete_case
routes.delete('/delete_case', userController.delete_case);//
routes.delete('/delete_incident', userController.delete_incident);//delete_incident


routes.post('/simple_signup', userController.simple_signup);
routes.post('/simple_signup_self', userController.simple_signup_self);
routes.post('/resend_phone_code', userController.resend_phone_code);
routes.post('/verify_phone', userController.verify_phone);
routes.post('/login', userController.login); //load_details
routes.post('/load_details', userController.load_details); //
routes.post('/logout', userController.logout);
routes.post('/start_update_phone', userController.start_update_phone);
routes.post('/complete_update_phone', userController.complete_update_phone);
//routes.post('/update_profile', userController.update_profile);
routes.post('/update_password', userController.update_password);
routes.post('/reset_password', userController.reset_password);

routes.post('/add_game', userController.add_game); //add_all_game
routes.post('/add_all_game', userController.add_all_game); //
routes.delete('/delete_game_by_date', userController.delete_game_by_date); //
routes.post('/edit_game', userController.edit_game);
routes.delete('/delete_game', userController.delete_game);
routes.post('/load_games', userController.load_games);
routes.post('/load_daily_games', userController.load_daily_games); //add_mega_bingo
routes.post('/add_mega_bingo', userController.add_mega_bingo); //
routes.post('/play_game', userController.play_game);
routes.post('/load_game_history', userController.load_game_history);

//transaction endpoint
routes.post('/add_fund', userController.add_fund);
routes.post('/load_transaction', userController.load_transaction); //load_wiining
routes.post('/load_winning', userController.load_winning); //

routes.post('/add_notifications', userController.add_notifications);
routes.post('/load_notifications', userController.load_notifications);
routes.post('/get_game_by_id', userController.get_game_by_id); //
routes.post('/claim_winning', userController.claim_winning);

//manage agents
routes.post('/load_agents', userController.load_agents);
routes.post('/add_subagent', userController.add_subagent); //updateSuspension
routes.post('/update_suspension', userController.update_suspension); //approve_winning_superagent

routes.post('/approve_winning_subagent', userController.approve_winning_subagent); //
/*routes.get('/load_balance', userController.load_balance);
routes.post('/fund_wallet', userController.fund_wallet);*/

//transaction endpoint add_fund_by_transfer

//routes.post('/get_transactions', userController.get_transactions);

/*routes.get('/middlest', userController.middlest)*/

/*routes.post('/request_money', userController.user_request_money);
routes.post('/reset_pin', userController.user_update_reset_pin);
routes.post('/update_pin', userController.user_update_pin);
routes.post('/reset_password', userController.user_update_reset_password);//challenge*/


module.exports = routes