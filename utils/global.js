// Require exceljs package
const excel = require("exceljs");

// Require mssql package
const sql = require("mssql");

// Require mssql package
const mysql = require("mysql");

// Require Mmment package for the time logic
const moment = require("moment");

// Require dialogs package
const Dialogs = require("dialogs");
const dialogs = Dialogs();

// Require macaddress package
const macaddress = require("macaddress");

// Require fs package
const { readFileSync, promises: fsPromises } = require("fs");

// Require lodash package
const _ = require('lodash');

var config;
var aUserId;
var aPassword;
var databaseInfoPath = "./assets/data/databaseInfo.txt";

// var isDevMode = false;