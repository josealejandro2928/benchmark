const { ServerError } = require("mini-express-server");
const fastify = require("fastify");
const crypto = require("crypto");
const { generateRouteRandom } = require("../utils.js");

const app = fastify({logger:true})
const port = 3000;

// ////////// Generate a lot of random routes ///////////////
// for (let i = 0; i < 100; i++) {
//     app.get(generateRouteRandom("api", 3), (req, res) => {
//         return { hello: 'world' }
//     })
// }

// for (let i = 0; i < 100; i++) {
//     app.get(generateRouteRandom("home", 3), (req, res) => {
//         return { hello: 'world' }
//     })
// }
// //////////////////////////////////////////////////////////

// app.get("/api/level1/level2/level3", (req, res) => {
//     return { hello: 'world' };
// })

app.get("/", (req, res) => {
    return { hello: 'world' };
})

app.get("/long", (req, res) => {
    let data = [];
    for (let i = 0; i < 100; i++) {
        data.push(crypto.randomBytes(12).toString("hex"));
    }
    return { data };
})

app.get("/error", (req, res) => {
    throw new ServerError(500, "This is a custom error");
})


app.listen({ port: port }, () => {
    console.log("Server created by library: fastify is listening on port:", port)
})