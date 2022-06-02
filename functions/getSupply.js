const db = require("megadb");
const sha256 = require("sha256");

//DB

let money = new db.crearDB("money");
let password = new db.crearDB("password");
let cvv = new db.crearDB("cvv");
let cardId = new db.crearDB("cardId");
let code = new db.crearDB("code");
let csupply = new db.crearDB("csupply");

//Exclusive DB

let references = new db.crearDB("references")
let referencescount = new db.crearDB("referencescount")

//Funciones

async function getSupply(){
	let csupplydata = await csupply.obtener("supply");

	return {
		"supply": csupplydata
	};
}

module.exports = { getSupply }