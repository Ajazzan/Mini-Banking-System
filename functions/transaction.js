const db = require("megadb");
const sha256 = require("sha256");

//DB

let money = new db.crearDB("money");
let password = new db.crearDB("password");
let cvv = new db.crearDB("cvv");
let cardId = new db.crearDB("cardId");
let code = new db.crearDB("code");

//Exclusive DB

let references = new db.crearDB("references")
let referencescount = new db.crearDB("referencescount")

//Functions

async function rng(length) {
	var result           = '';
	var characters       = '0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * 
			charactersLength));
	}
	return result;
}

async function trasaction(sCvv, sCardId, sAmount, sPin, rCardId) {
	let sCvvSha256 = await sha256(`${sCvv}`);
	let sPinSha256 = await sha256(`${sPin}`);

	if(!cardId.tiene(`${sCardId}`)){
		return "Wrong Sender Card ID"
	}

	if(!cardId.tiene(rCardId)){
		return "Wrong Reciver Card ID"
	}

	let sCvvOnDb = await cvv.obtener(sCardId);

	if(!sCvvOnDb === sCvvSha256){
		return "Wrong Pin."
	}

	let sPinOnDB = code.obtener(sCardId)

	if(!sPinOnDB === sPinSha256){
		return "Wrong Pin."
	}

	let smoney = await money.obtener(sCardId)

	if(sAmount > smoney) {
		return 'You dont have the necesary money for this payment.'
	}

	let refnum = await referencescount.obtener("count")
	let treference = await refnum + 1;
	await referencescount.establecer("count", treference)

	console.log(treference)

	await money.restar(sCardId, sAmount)
	await money.sumar(rCardId, sAmount)
	await references.establecer(`${treference}.type`, 'transfer')
	await references.establecer(`${treference}.sender`, sCardId)
	await references.establecer(`${treference}.reciver`, rCardId)
	await references.establecer(`${treference}.amont`, sAmount)
	await references.establecer(`${treference}.reference`, treference)

	await money.sumar(sCardId, 10)

	return {
		"sender": sCardId,
		"reciver": rCardId,
		"amount": sAmount,
		"reference": treference
	}
}

module.exports = { trasaction }