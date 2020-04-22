const routes = require('express').Router();
const userController = require('../../controllers/controller.js')
routes.get('/', (req, res) => res.status(SUCCESS_RESPONSE_CODE).redirect('/login'))
routes.get('/:param1/', (req, res) => { servePage(req, res); return })
routes.get('/:param1/:param2', (req, res) => { servePage(req, res); return })
routes.get('/:param1/:param2/:param3', (req, res) => { servePage(req, res); return })


let servePage = (req, res) => {
    let param1 = req.params.param1;
    let param2 = userController.isSet(req.params.param2) ? req.params.param2 : "";
    let param3 = userController.isSet(req.params.param3) ? req.params.param3 : "";
    //console.log(param3)

    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    let code = 0
    let url = req.protocol + "://" + req.headers.host;
    let baseUrl = "";
    if (!url.includes("localhost")) {
        baseUrl = "https://bingo9ja.herokuapp.com/";
    } else {
        baseUrl = "http://localhost:3002/";
    }
    let userDateals = { baseUrl: baseUrl }
    if (param1 == "signup" || param1 == "verify" || param1 == "login" || param1 == "signupsuccess") {
        switch (param1) {
            case 'signup':
                res.status(SUCCESS_RESPONSE_CODE).render('pages/signup', { userData: userDateals })
                break

            case 'login':
                //console.log(userDateals)
                res.status(SUCCESS_RESPONSE_CODE).render('pages/login', { username: userDateals})
                break

            case 'verify':
                res.status(SUCCESS_RESPONSE_CODE).render('pages/verify', { userData: userDateals })
                break

            case 'signupsuccess':
                res.status(SUCCESS_RESPONSE_CODE).render('pages/signupsuccess', { userData: userDateals })
                break//signupsuccess
        }
    } else {
        try {
            userDateals = JSON.parse(req.cookies.userData)
            code = userDateals.code
            userDateals.data.accountBalanceF = 0;
            userDateals.data.caseId = param2;
            userDateals.data.incidentId = param3;

        } catch (e) {
            //res.send(req.cookies.accessToken)
            //return
            res.status(SUCCESS_RESPONSE_CODE).render('pages/login', { userData: userDateals })
        }
        if (code == 200 && typeof req.cookies.accessToken !== "undefined") {
            // let game = req.params.game;
            switch (param1) {//incidentlog
                case 'dashboard':
                    res.status(SUCCESS_RESPONSE_CODE).render('pages/dashboard', { userData: userDateals })
                    break

                case 'newcase':
                    console.log({ username: "Adeniyi" })
                    res.status(SUCCESS_RESPONSE_CODE).render('pages/newcase', { userData: userDateals })//{ username: user }
                    //res.status(SUCCESS_RESPONSE_CODE).render('pages/newcase', { userData: userDateals })//{ username: user }
                    break//

                case 'addincindent':
                    res.status(SUCCESS_RESPONSE_CODE).render('pages/addincindent', { userData: userDateals })
                    break//caseperpetrator

                case 'viewincident':
                    res.status(SUCCESS_RESPONSE_CODE).render('pages/viewincident', { userData: userDateals })
                    break//caseperpetrator

                case 'editincident':
                    res.status(SUCCESS_RESPONSE_CODE).render('pages/editincident', { userData: userDateals })
                    break//caseperpetrator


                case 'addfile':
                    res.status(SUCCESS_RESPONSE_CODE).render('pages/addfile', { userData: userDateals })
                    break//caseperpetrator

                case 'perpetrator':
                    res.status(SUCCESS_RESPONSE_CODE).render('pages/perpetrator', { userData: userDateals })
                    break//editperpetrator

                // case 'editperpetrator':
                //     res.status(SUCCESS_RESPONSE_CODE).render('pages/perpetrator', { userData: userDateals })
                //     break//

                case 'company':
                    res.status(SUCCESS_RESPONSE_CODE).render('pages/company', { userData: userDateals })
                    break//

                case 'case':
                    res.status(SUCCESS_RESPONSE_CODE).render('pages/case', { userData: userDateals })
                    break

                case 'profile':
                    res.status(SUCCESS_RESPONSE_CODE).render('pages/profile', { userData: userDateals })
                    break

                case 'wallet':
                    res.status(SUCCESS_RESPONSE_CODE).render('pages/wallet', { userData: userDateals })
                    break//signupsuccess



                case 'logout':
                    res.clearCookie('userData', { path: '/' })
                    res.clearCookie('accessToken', { path: '/' })
                    res.clearCookie('gameId', { path: '/' })
                    res.clearCookie('userId', { path: '/' })
                    res.redirect('/login')
                    // res.status(SUCCESS_RESPONSE_CODE).render('pages/wallet', {userData: userDateals})
                    break

                default:
                    res.status(SUCCESS_RESPONSE_CODE).render('pages/dashboard')
                    break
            }
        } else {
            // res.clearCookie('userData', {path: '/'})
            // res.status(SUCCESS_RESPONSE_CODE).redirect(baseUrl+'login')
        }
    }
    // console.log({"console":yes})
}

module.exports = routes;

Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
