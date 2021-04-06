"use strict";

// const Companion = require("./schema/Companion");
// const Doctor = require("./schema/Doctor");

const express = require("express");
const router = express.Router();

router.route("/")
    .get((req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });

// ---------------------------------------------------
// Edit below this line
// ---------------------------------------------------

const data = require("../config/data.json");

// returns doctor object given their ID
function getDoctor(id) {
    // look for doctor with correct id
    for (var doctor of data.doctors) {
        if (doctor._id == id) {
            return doctor
        }
    }
    // if one isn't found
    return null
}
// returns companion object given ID
function getCompanion(id) {
    // look for companion with correct id
    for (var companion of data.companions) {
        if (companion._id == id) {
            return companion
        }
    }
    // if one isn't found
    return null
}

// returns companions for doctor given id
function getDocCompanions(docID) {
    var companionList = []
    // loop through each companion
    for (var companion of data.companions) {
        // check if companion had that doctor
        if (companion.doctors.includes(docID)) {
            companionList.push(companion)
        }
    }
    return companionList
}
// returns doctors for companion given id
function getCompDoctors(compID) {
    var docList = []
    var companion = getCompanion(compID)
    // loop through each doctor
    for (var docID of companion.doctors) {
        let doc = getDoctor(docID)
        docList.push(doc)
    }
    return docList
}

router.route("/doctors")
    .get((req, res) => {
        console.log("GET /doctors");
        res.status(200).send(data.doctors);
    })
    .post((req, res) => {
        console.log("POST /doctors");

        // check if sufficient data
        if ((!req.body.name) || (!req.body.seasons)) {
            console.log('missing')
            res.status(500).send({
                message: `Data missing.`
            });
        }

        var doctor = {
            "_id": String(Math.random()),
            "name": req.body.name,
            "seasons": req.body.seasons
        }
        data.doctors.push(doctor);
        res.status(201).send(doctor);

    });

router.route("/doctors/:id")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}`);

        var doctor = getDoctor(req.params.id)

        if (doctor) {
            res.status(200).send(doctor);
        }
        else {
            res.status(404).send({
                message: `Doctor with id ${req.params.id} does not exist.`
            });
        }

    })
    .patch((req, res) => {
        console.log(`PATCH /doctors/${req.params.id}`);
        res.status(501).send();
    })
    .delete((req, res) => {
        console.log(`DELETE /doctors/${req.params.id}`);

        console.log(data.doctors.length)
        var ind = 0;
        for (var doctor of data.doctors){
            // if we've found the doctor to delete
            if (doctor._id == req.params.id){
                data.doctors.splice(ind,1)
                break
            }
            ind++;
        }
        console.log(data.doctors.length)
    });

router.route("/doctors/:id/companions")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/companions`);

        // check if doctor exists
        var doctor = getDoctor(req.params.id)
        if (!doctor) {
            res.status(404).send({
                message: `Doctor with id ${req.params.id} does not exist.`
            });
        }

        var companionList = getDocCompanions(req.params.id)
        res.status(200).send(companionList);
    });

// router.route("/doctors/:id/companions/longest")
//     .get((req, res) => {
//         console.log("GET /doctors/:id/companions/longest");
//         res.status(501).send();
//     });

router.route("/doctors/:id/goodparent")
    .get((req, res) => {
        console.log("GET /doctors/:id/goodparent");

        // check if doctor exists
        var doctor = getDoctor(req.params.id)
        if (!doctor) {
            res.status(404).send({
                message: `Doctor with id ${req.params.id} does not exist.`
            });
        }

        // get list of doc's companions
        var companionList = getDocCompanions(req.params.id)
        for (var companion of companionList) {
            // if one companion not alive
            if (!companion.alive) {
                res.status(200).send(false);
            }
        }

        res.status(200).send(true);
    });

router.route("/companions")
    .get((req, res) => {
        console.log("GET /companions");
        res.status(200).send(data.companions);
    })
    .post((req, res) => {
        console.log("POST /companions");
        // check if sufficient data

        if (!(req.body.name & req.body.character & req.body.doctors & req.body.seasons & req.body.alive)) {
            res.status(500).send({
                message: `Data missing.`
            });
        }

        var companion = {
            "_id": String(Math.random()),
            "name": req.body.name,
            "character": req.body.character,
            "doctors": req.body.doctors,
            "seasons": req.body.seasons,
            "alive": req.body.alive
        }
        data.companions.push(companion);
        res.status(201).send(companion);
    });

router.route("/companions/crossover")
    .get((req, res) => {
        console.log(`GET /companions/crossover`);

        var companionList = []
        for (var companion of data.companions) {
            // if they travelled with > 1 doctor
            if (getCompDoctors(companion._id).length > 1) {
                companionList.push(companion)
            }
        }
        res.status(200).send(companionList);

    });

router.route("/companions/:id")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}`);

        var companion = getCompanion(req.params.id)

        if (companion) {
            res.status(200).send(companion);
        }
        else {
            res.status(404).send({
                message: `Companion with id ${req.params.id} does not exist.`
            });
        }
    })
    .patch((req, res) => {
        console.log(`PATCH /companions/${req.params.id}`);
        res.status(501).send();
    })
    .delete((req, res) => {
        console.log(`DELETE /companions/${req.params.id}`);
        res.status(501).send();
    });

router.route("/companions/:id/doctors")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/doctors`);

        // check if companion exists
        var companion = getCompanion(req.params.id)
        if (!companion) {
            res.status(404).send({
                message: `Companion with id ${req.params.id} does not exist.`
            });
        }

        var docList = getCompDoctors(req.params.id)
        res.status(200).send(docList);

    });

router.route("/companions/:id/friends")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/friends`);

        // check if companion exists
        var companion = getCompanion(req.params.id)
        if (!companion) {
            res.status(404).send({
                message: `Companion with id ${req.params.id} does not exist.`
            });
        }

        var friendList = []
        // go through each companion
        for (var friend of data.companions) {
            // make sure it's not the same companion
            if (friend._id == req.params.id) {
                continue
            }
            // if they share at least one season
            if (companion.seasons.some(r => friend.seasons.includes(r))) {
                friendList.push(friend)
            }
        }
        res.status(200).send(friendList);
    });

//////////////////
// EXTRA CREDIT //
//////////////////
router.route("/doctors/favorites")
    .get((req, res) => {
        console.log(`GET /doctors/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /doctors/favorites`);
        res.status(501).send();
    });

router.route("/doctors/favorites/:id")
    .delete((req, res) => {
        console.log(`DELETE /doctors/favorites/:id`);
        res.status(501).send();
    });

router.route("/companions/favorites")
    .get((req, res) => {
        console.log(`GET /companions/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /companions/favorites`);
        res.status(501).send();
    })

router.route("/companions/favorites/:id")
    .delete((req, res) => {
        console.log(`DELETE /companions/favorites/:id`);
        res.status(501).send();
    });

module.exports = router;
