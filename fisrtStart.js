//Primary Modules

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
let admins = new db.crearDB('admins');

//External Functions

const crearCuenta = require("./functions/newAccount.js");
const transaction = require("./functions/transaction.js");
const mint = require("./functions/mintMoney.js");
const burn = require("./functions/burnMoney.js");
const getSupply = require("./functions/getSupply.js");

//Config

const config = require("./config.json");
let adminPin = config.pin
let adminPassword = config.password;
let gCardId = config.cardId;

//Functions

function rng(length) {
	var result           = '';
	var characters       = '0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * 
			charactersLength));
	}
	return result;
}

async function crearPrimeraCuenta(pin,clientPassword,type) {

	if(!pin) {
		return 'Especifique el pin.';
	}

	if(!type) {
		return 'Especifique el tipo de tarjeta.'
	}
	if(!password) {
		return 'Especifique la clave.'
	}

	let gcvv = rng(3)

	let pinSha256 = await sha256(`${pin}`);
	let passwordSha256 = await sha256(`${clientPassword}`);
	let cvvSha256 = await sha256(`${gcvv}`);

	await code.establecer(gCardId, `${pinSha256}`);
	await cardId.establecer(gCardId, "true");
	await money.establecer(gCardId, "0");
	await password.establecer(gCardId, `${passwordSha256}`);
	await cvv.establecer(gCardId, `${cvvSha256}`);

    await admins.establecer(gCardId, "true")

	console.log(` Guarda bien estos datos!, Son irrecuperables: \n
		"pin": ${pin},
		"cardId": ${gCardId},
		"money": "0",
		"password": ${clientPassword},
		"gcvv": ${gcvv}
    `)
}

crearPrimeraCuenta(adminPin,adminPassword,1)

async function setDatabases(){
    await csupply.establecer("supply", 0)
}

setDatabases()