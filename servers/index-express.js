const express = require("express");
const { generateRouteRandom } = require("../utils.js");
const { ServerError } = require("mini-express-server");
const crypto = require("crypto");

const app = express();
const port = 3000;

app.disable('etag')
app.disable('x-powered-by')

////////// Generate a lot of random routes ///////////////
for (let i = 0; i < 100; i++) {
    app.get(generateRouteRandom("api", 3), (req, res) => {
        return res.json({ hello: 'world' });
    })
}

for (let i = 0; i < 100; i++) {
    app.get(generateRouteRandom("home", 3), (req, res) => {
        return res.json({ hello: 'world' });
    })
}
//////////////////////////////////////////////////////////

app.get("/", (req, res) => {
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
    console.log("Server created by library: express is listening on port:", port)
})