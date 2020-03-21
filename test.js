const chai = require('chai');
const expect = chai.expect;
//const assert = chai.assert;
const PORT = process.env.PORT || 4200
const request = require('request')
const NytimesAPI = require('./controllers/NytimesAPI')
const testUrl1 = "https://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/1.json?api-key=hnJm70NoMjUPF9pz9erGOiOIoyALKmUz"
const testUrl2 = "https://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/7.json?api-key=hnJm70NoMjUPF9pz9erGOiOIoyALKmUz"
const testUrl3 = "https://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/30.json?api-key=hnJm70NoMjUPF9pz9erGOiOIoyALKmUz"

describe('Basic Test for NytimesAPI using Mocha and chai', function () {
    it(`Homepage should return 200 status and not empty page for http://localhost:${PORT}`, function (done) {
        request.get(`http://localhost:${PORT}`, function (err, res, body){
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.not.equal("");
            expect(res.body).to.not.equal(null);
            done();
        });
    });
    //endpoint calls check for successful result
    it('Endpoint call for period "1" endpoint should return success', async () => {
        const result = await NytimesAPI.getNews(testUrl1);
        expect(result.status).to.equal(200);
        expect(result.data.status).to.equal("OK");
    });
    it('Endpoint call for period "7" endpoint should return success', async () => {
        const result = await NytimesAPI.getNews(testUrl2);
        expect(result.status).to.equal(200);
        expect(result.data.status).to.equal("OK");
    });
    it('Endpoint call for period "30" endpoint should return success',  async () => {
        const result = await NytimesAPI.getNews(testUrl3);
        expect(result.status).to.equal(200);
        expect(result.data.status).to.equal("OK");
    });
});
