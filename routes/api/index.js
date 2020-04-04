const routes = require('express').Router()
const userController = require('../../controllers/controller.js')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        //req.body.phone
        let incidentId = "niiy"//req.cookies.incidentId//JSON.parse(req.cookies.userData)
        // code = userDateals.code
        // userDateals.data.accountBalanceF = 0;
        // userDateals.data.caseId = param2;
        // userDateals.data.incidentId = param3;
        //console.log(req.headers)
        cb(null, req.headers.caseid + "_" + req.headers.incidentid + "_" + Date.now() + path.extname(file.originalname)) //Appending extension
        //cb(null, "niyi_" + Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

const upload = multer({ storage: storage })//upload = multer({ dest: 'uploads/' })
const path = require('path')

//routes.post('/upload_files', userController.upload_files);

routes.post('/upload_files', upload.array('images', 12), function (req, res, next) {
    let originalFileName = req.files
    //console.log(req)
    res.send({ "status": true })
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
})




routes.post('/start_signup', userController.start_signup);

routes.post('/create_case', userController.create_case);//perpetrators
routes.post('/load_cases', userController.load_cases);//perpetrators
routes.post('/add_incident', userController.add_incident);//perpetrators
routes.post('/load_incidents', userController.load_incidents);//load_incident_content
routes.post('/load_incident_content', userController.load_incident_content);//
routes.post('/edit_perpetrator', userController.edit_perpetrator);//edit_company
routes.post('/edit_company', userController.edit_company);//load_profile
routes.post('/load_profile', userController.load_profile);//load_profile


routes.post('/simple_signup', userController.simple_signup);
routes.post('/simple_signup_self', userController.simple_signup_self);
routes.post('/resend_phone_code', userController.resend_phone_code);
routes.post('/verify_phone', userController.verify_phone);
routes.post('/login', userController.login); //load_details
routes.post('/load_details', userController.load_details); //
routes.post('/logout', userController.logout);
routes.post('/start_update_phone', userController.start_update_phone);
routes.post('/complete_update_phone', userController.complete_update_phone);
routes.post('/update_profile', userController.update_profile);
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