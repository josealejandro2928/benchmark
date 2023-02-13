const { AppServer, ServerError } = require("mini-express-server");
const { generateRouteRandom } = require("../utils.js");
const morgan = require("morgan")
const app = new AppServer();
const port = 3000;
const crypto = require("crypto");
// ////////// Generate a lot of random routes ///////////////
// for (let i = 0; i < 100; i++) {
//     app.get(generateRouteRandom("api", 3), (req, res) => {
//         return res.json({ hello: 'world' });
//     })
// }

// for (let i = 0; i < 100; i++) {
//     app.get(generateRouteRandom("home", 3), (req, res) => {
//         return res.json({ hello: 'world' });
//     })
// }
// //////////////////////////////////////////////////////////
// app.get("/api/level1/level2/level3", (req, res) => {
//     return res.json({ hello: 'world' });
// })

app.get("/", morgan("combined"), (req, res) => {
    return res.json({ hello: 'world' });
})

app.get("/long", (req, res) => {
    let data = [];
    for (let i = 0; i < 100; i++) {
        data.push(crypto.randomBytes(12).toString("hex"));
    }
    return res.json({ data });
})

app.get("/error", (req, res) => {
    throw new ServerError(500, "This is a custom error");
})

app.listen(port, (address) => {
    console.log("Server created by library: mini-express-server is listening on port:", address)
})