const { AppServer } = require("mini-express-server");
const { generateRouteRandom } = require("../utils.js");

const app = new AppServer();
const port = 3000;

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

app.listen(port, (address) => {
    console.log("Server created by library: mini-express-server is listening on port:", address)
})