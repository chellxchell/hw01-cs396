const { response } = require("express");
const process = require("process");

module.exports = {
    mockDoctor: {
        "name": "Sarah Van Wart",
        "seasons": [1, 2, 3, 4, 5, 6]
    },
    mockCompanion: {
        "name": "Cooper Barth",
        "character": "Crash Override",
        "doctors": ["d4"],
        "seasons": [12, 13, 14],
        "alive": true
    },
    mockId: "this_is_a_fake_id",
    mockPatchData: {
        name: "new_name",
        seasons: [0]
    },
    mockPatchCompanion: {
        name: "new_name",
        "seasons": [12, 13],
        "character": "Zer0",
    },
    route: route => {
        // you can run this test on a "correct" heroku instance to 
        // see what the correct output should be:
        // const endpoint = "https://cs396-hw1.herokuapp.com" + route;
        const endpoint = "http://localhost:8081" + route;
        // console.log('ENDPOINT:', endpoint);
        return endpoint;
    },
    testImplemented: (response, done) => {
        if (response.status === 501) {
            done("Status code 501 received: Not Implemented.");
        }
    }
}
