// ==UserScript==
// @name         Itau Extra
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.itaulink.com.uy/trx/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itaulink.com.uy
// @grant        none
// ==/UserScript==


var tarjetasdecredito = document.querySelector('#tarjetasCredito h2.flex')

async function getapagarcred(){
    var result = await fetch('https://www.itaulink.com.uy/trx/reorganizacion').then(res=>res.text()).then(text=> {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        for(var producto of doc.querySelectorAll('.productos-obligatorios-container .un-producto')){
            var nombre = producto.querySelector('.nombre-container .nombre').innerText;
            var monto = producto.querySelector('.monto').innerText;
            if(nombre.includes('Tarjeta de cr�dito')){
            return monto;
        }
    }
    });
    result = parseInt(result.replace(/[^0-9\.,]+/g,"").replace('.',''));
    return result
}

async function dif(apagar){
    var limitedol = parseInt(document.querySelector("#tarjetaCredito0 > div:nth-child(3) p:nth-child(2)").innerText.replace(/[^0-9\.,]+/g,"").replace('.',''))
    var uyutousd = await fetch('https://api.exchangerate-api.com/v4/latest/uyu').then(res=>res.json()).then(json=>json.rates.USD);
    var limite = Math.round((limitedol/uyutousd)/100)*100;
    return "Disponibles: " +(limite-apagar)+ "/" + limite;
}

async function doer1(){
    var apagarres = await getapagarcred();
    tarjetasdecredito.innerText = "Tarjetas de Crédito | A pagar: $" + apagarres;
    const checker = setInterval(() => {
        if(document.querySelector("#tarjetaCredito0 > div:nth-child(3) p:nth-child(2)")){
            clearInterval(checker);
            doer2(apagarres);
        }
    }, 100);
}

async function doer2(apagarres){
    tarjetasdecredito.innerText=tarjetasdecredito.innerText + " | " + await dif(apagarres);
}

//Quita de aqui lo que debes
const planned = [0]
const plannedcred = [0]
const saldoel = document.querySelectorAll('.saldo-valor')[1]
//plannedcred.reduce((partialSum, a) => partialSum + a, 0)
saldoel.innerText = (parseFloat(saldoel.innerText.replace('.','')) - planned.reduce((partialSum, a) => partialSum + a, 0)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

doer1();

