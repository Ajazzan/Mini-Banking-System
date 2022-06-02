const express = require("express");
const app = express();
const morgan = require("morgan");

const crearCuenta = require("./functions/newAccount.js");
const transaction = require("./functions/transaction.js");
const mint = require("./functions/mintMoney.js");
const getSupply = require("./functions/getSupply.js");

app.use(express.json());
app.use(morgan('dev'));

app.get("/api/newAccount/:pin/:password/:type", async (req, res) => {
	if(!req.params.pin){
		res.send("Falta el pin")
	}
	if(!req.params.password){
		res.send("Falta la clave.")
	}
	if(!req.params.type){
		res.send("Falta el tipo de cuenta")
	}

	let pin = req.params.pin;
	let password = req.params.password;
	let type = req.params.type;

	res.send(await crearCuenta.crearCuenta(pin,password,type))
})

app.get("/api/transaction/:sCvv/:sCardId/:sAmount/:sPin/:rCardId", async (req,res) => {
	if(!req.params.sCvv){
		return res.send("Falta el CVV")
	}

	if(!req.params.sCardId){
		return res.send("Falta el Id de la tarjeta del remitente de la transaccion.")
	}

	if(!req.params.sAmount){
		return res.send("Falta el monto de la transaccion.")
	}

	if(!req.params.sPin){
		return res.send("Falta el PIn de la tarjeta del remitente")
	}

	if(!req.params.rCardId){
		return res.send("Falta el Id de la tarjeta de la persona que recivira el pago.")
	}

	let sCvv = req.params.sCvv;
	let sCardID = req.params.sCardId;
	let sAmount = req.params.sAmount;
	let sPin = req.params.sPin;
	let rCardId = req.params.rCardId;

	res.send(await transaction.trasaction(sCvv,sCardID,sAmount,sPin,rCardId))
})

app.get("/api/mint/:account/:amount/:adminAccount/:adminCvv", async (req,res) => {
	if(!req.params.account){
		return res.send("Falta la cuenta que recibira los fondos")
	}

	if(!req.params.amount){
		return res.send("Falta el monto a crear.")
	}

	if(!req.params.adminAccount){
		return res.send("Falta el administraddor que autorizo la impresion de los fondos.")
	}

	let account = req.params.account;
	let amount = req.params.amount;
	let adminAccount = req.params.adminAccount;
	let adminCvv = req.params.adminCvv;

	res.send(await mint.mint(account,amount,adminAccount,adminCvv))
})

app.get("/api/supply", async (req,res) => {
	res.send(await getSupply.getSupply())
})
app.listen(3000)