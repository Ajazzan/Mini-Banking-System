const db = require("megadb");
const sha256 = require("sha256");

//DB

let money = new db.crearDB("money");
let password = new db.crearDB("password");
let cvv = new db.crearDB("cvv");
let cardId = new db.crearDB("cardId");
let code = new db.crearDB("code");

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

async function genCardId() {
	return `${rng(4)}-${rng(4)}-${rng(4)}-${rng(4)}`
}

async function crearCuenta(pin,clientPassword,type) {

	let gCardId = await genCardId()

	if(cardId.tiene(gCardId)){
		gCardId = genCardId()
		if(cardId.tiene(gCardId)){
			gCardId = genCardId()
			if(cardId.tiene(gCardId)){
				gCardId = genCardId()
				if(cardId.tiene(gCardId)){
					gCardId = genCardId()
				}
			}
		}
	}

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

	console.log(`Pin: ${pin}, CVV: ${gcvv}`)

	return {
		"pin": pin,
		"cardId": gCardId,
		"money": "0",
		"password": clientPassword,
		"gcvv": gcvv
	}
}

module.exports = { crearCuenta }