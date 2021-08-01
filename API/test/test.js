const expect = require("chai").expect;
let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe("Users and Products tests", function() {

    let base_url = "http://localhost:5001/"

    let seniorUser = {
        email: "senior.salesrep@stit.talent",
        password: "Scl2opcPUOEcTd0abrSBxwHsDuHklEs2"
    }
    let middleUser = {
        email: "middle.salesrep@stit.talent",
        password: "9fiD2NCGeLqjSSjhUP78kDS3ic2B93Wy"
    }
    let juniorUser = {
        email: "junior.salesrep@stit.talent",
        password: "ymWK5FHn27gjd9clZTR8QfZWOIBQTh1m"
    }
    let internUser = {
        email: "intern.salesrep@stit.talent",
        password: "Or63inluKBLPs006vw9diRmzdCjYLB9H"
    }

    let senior_token;
    let middle_token;
    let junior_token;
    let intern_token;

    chai.request(base_url)
        .post("login")
        .send(seniorUser)
        .end((err, res) => {
            // console.log(res.body.token)
            senior_token = res.body.token;
            expect(res.status).to.equal(201);

        });
    chai.request(base_url)
        .post("login")
        .send(middleUser)
        .end((err, res) => {
            // console.log(res.body.token)
            middle_token = res.body.token;
            expect(res.status).to.equal(201);

        });
    chai.request(base_url)
        .post("login")
        .send(juniorUser)
        .end((err, res) => {
            // console.log(res.body.token)
            junior_token = res.body.token;
            expect(res.status).to.equal(201);

        });
    chai.request(base_url)
        .post("login")
        .send(internUser)
        .end((err, res) => {
            // console.log(res.body.token)
            intern_token = res.body.token;
            expect(res.status).to.equal(201);

        });

    it("should not login with incorrect credentials", function(done) {
        let login = {
            email: "int.salesrep@stit.talent",
            password: "Or63inluKBLPs006vw9diRmzdCjYLB9H"
        }
        chai.request(base_url)
            .post('login')
            .send(login)
            .end((err, res) => {
                expect(res.status).to.equal(401);
                done();
            });
    });

    it("should login with correct credentials", function(done) {
        chai.request(base_url)
            .post('login')
            .send(seniorUser)
            .end((err, res) => {
                expect(res.status).to.equal(201);
                done();
            });
    });

    it("should return products with senior token", function(done) {
        chai.request(base_url)
            .get('products/STUFF%20B')
            .set({ Authorization: `Bearer ${senior_token}` })
            .end((err, res) => {
                // console.log(res)
                expect(res.status).to.equal(200);
                done();
            });
    });
    it("should return products with tags using a senior token", function(done) {
        chai.request(base_url)
            .get('products/STUFF%20B?tags=Practical&tags=Small')
            .set({ Authorization: `Bearer ${senior_token}` })
            .end((err, res) => {
                // console.log(res)
                expect(res.status).to.equal(200);
                done();
            });
    });
    it("should return products from level 1 using a middle token", function(done) {
        chai.request(base_url)
            .get('products/STUFF%20A01')
            .set({ Authorization: `Bearer ${middle_token}` })
            .end((err, res) => {
                // console.log(res)
                expect(res.status).to.equal(200);
                done();
            });
    });
    it("should return products from level 1 with tags using a middle token", function(done) {
        chai.request(base_url)
            .get('products/STUFF%20A01?tags=Practical&tags=Small')
            .set({ Authorization: `Bearer ${middle_token}` })
            .end((err, res) => {
                // console.log(res)
                expect(res.status).to.equal(200);
                done();
            });
    });
    it("should return products from level 2 using a middle token", function(done) {
        chai.request(base_url)
            .get('products/Movies')
            .set({ Authorization: `Bearer ${middle_token}` })
            .end((err, res) => {
                // console.log(res)
                expect(res.status).to.equal(200);
                done();
            });
    });
    it("should return products from level 2 with tags using a middle token", function(done) {
        chai.request(base_url)
            .get('products/Movies?tags=Practical&tags=Small')
            .set({ Authorization: `Bearer ${middle_token}` })
            .end((err, res) => {
                // console.log(res)
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("should return products from level 2 using a junior token", function(done) {
        chai.request(base_url)
            .get('products/Movies')
            .set({ Authorization: `Bearer ${junior_token}` })
            .end((err, res) => {
                // console.log(res)
                expect(res.status).to.equal(200);
                done();
            });
    });
    it("should return products from level 2 with tags using a junior token", function(done) {
        chai.request(base_url)
            .get('products/Movies?tags=Practical&tags=Small')
            .set({ Authorization: `Bearer ${junior_token}` })
            .end((err, res) => {
                // console.log(res)
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("should return products from STUFF A using a intern token", function(done) {
        chai.request(base_url)
            .get('products/STUFF%20A')
            .set({ Authorization: `Bearer ${intern_token}` })
            .end((err, res) => {
                // console.log(res)
                expect(res.status).to.equal(200);
                done();
            });
    });
    it("should return products from STUFF A with tags using a intern token", function(done) {
        chai.request(base_url)
            .get('products/STUFF%20A?tags=Practical&tags=Small')
            .set({ Authorization: `Bearer ${intern_token}` })
            .end((err, res) => {
                // console.log(res)
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("should not return products from level 0 using a middle token", function(done) {
        chai.request(base_url)
            .get('products/STUFF%20B')
            .set({ Authorization: `Bearer ${middle_token}` })
            .end((err, res) => {
                // console.log(res)
                expect(res.status).to.equal(401);
                done();
            });
    });

    it("should not return products from level 0 using a junior token", function(done) {
        chai.request(base_url)
            .get('products/STUFF%20B')
            .set({ Authorization: `Bearer ${junior_token}` })
            .end((err, res) => {
                // console.log(res)
                expect(res.status).to.equal(401);
                done();
            });
    });

    it("should not return products from level 1 using a junior token", function(done) {
        chai.request(base_url)
            .get('products/STUFF%20A01')
            .set({ Authorization: `Bearer ${junior_token}` })
            .end((err, res) => {
                // console.log(res)
                expect(res.status).to.equal(401);
                done();
            });
    });

    it("should not return products from STUFF B using a intern token", function(done) {
        chai.request(base_url)
            .get('products/STUFF%20B')
            .set({ Authorization: `Bearer ${intern_token}` })
            .end((err, res) => {
                // console.log(res)
                expect(res.status).to.equal(401);
                done();
            });
    });
});


