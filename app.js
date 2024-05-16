import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import reservationRouter from "./routes/reservationRoute.js";
import authRoutes from "./routes/authRoutes.js";
import supplierRoute from "./routes/supplierRoute.js";
import categoriesRoute from "./routes/categoriesRoute.js";
import ingredientRoute from "./routes/ingredientRoute.js";
import foodsRoute from "./routes/foodsRoute.js";
import { dbConnection } from "./database/dbConnection.js";
import morgan from "morgan";
import { passportConfigAccount, passportConfigLocalAccount } from "./middlewares/passportAdmin.js";
import passport from "passport";


dotenv.config();


const app = express();

passport.use('jwtAdmin',passportConfigAccount);
passport.use('localAdmin',passportConfigLocalAccount);

app.use(
  cors({
    origin: '*',
  }),
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/supplier",supplierRoute);
app.use("/api/v1/categories", passport.authenticate('jwtAdmin', { session: false }), categoriesRoute);
app.use("/api/v1/ingredient", passport.authenticate('jwtAdmin', { session: false }), ingredientRoute );
app.use("/api/v1/food", passport.authenticate('jwtAdmin', { session: false }), foodsRoute );
app.use("/api/v1/revervation",reservationRouter);
app.get("/", (req, res, next)=>{return res.status(200).json({
  success: true,
  message: "HELLO WORLD AGAIN"
})})
dbConnection();
app.use(errorMiddleware);

export default app;
