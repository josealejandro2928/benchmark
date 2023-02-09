const fastify = require("fastify");
const { generateRouteRandom } = require("../utils.js");

const app = fastify();
const port = 3000;

////////// Generate a lot of random routes ///////////////
for (let i = 0; i < 100; i++) {
    app.get(generateRouteRandom("api", 3), (req, res) => {
        return { hello: 'world' }
    })
}

for (let i = 0; i < 100; i++) {
    app.get(generateRouteRandom("home", 3), (req, res) => {
        return { hello: 'world' }
    })
}
//////////////////////////////////////////////////////////

app.get("/", (req, res) => {
    return { hello: 'world' };
})

app.listen({ port: port }, () => {
    console.log("Server created by library: fastify is listening on port:", port)
})