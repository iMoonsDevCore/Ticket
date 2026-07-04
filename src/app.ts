import app from ".";
import { env } from "./config/env";

app.listen(env.PORT, () => {
    console.log(`[Servidor] Servidor escuchando en http://localhost:${env.PORT}`);
})