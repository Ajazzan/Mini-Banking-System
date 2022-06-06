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

//Functions

async function burn(account, amount, adminAccount, pAdminCvv){
    if(!admins.tiene(adminAccount)){
		return "No tienes permiso"
	}

	if(!cardId.tiene(account)){
		return "La cuenta que perdera los fondos no existe."
	}

	let adminCvv = await cvv.obtener(adminAccount);

	if(!adminCvv === pAdminCvv){
		return 'Algun dato de administrador es incorrecto'
	}

	let moneyInAccountToBurn = await money.obtener(account);

	if(!moneyInAccountToBurn >= 0) {
		return "La persona no tiene la cantidad de dinero que vas a quemar."
	}

	await csupply.restar('supply', amount)
	await money.restar(account, amount);

	let cSupplyData = await csupply.obtener("supply")

	let refnum = await referencescount.obtener("count")
	let treference = await refnum + 1;
	await referencescount.establecer("count", treference)

	await references.establecer(`${treference}.type`, "burn")
	await references.establecer(`${treference}.reciver`, account)
	await references.establecer(`${treference}.amount`, amount)
	await references.establecer(`${treference}.adminAccount`, adminAccount)
	await references.establecer(`${treference}.reference`, treference)

	return {
		"burned": amount,
		"accountForBurn": account,
		"adminAccount": adminAccount,
		"circulatinSupply": cSupplyData, 
	}
}

module.exports = { burn }