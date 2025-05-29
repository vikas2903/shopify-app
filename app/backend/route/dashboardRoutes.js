
import express from "express";

import  { getDashboardData }  from "../controller/dashboardController";
const dashboardroute = express.Router();

dashboardroute.get("/dashboard", getDashboardData);

export default dashboardroute;
