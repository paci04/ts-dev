import { Chicken } from "./chicken";
import Koa from "koa";
import Router from "koa-router";
import { State } from "./state";

console.log("hi");
const chicken = new Chicken();
chicken.chucks();

const app = new Koa();
const router = new Router<State>();

const logIncoming = async (ctx: Koa.Context, next: Koa.Next) => {
  console.log(ctx.request.originalUrl, ctx.state.id);

  await next();
};

const errorHandler = async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    await next();
  } catch (error) {
    console.error("Error occurred:", error);

    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
};

router.get("/user/:id", async (ctx, next) => {
  ctx.state.id = ctx.params.id;
  ctx.response.body = ctx.params.id;
  await next();
});

app.use(logIncoming);
app.use(errorHandler);
app.use(router.routes());
app.use(async (ctx, next) => {
  await next();
  if (!ctx.response.body && ctx.response.status === 404) {
    ctx.response.body = "Not Found";
  }
});

app
  .listen(3000)
  .on("connect", () => console.log("connect"))
  .on("connection", () => console.log("connection"))
  .on("close", () => {
    console.log("close");
  })
  .on("error", (err) => {
    console.error("Server error:", err);
  });
