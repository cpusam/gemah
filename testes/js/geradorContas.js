//retirado de https://gist.github.com/wteuber/6241786
Math.fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };


function makeMultTerm ( minA, maxA, length, leftZero=true )
{
	let str = "";
	let size = Math.abs(length);
	
	if (length < 0)
		size = Math.floor(Math.random() * (size - 2 + 1) + 2);
	
	for (let i = 0; i < size; i++)
		str += "" + Math.floor(RandInt(minA, maxA));

	if (!leftZero) {
		let aux = 0;
		if (str.charAt(0) === "0") {
			while (str.charAt(aux) == "0" && ++aux) ;
			str = str.slice(aux, str.length);	
		}
	}
	return str;
}

function printMult ( file, minA, maxA, lengthA, minB, maxB, size=10 )
{
	let str = "";

	for (let i = 0; i < size; i++)
	{
		let termA = makeMultTerm(minA, maxA, lengthA);
		let termB = Math.floor(RandInt(minB, maxB));
		str += "Conta-"+i+": "+ termA + " x " + termB +"<br />";
	}
	document.getElementById(file).innerHTML = str;
	//document.getElementById("showimage").innerHTML = "<img src='./exemplo_mult_1.png'></img>";
}


function callbackShowAnswer (index, termA, oper, termB, result) {
	alert("Resposta da Conta-"+index+": " + termA +" " + oper + " " + termB + " = " + result);
}

function marcarCheckbox ( formId, checked ) {
	let form = document.getElementById(formId);
	for (let el of form.elements) {
		if (el.type === "checkbox" && el.id.indexOf('termB') > -1)
			el.checked = checked;
	}
}

/**
 * 
 * @param {HTMLElement} form 
 * @param {*} divContas 
 */
function gerarContas ( form, divContas) {
	console.log(form);
	console.log(form.id);
	if (form.id !== 'geradorContasN')
		return;
	console.log("Aqui estamos gerarContas");
	let strHtml = "";
	let lengthA = 5;
	let optionsTermB = [2];
	let qtdeContas = 0;
	let operacao = null;

	for (let el of form.elements) {
		if (el.type === "checkbox" && el.checked && el.id.indexOf('termB') > -1) {
			optionsTermB.push(parseInt(el.value));
		}
		else if (el.id === "qtdeContas")
			qtdeContas = parseInt(el.value);
		else if (el.id === "digitosMaxTermoA")
			lengthA = parseInt(el.value);
		else if (el.name === "operacao" && el.checked)
			operacao = el.value;
	}

	if (optionsTermB.length === 0) {
		alert("Escolha as tabuadas para ser gerada, marque ali de 1 ao 9 ou todas");
		return;
	}

	if (lengthA < 2)
		lengthA = 2;
	if (!operacao) {
		alert('Escolha a operação ali no "tipo de contas"');
		return;
	}

  let lengthB = 6;
	for (let i = 0; i < qtdeContas; i++)
	{
		let termB = "" + optionsTermB[RandInt(0, optionsTermB.length - 1)];
    //pro gabriel eu mudo os valores por operação
    if (operacao === "mult") {
      let minB = 3;
      do {
        termB = makeMultTerm(0, 9, RandInt(minB, 5));
      } while (termB.length < minB);
      lengthA = 10;
    }
    else if (operacao == "div") {
      let minB = 3;
      do {
        termB = makeMultTerm(0, 9, RandInt(minB, 5));
      } while (termB.length < minB);
      lengthA = 8;
    }
    else if (operacao == "sub") {
      let minB = 4;
      do {
        termB = makeMultTerm(0, 9, RandInt(minB, 6));
      } while (termB.length < minB);
      lengthA = 9;
    }
    let k = 0;
    //remove os zeros a esquerda
		while (termB.length > 1 && termB[k] == 0 && k++) ;
    termB = termB.slice(k, termB.length);

		let termA = makeMultTerm(0, 9, RandInt(7, lengthA));
		
		let A = termA;
		k = 0;
    //remove os zeros a esquerda
		while (A.length > 1 && A[k] == 0 && k++) ;
		  A = A.slice(k, A.length);
    
    termA = A;

		let result = "nulo";
		let oper = "";
    if (operacao === "add" || operacao == "sub") {
    
      oper = operacao == "add"? "+": "-";

      let a = parseInt(A);

      termB = makeMultTerm(0, 9, RandInt(2, termA.length));
      
      k = 0;
      //remove os zeros a esquerda
      while (termB.length > 1 && termB[k] == 0 && k++) ;
        termB = termB.slice(k, termB.length);
      
      let b = parseInt(termB);
      if (a < b || a <= 0) {
        i--;
        continue;
      }

      result = oper === "+"? a + b: a - b;
    }
    else if (operacao === "mult") {
			oper = "x";
			result = parseInt(A) * parseInt(termB);
		}
		else if (operacao === "div") {
			oper = "/";
			result = Math.floor(parseInt(A) / parseInt(termB));
			let r = Math.fmod(parseInt(A), parseInt(termB));
			if (r > 0) {
				result = "`"+result +' x '+ parseInt(termB)+" + "+r+"`";
			}
			else {
				result = "`"+result+"`";
			}
		}
		else {
			console.log("gerarContas::Operacao "+operacao+" não identificada");
			return;
		}
		
		strHtml += "<strong>Conta-"+i+": "+ termA + " "+oper+" " + termB
			+ ' = <button type="button" type="button" id="resp'+ i +'" onclick="callbackShowAnswer('+i+',' + A + ', `'+oper+'`, ' + termB + ', '
			+ result
			+ ')"'
			+'>ver resposta</button>'
			+'</strong> <br />';
	}
	let strLimparButton = '<button class="mediumButton" type="button" onclick="limparContas(`'+divContas+'`);">Limpar Contas</button>';
	document.getElementById(divContas).innerHTML = strLimparButton+"<br /><strong>CONTAS GERADAS:</strong><br />" + strHtml;
	//document.getElementById("showimage").innerHTML = "<img src='./exemplo_mult_1.png'></img>";
}

function limparContas(divContas) {
	document.getElementById(divContas).innerHTML = "";
}