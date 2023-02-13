const Koa = require('koa')
const Router = require('koa-router');
const { generateRouteRandom } = require("../utils.js");
const crypto = require("crypto");
const { ServerError } = require('mini-express-server');

const app = new Koa()

const port = 3000;

const routerBlok1 = new Router({ prefix: "" });
const routerBlok2 = new Router({ prefix: "" });
const routerBlok3 = new Router({ prefix: "" });

////////// Generate a lot of random routes ///////////////
for (let i = 0; i < 100; i++) {
    routerBlok1.get(generateRouteRandom("api", 3), ctx => {
        ctx.body = { hello: 'world' }
    })
}

for (let i = 0; i < 100; i++) {
    routerBlok2.get(generateRouteRandom("home", 3), ctx => {
        ctx.body = { hello: 'world' }
    })
}
//////////////////////////////////////////////////////////
app.use(routerBlok1.routes());
app.use(routerBlok2.routes());
app.use(routerBlok3.routes());

routerBlok3.get("/", ctx => {
    ctx.body = { hello: 'world' }
})

routerBlok3.get("/long", ctx => {
    let data = [];
    for (let i = 0; i < 100; i++) {
        data.push(crypto.randomBytes(12).toString("hex"));
    }
    ctx.body = { data }
})
routerBlok3.get("/error", ctx => {
    throw new ServerError(500, "This is a custom error");
})



app.listen(port, () => {
    console.log("Server created by library: koaa is listening on port:", port)
})