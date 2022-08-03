const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require('cors');
require("dotenv/config");
const authJwt = require('./helper/jwt')
const errorHandler = require('./helper/error_handler')

// const productRouter = require('./routers/products')

app.use(cors);
app.options('*', cors())

// ? middleware
// app.use(bodyParser.json())
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt);
app.use('public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

// app.use(bodyParser.urlencoded({ extended: false }))

// ? router
const categoriesRoutes = require("./routers/categories");
const productsRoutes = require("./routers/products");
const usersRoutes = require("./routers/users");
const ordersRoutes = require("./routers/orders");

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

// app.use(`${api}/products`, productsRoutes)
// app.use(`${api}/categories`, categoriesRouter)

// const Product = require('./models/product')

// DATABASE
mongoose.connect(process.env.CONECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "eshop-database",
  })
  .then(() => {
    console.log("Database in Eshop connected!");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(2000, () => {
  console.log(`server is running http://localhost:2000`);
});