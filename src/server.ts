import express from "express";
import  {routes}  from "./routes"
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger.json"

const app = express();
app.use(express.json());
app.use(routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.listen (3000, () => {
    console.log( "Server rodando na porta 3000")
})

