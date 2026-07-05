import app from ".";
import { env } from "./config/env";
import morganMiddleware from "./modules/middlewares/morgan";
import helmetMiddleware from "./modules/middlewares/helmet";

app.use(morganMiddleware);
app.use(helmetMiddleware)

app.listen(env.PORT, () => {
    console.log(`[Servidor] Servidor escuchando en http://localhost:${env.PORT}`);
})
