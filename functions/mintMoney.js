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

//Funciones

async function mint(account, amount, adminAccount, pAdminCvv) {
	if(!admins.tiene(adminAccount)){
		return "No tienes permiso"
	}

	if(!cardId.tiene(account)){
		return "La cuenta que recibira los fondos no existe."
	}

	let adminCvv = await cvv.obtener(adminAccount);

	if(!adminCvv === pAdminCvv){
		return 'Algun dato de administrador es incorrecto'
	}

	await csupply.sumar('supply', amount)
	await money.sumar(account, amount);

	return {
		"minted": amount,
		"accountForMint": account,
		"adminAccount": adminAccount 
	}
}

module.exports = { mint }