const Koa = require('koa')
const Router = require('koa-router');
const { generateRouteRandom } = require("../utils.js");
const app = new Koa()

const port = 3000;

////////// Generate a lot of random routes ///////////////
const routerBlok1 = new Router({ prefix: "/" });
const routerBlok2 = new Router({ prefix: "/" });
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

app.use(ctx => {
    ctx.body = { hello: 'world' }
})

app.listen(port, () => {
    console.log("Server created by library: koaa is listening on port:", port)
})