/**
 * Created by marcelboes on 27.06.17.
 */
// this will force the config module to load config/test.json
process.env.NODE_ENV = "test";

// Model & server
const groupModel = require("../app/models/groupModel");
const userModel = require("../app/models/userModel");
const server = require("../server");

// Require our dev-dependencies
import * as chai from "chai";
const chaiHttp = require("chai-http");
const should = chai.should();

chai.use(chaiHttp);

// Tests
describe("Groups", () => {
    before(done => {
        let user = {

        };
        chai.request(server)
            .post("/api/1.0/login")
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
    beforeEach(done => {
        groupModel.remove({}, () => {
            done();
        });
    });

    // Test the /GET route for returning all groups
    describe("/GET groups", () => {
        it("it should GET all the groups", (done) => {
            chai.request(server)
                .get("/api/1.0/group")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    // Test the /POST route to create a new group
    describe("/POST groups", () => {
        it("it should not POST a group without name property", (done) => {
            let group = {};
            chai.request(server)
                .post("/api/1.0/group")
                .send(group)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("errors");
                    res.body.errors.should.have.property("name");
                    done();
                });
        });
        it("it should POST a group ", (done) => {
            let group = { name: "aGroupName" };
            chai.request(server)
                .post("/api/1.0/group")
                .send(group)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("name");
                    done();
                });
        });
    });

    // Test the /GET/:id group
    describe("/GET/:id group", () => {
        it("it should GET a group by the given id", (done) => {
            let group = new groupModel({name: "aGroupName"});
            group.save((err, group) => {
                chai.request(server)
                    .get("/api/1.0/group/" + group._id)
                    .send(group)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a("object");
                        res.body.should.have.property("name").eql("aGroupName");
                        res.body.should.have.property("_id").eql(String(group._id));
                        done();
                    });
            });
        });
    });

    // Test the /PATCH/:id route
    describe("/PATCH/:id group", () => {
        it("it should UPDATE a group by the given id", (done) => {
            let group = new groupModel({name: "aGroupName"});
            group.save((err, group) => {
                chai.request(server)
                    .patch("/api/1.0/group/" + group._id)
                    .send({name: "otherGroupName"})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a("object");
                        res.body.should.have.property("nModified").eql(1);
                        res.body.should.have.property("ok").eql(1);
                        done();
                    });
            });
        });
    });

    // Test the /DELETE/:id route
    describe("/DELETE/:id group", () => {
        it("it should DELETE a group by the given id", (done) => {
            let group = new groupModel({name: "aGroupName"});
            group.save((err, group) => {
                chai.request(server)
                    .del("/api/1.0/group/" + group._id)
                    .end((err, res) => {
                        res.should.have.status(204);
                        done();
                    });
            });
        });
    });
});