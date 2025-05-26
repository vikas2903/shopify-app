
import express from "express";

import  { getDashboardData }  from "../controllers/dashboardController.js";
const dashboardroute = express.Router();

dashboardroute.get("/dashboard", getDashboardData);


export default dashboardroute;
