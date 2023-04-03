/**
 * Derivado do Ideias2/AjudaPai/pai.cpp
 * Tem de fazer expressão só com positivos também.
 * Por enquanto faz com resiltado positiov ou negativo se quiser
 */


//usado pelas novas funções de geração de expressão, ainda por implementar.
class ExpressionConfig
{
	constructor (base, size)
	{
		this.numpar = 0;;
		this.numcol = 0;
		this.numcha = 0;
		this.min = 1;
		this.max = base;
		this.base = base;
		this.size = size;
		this.minusTax = 0.5;

		this.minMult = 1;
		this.minDiv = 1;
		this.minMinus = 1;
		this.minSum = 1;
	}
}


//faz uma expressão aritmética simples, tipo, A/B, A+B, A*B, A-B
function makeRandomArithmetic ( signal, min, max, spaces=true, result=null )
{
	let ret = "";
	let s = "";
	let a, b;

	switch (signal)
	{
		case '+':
			a = Math.floor(RandInt(min, max));
			a = Math.floor(RandInt(min, max));

			s = "+";
			if (result)
			{
				result.result = a + b;
				result.termA = a;
				result.termB = b;
				result.signal = signal;
			}
			break;
		
		case '-':
			a = Math.floor(RandInt(min, max));
			a = Math.floor(RandInt(min, max));

			if (a < b)
			{
				let aux = a;
				a = b;
				b = aux;
			}

			s = "-";
			if (result)
			{
				result.result = a - b;
				result.termA = a;
				result.termB = b;
				result.signal = signal;
			}
			break;
		
		case '*':
			a = Math.floor(RandInt(min, max));
			b = Math.floor(RandInt(min, max));

			if (a < b)
			{
				let aux = a;
				a = b;
				b = aux;
			}

			s = "x";
			if (result)
			{
				result.result = a * b;
				result.termA = a;
				result.termB = b;
				result.signal = signal;
			}
			break;

		case '/':
			do
			{
				a = Math.floor(RandInt(min, max));
				b = Math.floor(RandInt(min, max)) * a;
			} while (a >= b || b % a != 0);
			
			{
				let aux = a;
				a = b;
				b = aux;
			}
			if (result)
			{
				result.result = (a / b);
				result.termA = a;
				result.termB = b;
				result.signal = signal;
			}
						
			s = "/";
			break;
		default:
			console.error("makeRandomArithmetic:: erro ao  criar expressão, não achamos sinal '"+signal);
			return " ";
	}

	if (spaces)
		ret = String(a) + " " + String(s)+ " " + String(b);
	else
		ret = String(a) + String(s) + String(b);

	return ret;
}

//ExpressionConfig & config
function makeExpressionArithmeticZ ( config, outresults=null )
{
	for (let k = 0; k < 500; k++)
	{
		let signals = "+-*/";
		let aux;
		let expr = [];
		let results = [];
		
		
		for (let i = 0; i < config.size; i++)
		{
			let result = {};
			expr.push(makeRandomArithmetic(signals[RandInt()*signals.size()], config.min, config.max, true, result));
			results.push_back(result);
		}
		
		let qtde = {};

		for (let i = 0; i < expr.length; i++)
		{
			let s = "+";
			if (RandInt() <= config.minusTax)
				s = "-";
			
			aux += s + " " + expr[i] + " ";

			if (expr[i].indexOf('/'))
				qtde['/']++;
			else if (expr[i].indexOf('x'))
				qtde['*']++;
			else if (expr[i].indexOf('+'))
				qtde['+']++;
			else if (expr[i].indexOf('-'))
				qtde['-']++;
		}
		
		let ok = true;
		for (let it in qtde)
		{
			if (it == '/')
				ok = ok && qtde[it] >= config.minDiv;
			else if (it == '*')
				ok = ok && qtde[it] >= config.minMult;
			else if (it == '+')
				ok = ok && qtde[it] >= config.minSum;
			else if (it == '/')
				ok = ok && qtde[it] >= config.minMinus;
		}


		if (outresults)
			outresults = results;
		
		if (ok)
			return aux;
	}
	
	return "Error: string null";
}

function makeExpression ( base, size )
{
	for (let k = 0; k < 100; k++)
	{
		let count = 0;
		let next = base;
		let aux = "" + next;

		for (let i = 1; i < size && next > 0; i++)
		{
			let num = Math.floor(base * RandInt() + 1);
			
			let minus = false;
			let r = RandInt();
			if (r < 0.5)
			{
				next -= num;
				aux += (" - ");
			}
			else
			{
				next += num;
				aux += (" + ");
			}

			aux += "" + (num);
			count++;
		}
		
		if (count == size - 1 && next > 0)
			return aux;
	}
	
	return "Error: string null";
}

//faz expressão usando o conjunto Z (inteiros)
function makeExpressionZ ( base, size, negativeResult )
{
	for (let k = 0; k < 100; k++)
	{
		let count = 0;
		let next = Math.floor(base * RandInt() + 1);;
		let aux = ""+next;
		let all = {};
		
		for (let i = 1; i < size; i++)
		{
			let num = Math.floor(base * RandInt() + 1);
			
			let minus = false;
			if (RandInt() < 0.5)
			{
				num = -num;
				aux += (" - ");
			}
			else
				aux += (" + ");
			
			all[num] = true;
			next += num;
			aux += ""+Math.abs(num);
			count++;

			//evita resultado negativo no meio do cálculo
			if (negativeResult == false && next <= 0)
			{
				i--;
				continue;
			}
		}
		
		if (negativeResult && next >= 0)
			continue;
		
		if (count === size - 1)
			return aux;
	}
	
	return "Error: string null";
}

//faz uma expressão com multiplos de N
function makeExpressionMultOfNum ( base, size, withNegativeSign, N )
{
	for (let k = 0; k < 100; k++)
	{
		let count = 0;
		let next = Math.floor(base * RandInt() + 1) * N;
		let aux = ""+next;
		let all = {};
		
		for (let i = 1; i < size; i++)
		{
			let num = Math.floor(base * RandInt() + 1) * N;
			
			let minus = false;
			if (RandInt() < 0.5 && withNegativeSign)
			{
				num = -num;
				aux += (" - ");
			}
			else
				aux += (" + ");
			
			all[num] = true;
			next += num;
			aux += ""+Math.abs(num);
			count++;

			//evita resultado negativo no meio do cálculo
			if (next <= 0)
			{
				i--;
				continue;
			}
		}
		
		if (count === size - 1)
			return aux;
	}
	
	return "Error: string null";
}

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
	document.getElementById("showimage").innerHTML = "<img src='./exemplo_mult_1.png'></img>";
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


//retirado de https://gist.github.com/wteuber/6241786
Math.fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };

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
	let optionsTermB = [];
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

	for (let i = 0; i < qtdeContas; i++)
	{
		let termB = "" + optionsTermB[RandInt(0, optionsTermB.length - 1)];
		let termA = makeMultTerm(0, 9, RandInt(2, lengthA));
		
		let A = termA;
		let k = 0;
		while (A.length > 1 && A[k] == 0 && k++) ;
		A = A.slice(k, A.length);

		let result = "nulo";
		let oper = "";
		if (operacao === "mult") {
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
	document.getElementById("showimage").innerHTML = "<img src='./exemplo_mult_1.png'></img>";
}

function limparContas(divContas) {
	document.getElementById(divContas).innerHTML = "";
}

function printExpressaoZ ( file, size=10 )
{
	let out = "";
	for (let i = 0; i < size; i++)
	{
		out += "Conta-"+i+": "+ makeExpressionZ(RandInt()*20 + 1, RandInt() * 4 + 5, i%2==0? true: false) + "<br />";
	}

	document.getElementById(file).innerHTML = out;
}

function printExpressao ( fileTag, mode=0, size=10 )
{
	let out = "";
	for (let i = 0; i < size; i++)
	{
		let str;
		if (mode == 0)
			str = makeExpressionZ(BASE_EXP, SIZE_EXP, false);
		else
			str = makeExpressionZ(BASE_EXP, SIZE_EXP, true);
		out += "Conta-" + i + ": " + str + "<br />";
	}
	
	out += "Deixe " + (SIZE_EXP - 1) + " linhas no caderno para cada conta";
	let tag = document.getElementById(fileTag);
	tag.innerHTML = out;
}

function printExpressaoMultOfNum ( fileTag, N, withNegativeSign=false, base=10, size=10 )
{
	let out = "";
	for (let i = 0; i < size; i++)
	{
		let str;
		str = makeExpressionMultOfNum(base, SIZE_EXP, withNegativeSign, N);
		let spanstart = "<span>";
		
		if (i % 2 == 0)
			spanstart = "<span>";
		
		out += "Conta-" + i + spanstart+": " + str + "<br /> </span>";
	}
	
	out += "Deixe " + (SIZE_EXP - 1) + " linhas no caderno para cada conta";
	let tag = document.getElementById(fileTag);
	tag.innerHTML = out;
}

//passos da multiplicação
//count é a conta criadas no printMultLevel
function doMultStep ( count, divID ) {
	let out = document.getElementById(divID);
	if (!out) {
		alert('Erro 1: ao criar passos de solução da conta');
		return;
	}

	
}

function setCookie(cname, cvalue, exdays=365) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";sameSite=Strict;path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

let teste = {
	version: "1",
	//apagar score antigo da versão velha
	apagarOldVersion: false,
	startTime: null,
	endTime: null,
	timeUpdate: null,
	qtdeContas: 10,
	contaAtual:-1,
	target: null,
	mesg: null,
	state: -1,
	operacaoEscolhida: "",
	optionsTermB: [],
	qtdeAtual: {
		facil: 0,
		medio: 0,
		dificil: 0,
	},
	//operação atual
	operAtual: null,
	contasErradas: [],
	inserirContaErrada: (operAtual) => {
		const found = teste.contasErradas.find(e => e.termA === operAtual.termA && e.termB === operAtual.termB);
		if (!found)
			teste.contasErradas.push(operAtual);
	},
	nextConta: () => {
		teste.state = 1;
	},
	showErrado: ( ) => {
		let mesg = document.getElementById(teste.mesg);
		mesg.textContent = 'Faustão: Errrrou!! '+teste.erradas;
	},
	showCerto: ( ) => {
		let mesg = document.getElementById(teste.mesg);
		mesg.textContent = 'Faustão: Olha essa fera aí bicho, acertou '+teste.certas;
	},
	reset: () =>{
		teste.operAtual = null;
		teste.contasErradas = [];
		teste.state = -1;
		teste.startTime= null;
		teste.endTime= null;
		teste.timeUpdate= null;
		teste.qtdeContas= 10;
		teste.contaAtual=-1;
		teste.target= null;
		teste.mesg= null;
		teste.state= -1;
		teste.certas = 0;
		teste.erradas = 0;
		teste.qtdeAtual = {
			facil: 0,
			medio: 0,
			dificil: 0,
		};
	},
	certas: 0,
	erradas: 0,
	//quantidade de botões para clicar
	qtdeButtonResp: 2,
	scoreTableId: "scoreTable",
	scoreBoard: [],
	maxScores: 20,
	randomWrongResp: () => {
		let n = teste.operAtual.result;
		while (n === teste.operAtual.result) {
			n = RandInt(0, teste.operAtual.result + 5);
		}
		return n;
	},
	atualizarBotoesResp: ()=>{
		if (!teste.operAtual) {
			console.log("atualizarBotesResp: teste.operAtual é nula");
			return;
		}
			let strHtml = "";
			switch (teste.qtdeButtonResp) {
				case 2:
					{
						let certa = RandInt(0, 1);
						strHtml += '<br />';
						strHtml += '<button type="button" id="btnResp0" class="greenButton" value="'
						+((certa === 0)?teste.operAtual.result:teste.randomWrongResp())
						+'" onclick="corrigirContaTeste(event)">'
						+((certa === 0)?teste.operAtual.result:teste.randomWrongResp())
						+'</button><span> </span>';
						strHtml += '<button type="button" id="btnResp1" class="greenButton" value="'
						+((certa === 1)?teste.operAtual.result:teste.randomWrongResp())
						+'" onclick="corrigirContaTeste(event)">'
						+((certa === 1)?teste.operAtual.result:teste.randomWrongResp())
						+'</button>';
						strHtml += '<br />';
					}
					break;
					case 4:
						{
							let certa = RandInt(0, 3);
							strHtml += '<br />';
							strHtml += '<button type="button" id="btnResp0" class="greenButton" value="'
							+((certa === 0)?teste.operAtual.result:teste.randomWrongResp())
							+'" onclick="corrigirContaTeste(event)">'
							+((certa === 0)?teste.operAtual.result:teste.randomWrongResp())
							+'</button>';
							strHtml += '<button type="button" id="btnResp1" class="greenButton" value="'
							+((certa === 1)?teste.operAtual.result:teste.randomWrongResp())
							+'" onclick="corrigirContaTeste(event)">'
							+((certa === 1)?teste.operAtual.result:teste.randomWrongResp())
							+'</button><span>  </span>';
							strHtml += '<br />';
							strHtml += '<button type="button" id="btnResp2" class="greenButton" value="'
							+((certa === 2)?teste.operAtual.result:teste.randomWrongResp())
							+'" onclick="corrigirContaTeste(event)">'
							+((certa === 2)?teste.operAtual.result:teste.randomWrongResp())
							+'</button>';
							strHtml += '<button type="button" id="btnResp3" class="greenButton" value="'
							+((certa === 3)?teste.operAtual.result:teste.randomWrongResp())
							+'" onclick="corrigirContaTeste(event)">'
							+((certa === 3)?teste.operAtual.result:teste.randomWrongResp())
							+'</button><span>  </span>';
							strHtml += '<br />';
						}
						break;
				}
			
			return strHtml;
		},
	loadScore: (  ) => {
		let base64Str = atob(getCookie('testeMathData'));
		if (base64Str)
			teste.scoreBoard = JSON.parse(base64Str);
	},
	saveScore: ()=>{
		setCookie('testeMathData', btoa(JSON.stringify(teste.scoreBoard)));
		setCookie('testeVersion', teste.version);
		setCookie('testeErradas', btoa(JSON.stringify(teste.contasErradas)));
	},
	apagarTodoScore: () => {
		if (confirm('Deseja apagar todo o score antigo?')) {
			teste.scoreBoard = [];
			teste.saveScore();
			document.getElementById(teste.scoreTableId).innerHTML = "";
		}
	},
	showScoreBoard: (scoreAtual=null) => {
		let strRows = "";
		let count = 0;
		document.getElementById(teste.scoreTableId).innerHTML = "";
		for (let obj of teste.scoreBoard) {
			strRows += '<tr ' + ((obj === scoreAtual)?'class="scoreAtual" >': ">");
			count++;
			strRows += '<td>';
			if (obj === scoreAtual)
				strRows += '<strong>';
			strRows += count;
			if (obj === scoreAtual)
				strRows += '</strong>';
			strRows += '</td>';

			for (let name in obj) {
				strRows += '<td>';
				if (obj === scoreAtual)
					strRows += '<strong>';
				
				strRows += obj[name];

				if (obj === scoreAtual)
					strRows += '</strong>';
				strRows += '</td>';
			}
			strRows += '</tr>';
		}

		let strHtml = 
		 '<table class="styleTable">'
		+'<tr>'
		+'	<th>'
		+'		Posição'
		+'	</th>'
		+'	<th>'
		+'		Tempo gasto (s)'
		+'	</th>'
		+'	<th>'
		+'		Total Contas'
		+'	</th>'
		+'	<th>'
		+'		Certas'
		+'	</th>'
		+'	<th>'
		+'		Erradas'
		+'	</th>'
		+'	<th>'
		+'		Operação'
		+'	</th>'
		+'</tr>'
		+strRows
		+'</table>';
		strHtml += `<button type="button" class="largeButton" onclick="teste.apagarTodoScore()">Apagar Todo Score</button>`;
		if (teste.contasErradas.length) {
			let count  = 0;
			strHtml += '<br />';
			for (let oper of teste.contasErradas) {
				strHtml += '<strong>Errada-'+(++count)+': '
				+oper.termA+' '+oper.sinal+' '+oper.termB
				+'</strong><br />';
				console.log('Errada'+count,oper);
			}
		}
		document.getElementById(teste.scoreTableId).innerHTML = strHtml;
	},
	inserirScore: (scoreAtual) => {
		let strRows = "";
		if (teste.scoreBoard.length > teste.maxScores) {
			alert('Seu score foi abaixo dos '+teste.maxScores+' anteriores');
			return;
		}
		teste.scoreBoard.push(scoreAtual);
		//ordena do menor para o amior tempo
		teste.scoreBoard.sort((a,b) => {
			return a.tempo - b.tempo;
		});
		teste.scoreBoard.splice(teste.maxScores, teste.scoreBoard.length);
		teste.showScoreBoard(scoreAtual);
	}
};

function showScoreBoard () {
	if (teste.scoreBoard.length === 0)
		teste.loadScore();
	teste.showScoreBoard();
}

function setQtdeButtonResp (radio) {
	if (teste.state <= 0) {
		teste.qtdeButtonResp = parseInt(radio.value);
		teste.atualizarBotoesResp();
	}
}

/**
 * 
 * @param {Event} event 
 */
function corrigirContaTeste ( event ) {
	if (teste.state === 3 || teste.state <= 0 || !teste.operAtual)
		return;
	console.log("Agora vamos corrigir!");
	let digitado = parseInt(event.target.value);
	if (teste.operAtual.result === digitado) {
		teste.operAtual.acertou = true;
		teste.nextConta();
		teste.certas++;
		console.log("ACERTOU!");
		teste.showCerto();
	}
	else {
		teste.operAtual.acertou = false;
		teste.erradas++;
		event.target.value = "";
		console.log("ERRRROU!!!");
		teste.showErrado();
		teste.inserirContaErrada(teste.operAtual);
	}
	
}

function obterFocus ( tagId ) {
	document.getElementById(tagId).focus();
}

function jumpTo ( elId ) {
	window.location.hash = elId;
}

function generateTerms ( optionsTermB, oper ) {
	if (optionsTermB.length === 0) {
		console.log("gernerateTerms::optionsTermB é vazio");
		return;
	}

	let minA = 0, maxA = 9;
	let termA = Math.floor(RandInt(minA, maxA));
	let termB = optionsTermB[RandInt(0, optionsTermB.length - 1)];
	let result = -1;
	let sinal = "null";
	let operacao = "";
	if (oper === "mult") {
		sinal = "x";
		operacao = "Multiplicação";
		result = termA * termB;
	}
	else if (oper === "div") {
		sinal = "/";
		operacao = "Divisão";
		let A = termA;
		termA = (termA * termB);
		result = A;
	}

	return {termA, termB, result, operacao, sinal};
}

function updateTeste ( target ) {
	switch (teste.state) {
		case 0:
			{
				teste.startTime = new Date().getTime();
				teste.endTime = null;
				teste.state = 1;
				document.getElementById(teste.resultadoId).innerHTML = "";
				document.getElementById(teste.target).innerHTML = "";
				document.getElementById(teste.mesg).innerHTML = "";
			}
			break;
		case 1:
			{
				teste.contaAtual++;
				if (teste.contaAtual >= teste.qtdeContasTeste) {
					teste.state = 3;
					teste.endTime = new Date().getTime();
					break;
				}
				teste.state = 2;
				teste.firstEnter = false;
				console.log("Gerando conta = "+teste.contaAtual);
			}
			break;
		case 2:
			{
				console.log('qtdeAtual', teste.qtdeAtual);
				
				let obj = generateTerms(teste.optionsTermB, teste.operacaoEscolhida);
				teste.operAtual = obj;
				let contaStr = '<div class="questionDiv"> <strong>'+obj.termA+' '+teste.operAtual.sinal+' '+obj.termB+'</strong></div>';
				//passar o elemento é com this, passar evento é event para 'corrigirCOntaTeste'
				let endStr = '<input id="respInput" type="number" min="0" step="1" '
					+'onkeydown="corrigirContaTeste(event)"></input>'
					+'</strong>';
				let endConta = '</div>';
				document.getElementById(teste.target).innerHTML = contaStr + teste.atualizarBotoesResp() + endConta;
				teste.state = 4;
				//pula para a tag da div
				jumpTo(teste.target);
				//obtem foco na div
				obterFocus(teste.target);
			}
			break;
		case 3:
			{	
				window.clearInterval(updateTeste);
				console.log("FIM do teste!");
				let wholeTime = (teste.endTime - teste.startTime) / 1000.0;
				let el = document.getElementById(teste.resultadoId);
				el.innerHTML = '<strong>Levou = '+wholeTime+' segundos para terminar '+teste.qtdeContasTeste+' contas</strong> <br />'
				+'<strong>Acertou '+teste.certas +' ou '+ Math.round(teste.certas / (teste.certas + teste.erradas) * 100.0) +'%</strong> <br />'
				+'<strong>Erradas '+teste.erradas+' ou '+ Math.round(teste.erradas / (teste.certas + teste.erradas) * 100.0) +'%</strong> <br />';
				teste.state = -1;
				teste.loadScore();
				teste.inserirScore({
					tempo:wholeTime, 
					qtdeContasTeste:teste.qtdeContasTeste,
					certas:teste.certas,
					erradas:teste.erradas,
					operacao: teste.operAtual.operacao,
				});
				teste.saveScore();
			}
			break;
		case 4:
			{
				console.log("esperando digitar...");
				if (teste.operAtual.acertou) {
					teste.nextConta();
				}
			}
			break;
	}
}

function setOperacaoTeste ( that ) {
	teste.operacaoEscolhida = that.value;
}

function iniciarTesteDiagnostico (form, targetTag, mesgTag, resultadoId, scoreTableId, qtdeButtonsTag ) {
	teste.reset();
	teste.optionsTermB = [];
	for (let el of form.elements) {
		if (el.id.indexOf('testeTermB') > -1 && el.checked) {
			teste.optionsTermB.push(parseInt(el.value));
		}
		else if (el.checked && el.name === 'operacao') {
			teste.operacaoEscolhida = el.value;
		}
		else if (el.id === "inputQtdeContas") {
			teste.qtdeContasTeste = parseInt(el.value);
		}
	}

	if (teste.optionsTermB.length === 0) {
		alert("Escolha quais numeros usar da tabuada na parte 'Quais numero da tabuada usar?'");
		teste.reset();
		return;
	}

	teste.target = targetTag;
	teste.mesg = mesgTag;
	teste.erradas = 0;
	teste.certas = 0;
	if (teste.qtdeContasTeste > 0)
		teste.state = 0;
	else {
		teste.state = -1;
		alert("Escolha total de contas > 0");
		return;
	}
	if (teste.timeUpdate)
		window.clearInterval(teste.timeUpdate);
	teste.timeUpdate = window.setInterval(updateTeste, 10);
	teste.resultadoId = resultadoId;
	teste.scoreTableId = scoreTableId;
	if (document.getElementById('twoResp').checked)
		setQtdeButtonResp(document.getElementById('twoResp'));
	if (document.getElementById('fourResp').checked)
		setQtdeButtonResp(document.getElementById('fourResp'));
}


///////////////////////////////////////////////
//gera exprões dentro dos números naturais
class GeradorExpressaoN {
	/**
	 * 
	 * @param {{mult:[], div:[], sub:[], sum:[], qtdeOper: {}, digitsTermA: number}} optionsTable 
	 */
	constructor (optionsTable) {
		this.optionsTable = optionsTable;
		this.digitsTermA = optionsTable.digitsTermA;
		if (!this.optionsTable.digitsTermA)
			alert("GeradorExpressaoN::Quantidade de digitos termA é inválida");
		this.answer = -1;
		//tentativas para fazer a expressão
		this.trying = 1000;
		this.expressionStr = "";
		this.qtdeLinhas = 0;
	}

	reset (  ) {
		this.answer = -1;
		this.expressionStr = "";
		this.qtdeLinhas = 0;
	}

	doExpression () {
		this.reset();
		let oper = [];
		
		if (this.optionsTable.mult.length)
			oper.push('mult');
		if (this.optionsTable.div.length)
			oper.push('div');
		if (this.optionsTable.sub.length)
			oper.push('sub');
		if (this.optionsTable.sum.length)
			oper.push('sum');
		
		if (!oper.length === 0) {
			alert("GeradorExpressaoN.doExpression::oper é vazio");
			return;
		}

		let expressionStr = "";
		let qtdeOper = {}, qtdeAux = {};
		if (this.optionsTable.qtdeOper.mult)
			qtdeOper["mult"] = this.optionsTable.qtdeOper.mult;
		if (this.optionsTable.qtdeOper.div)
			qtdeOper["div"] = this.optionsTable.qtdeOper.div;
		if (this.optionsTable.qtdeOper.sub)
			qtdeOper["sub"] = this.optionsTable.qtdeOper.sub;
		if (this.optionsTable.qtdeOper.sum)
			qtdeOper["sum"] = this.optionsTable.qtdeOper.sum;
		
		let totalTerms = 0;
		for (let o in qtdeOper) {
			totalTerms += qtdeOper[o];
		}
		
		if (!totalTerms) {
			alert("GeradorExpressaoN.doExpression::qdteOper é vazio");
			return;
		}
		
		for (let t = 0; t < this.trying; t++) {
			expressionStr = "";
			for (let o in qtdeOper) {
				qtdeAux[o] = qtdeOper[o];
			}
			for (let i = 0, total = totalTerms; ; ) {
				total = 0;
				for (let o in qtdeAux)
					total += qtdeAux[o];
				if (total === 0) {
					t = this.trying;
					break;
				}
				
				let chosen = RandInt(0, oper.length - 1);
				let sinal = "";
				let options = [];
				switch (oper[chosen]) {
					case 'mult':
						{
							if (qtdeAux["mult"] > 0) {
								qtdeAux["mult"]--;
								this.qtdeLinhas++;
								sinal = "*";
								options = this.optionsTable.mult;
							}
						}
						break;
					case 'div':
						{
							if (qtdeAux["div"] > 0) {
								qtdeAux["div"]--;
								this.qtdeLinhas++;
								sinal = "/";
								options = this.optionsTable.div;
							}
						}
						break;
					case 'sub':
						{
							if (qtdeAux["sub"] > 0) {
								this.qtdeLinhas += 2;
								sinal = "-";
								options = this.optionsTable.sub;
								qtdeAux["sub"]--;
							}
						}
						break;
					case 'sum':
						{
							if (qtdeAux["sum"] > 0) {
								this.qtdeLinhas += 2;
								sinal = "+";
								options = this.optionsTable.sum;
								qtdeAux["sum"]--;
							}
						}
						break;
				}

				if (!options.length) {
					continue;
				}

				let termA = parseInt(''+makeMultTerm(0,9, this.digitsTermA, false));
				
				let termB = parseInt(options[RandInt(0, options.length - 1)]);
				if (termA == 'NaN' || termB === 'NaN'){
					alert("GeradorExpressaoN.doExpression::Erro, termos inválidos, termA="+termA+', termB='+termB);
					return false;
				}
				if (oper[chosen] === "sub" && termB > termA) {
					let aux = termB;
					termB = termA;
					termA = aux;
				}

				if (oper[chosen] === "div" && Math.fmod(termA, termB) > 0) {
					termA = RandInt(0, 9) * termB;
				}

				expressionStr += ' '+termA+' '+sinal+' '+termB;
				if (total > 1) {
					expressionStr += ' + ';
					this.qtdeLinhas++;
				}
			}
			console.log(expressionStr);
			this.answer = eval(expressionStr);
			if (this.answer > 0) {
				this.expressionStr = expressionStr;
				return true;
			}
		}

		return false;
	}
}

function showExprNResp ( index, strExpr, answer ) {
	alert("Expressão N-"+index+': '+strExpr+', resposta = '+answer);
}

function gerarExpressaoN ( form, targetId ) {
	console.log("Aqui estamos gerarExpressaoN");
	let mult = [];
	let div = [];
	let sub = [];
	let sum = [];
	let digitsTermA = 2;
	let qtdeExpressao = 10;
	let qtdeOper = {};

	for (let el of form.elements) {
		if (el.type === 'checkbox' && el.checked) {
			if (el.id.indexOf('multOptions') > -1)
				mult.push(parseInt(el.value));
			else if (el.id.indexOf('divOptions') > -1)
				div.push(parseInt(el.value));
			else if (el.id.indexOf('subOptions') > -1)
				sub.push(parseInt(el.value));
			else if (el.id.indexOf('sumOptions') > -1)
				sum.push(parseInt(el.value));
		}
		else if (el.id.indexOf('DigitsTermA') > -1) {
			digitsTermA = parseInt(el.value);
		}
		else if (el.id.indexOf('qtdeExpressao') > -1) {
			qtdeExpressao = parseInt(el.value);
		}
	}

	if (!(mult.length || div.length || sub.length || sum.length)) {
		alert("Escolha quais termos usar em cada operação, marque de 1 ao 9 nas opções");
		return;
	}

	for (let el of form.elements) {
		if (el.id.indexOf('QtdeTermN') > -1) {
			if (el.id.indexOf("sum") > -1) {
				if (sum.length)
					qtdeOper["sum"] = parseInt(el.value);
			}
			else if (el.id.indexOf("sub") > -1) {
				if (sub.length)
					qtdeOper["sub"] = parseInt(el.value);
			}
			else if (el.id.indexOf("mult") > -1) {
				if (mult.length)
					qtdeOper["mult"] = parseInt(el.value);
			}
			else if (el.id.indexOf("div") > -1) {
				if (div.length)
					qtdeOper["div"] = parseInt(el.value);
			}
		}
	}

	if (qtdeExpressao <= 0) {
		alert("Escolha quantos termos usar nas expressões");
		return;
	}

	let gerador = new GeradorExpressaoN({mult,div, sub, sum, digitsTermA, qtdeOper});
	let strHtml = "";
	for (let i = 0; i < qtdeExpressao; i++) {
		if (!gerador.doExpression()) {
			console.log('Falha ao gerar expressão N i='+i, gerador);
			continue;
		}
		strHtml += '<p><strong>NOTA: Para a expressão, deixe '+(gerador.qtdeLinhas - 1)+' linhas no caderno abaixo da expressão</strong><br />';
		strHtml += 'Expressão N-'+(i+1)+': '
		+'<strong>'
		+gerador.expressionStr
		+'</strong>'
		+'<br />'
		+'<button type="button" onclick="showExprNResp('+i+',`'+gerador.expressionStr+'`,'+gerador.answer+');">'
		+'Ver resposta Expressão N-'+(i+1)
		+'</button><br /></p>';
	}
	
	
	document.getElementById(targetId).innerHTML = strHtml;
}

function checkAll ( formID, targetID, value ) {
	const form = document.getElementById(formID);
		for (let e of form.elements) {
		if (e.type === 'checkbox' && e.id.indexOf(targetID) > -1) {
			e.checked = value;
		}
	}
}

//////////////////////////////////////////////////////////////////////
//gera exprões dentro dos números inteiros
class GeradorExpressaoZ {
	/**
	 * 
	 * @param {{mult:[], div:[], sub:[], sum:[], qtdeOper: {}, digitsTermA: number}} optionsTable 
	 */
	constructor (optionsTable) {
		this.optionsTable = optionsTable;
		this.digitsTermA = optionsTable.digitsTermA;
		if (!this.optionsTable.digitsTermA)
			alert("GeradorExpressaoZ::Quantidade de digitos termA é inválida");
		this.answer = -1;
		//tentativas para fazer a expressão
		this.trying = 10000;
		this.expressionStr = "";
		this.qtdeLinhas = 0;
		this.termos = [];
	}

	reset (  ) {
		this.answer = 0;
		this.expressionStr = "";
		this.qtdeLinhas = 0;
		this.termos = [];
	}

	doExpression () {
		this.reset();
		let oper = [];
		
		if (this.optionsTable.mult.length)
			oper.push('mult');
		if (this.optionsTable.div.length)
			oper.push('div');
		if (this.optionsTable.sub.length)
			oper.push('sub');
		if (this.optionsTable.sum.length)
			oper.push('sum');
		
		if (!oper.length === 0) {
			alert("GeradorExpressaoN.doExpression::oper é vazio");
			return;
		}

		let expressionStr = "";
		let qtdeOper = {}, qtdeAux = {};
		if (this.optionsTable.qtdeOper.mult)
			qtdeOper["mult"] = this.optionsTable.qtdeOper.mult;
		if (this.optionsTable.qtdeOper.div)
			qtdeOper["div"] = this.optionsTable.qtdeOper.div;
		if (this.optionsTable.qtdeOper.sub)
			qtdeOper["sub"] = this.optionsTable.qtdeOper.sub;
		if (this.optionsTable.qtdeOper.sum)
			qtdeOper["sum"] = this.optionsTable.qtdeOper.sum;
		
		let totalTerms = 0;
		for (let o in qtdeOper) {
			totalTerms += qtdeOper[o];
		}
		
		if (!totalTerms) {
			alert("GeradorExpressaoN.doExpression::qdteOper é vazio");
			return;
		}

		const sinais = ['+','-'];
		for (let t = 0; t < this.trying; t++) {
			expressionStr = "";
			let lastSinal = '+';
			this.termos = [];
			for (let o in qtdeOper) {
				qtdeAux[o] = qtdeOper[o];
			}
			for (let i = 0, total = totalTerms; ; ) {
				total = 0;
				for (let o in qtdeAux)
					total += qtdeAux[o];
				if (total === 0) {
					t = this.trying;
					break;
				}
				
				let chosen = RandInt(0, oper.length - 1);
				let sinal = "";
				
				let options = [];
				switch (oper[chosen]) {
					case 'mult':
						{
							if (qtdeAux["mult"] > 0) {
								qtdeAux["mult"]--;
								this.qtdeLinhas++;
								sinal = "*";
								options = this.optionsTable.mult;
							}
						}
						break;
					case 'div':
						{
							if (qtdeAux["div"] > 0) {
								qtdeAux["div"]--;
								this.qtdeLinhas++;
								sinal = "/";
								options = this.optionsTable.div;
							}
						}
						break;
					case 'sub':
						{
							if (qtdeAux["sub"] > 0) {
								this.qtdeLinhas += 2;
								sinal = "-";
								options = this.optionsTable.sub;
								qtdeAux["sub"]--;
							}
						}
						break;
					case 'sum':
						{
							if (qtdeAux["sum"] > 0) {
								this.qtdeLinhas += 2;
								sinal = "+";
								options = this.optionsTable.sum;
								qtdeAux["sum"]--;
							}
						}
						break;
				}

				if (!options.length) {
					continue;
				}

				let termA = parseInt(''+makeMultTerm(0,9, this.digitsTermA, false));
				
				let termB = parseInt(options[RandInt(0, options.length - 1)]);
				if (termA == 'NaN' || termB === 'NaN'){
					alert("GeradorExpressaoN.doExpression::Erro, termos inválidos, termA="+termA+', termB='+termB);
					return false;
				}

				if (oper[chosen] === "div" && Math.fmod(termA, termB) > 0) {
					termA = RandInt(1, 9) * termB;
				}
				
				const sinalA = sinais[RandInt(0,sinais.length-1)];
				const sinalB = sinais[RandInt(0,sinais.length-1)];
				let start = '';
				let end = '';
				if (sinal === '*' || sinal === '/') {
					 start = '(';
					if (sinalA === '-')
						termA = '('+sinalA+termA+')';
					else
						termA = sinalA+termA;
					termB = '('+sinalB+termB+')';
					end =')';
				}
				else if (sinal === '+' || sinal === '-') {
					termA = '('+sinalA+termA+')';
					termB = '('+sinalB+termB+')';
				}

				expressionStr += start+termA+' '+sinal+' '+termB+end+' ';

				const sinalChosen = sinais[RandInt(0,sinais.length - 1)];
				this.termos.push({text:lastSinal+start+termA+' '+sinal+' '+termB+end+' '});
				this.termos[this.termos.length - 1].answer = eval(lastSinal+start+termA+' '+sinal+' '+termB+end);
				lastSinal = sinalChosen;

				if (total > 1) {
					expressionStr += sinalChosen;
					this.qtdeLinhas++;
				}
			}
			console.log(expressionStr);
			this.answer = eval(expressionStr);
			if (this.answer != 0) {
				this.expressionStr = expressionStr;
				return true;
			}
		}

		return false;
	}
}

function showExprZResp ( index, strExpr, answer ) {
	alert("Expressão Z-"+index+': '+strExpr+', resposta = '+answer);
}

function gerarExpressaoZ ( form, targetId ) {
	console.log("Aqui estamos gerarExpressaoZ");
	let mult = [];
	let div = [];
	let sub = [];
	let sum = [];
	let digitsTermA = 2;
	let qtdeExpressao = 10;
	let qtdeOper = {};

	for (let el of form.elements) {
		if (el.type === 'checkbox' && el.checked) {
			if (el.id.indexOf('multOptions') > -1)
				mult.push(parseInt(el.value));
			else if (el.id.indexOf('divOptions') > -1)
				div.push(parseInt(el.value));
			else if (el.id.indexOf('subOptions') > -1)
				sub.push(parseInt(el.value));
			else if (el.id.indexOf('sumOptions') > -1)
				sum.push(parseInt(el.value));
		}
		else if (el.id.indexOf('DigitsTermA') > -1) {
			digitsTermA = parseInt(el.value);
		}
		else if (el.id.indexOf('qtdeExpressao') > -1) {
			qtdeExpressao = parseInt(el.value);
		}
	}

	if (!(mult.length || div.length || sub.length || sum.length)) {
		alert("Escolha quais termos usar em cada operação, marque de 1 ao 9 nas opções");
		return;
	}

	for (let el of form.elements) {
		if (el.id.indexOf('QtdeTermZ') > -1) {
			
			if (el.id.indexOf("sum") > -1) {
				if (sum.length)
					qtdeOper["sum"] = parseInt(el.value);				
			}
			else if (el.id.indexOf("sub") > -1) {
				if (sub.length)
					qtdeOper["sub"] = parseInt(el.value);
			}
			else if (el.id.indexOf("mult") > -1) {
				if (mult.length)
					qtdeOper["mult"] = parseInt(el.value);
			}
			else if (el.id.indexOf("div") > -1) {
				if (div.length)
					qtdeOper["div"] = parseInt(el.value);
			}
		}
	}

	let c = 0;
	for (let e in qtdeOper) {
		if (qtdeOper[e] > 0) {
			c++;
		}
	}
	if (!c) {
		alert("qtdeOper é inválido, zerado!");
		return;
	}

	if (qtdeExpressao <= 0) {
		alert("Escolha quantos termos usar nas expressões");
		return;
	}

	let gerador = new GeradorExpressaoZ({mult,div, sub, sum, digitsTermA, qtdeOper});
	let strHtml = "";
	for (let i = 0; i < qtdeExpressao; i++) {
		if (!gerador.doExpression()) {
			console.log('Falha ao gerar expressão N i='+i, gerador);
			continue;
		}
		strHtml += '<p><strong>NOTA: Para a expressão, deixe '+(gerador.qtdeLinhas - 1)+' linhas no caderno abaixo da expressão</strong><br />';
		strHtml += 'Expressão Z-'+(i+1)+': '
		+'<strong>'
		+gerador.expressionStr
		+'</strong>'
		+'<br />'
		+'<button type="button" onclick="showExprZResp('+i+',`'+gerador.expressionStr+'`,'+gerador.answer+');">'
		+'Ver resposta Expressão Z-'+(i+1)
		+'</button><br /></p>';
	}
	
	
	document.getElementById(targetId).innerHTML = strHtml;
}

//em 18/04/2021
//////////////////////////////////////////////////////////////////////
//gera expressões dentro dos números reais
class GeradorExpressaoR {
	/**
	 * 
	 * @param {{mult:[], div:[], sub:[], sum:[], qtdeOper: {}, digitsTerm: number}} optionsTable 
	 */
	constructor (optionsTable) {
		this.optionsTable = optionsTable;
		this.digitsTerm = optionsTable.digitsTerm;
		if (!this.optionsTable.digitsTerm)
			alert("GeradorExpressaoR::Quantidade de digitos termo é inválida");
		this.answer = -1;
		//tentativas para fazer a expressão
		this.trying = 10000;
		this.expressionStr = "";
		this.qtdeLinhas = 0;
		this.termos = [];
	}

	reset (  ) {
		this.answer = 0;
		this.expressionStr = "";
		this.qtdeLinhas = 0;
		this.termos = [];
	}

	doExpression () {
		this.reset();
		let oper = [];
		
		if (this.optionsTable.mult.length)
			oper.push('mult');
		if (this.optionsTable.div.length)
			oper.push('div');
		if (this.optionsTable.sub.length)
			oper.push('sub');
		if (this.optionsTable.sum.length)
			oper.push('sum');
		
		if (!oper.length === 0) {
			alert("GeradorExpressaoN.doExpression::oper é vazio");
			return;
		}

		let expressionStr = "";
		let qtdeOper = {}, qtdeAux = {};
		if (this.optionsTable.qtdeOper.mult)
			qtdeOper["mult"] = this.optionsTable.qtdeOper.mult;
		if (this.optionsTable.qtdeOper.div)
			qtdeOper["div"] = this.optionsTable.qtdeOper.div;
		if (this.optionsTable.qtdeOper.sub)
			qtdeOper["sub"] = this.optionsTable.qtdeOper.sub;
		if (this.optionsTable.qtdeOper.sum)
			qtdeOper["sum"] = this.optionsTable.qtdeOper.sum;
		
		let totalTerms = 0;
		for (let o in qtdeOper) {
			totalTerms += qtdeOper[o];
		}
		
		if (!totalTerms) {
			alert("GeradorExpressaoR.doExpression::qdteOper é vazio");
			return;
		}

		const sinais = ['+','-'];
		for (let t = 0; t < this.trying; t++) {
			expressionStr = "";
			this.termos = [];
			let lastSinal = '+';
			for (let o in qtdeOper) {
				qtdeAux[o] = qtdeOper[o];
			}
			for (let i = 0, total = totalTerms; ; ) {
				total = 0;
				for (let o in qtdeAux)
					total += qtdeAux[o];
				if (total === 0) {
					t = this.trying;
					break;
				}
				
				let chosen = RandInt(0, oper.length - 1);
				let sinal = "";
				let options = [];
				switch (oper[chosen]) {
					case 'mult':
						{
							if (qtdeAux["mult"] > 0) {
								qtdeAux["mult"]--;
								this.qtdeLinhas++;
								sinal = "*";
								options = this.optionsTable.mult;
							}
						}
						break;
					case 'div':
						{
							if (qtdeAux["div"] > 0) {
								qtdeAux["div"]--;
								this.qtdeLinhas++;
								sinal = "/";
								options = this.optionsTable.div;
							}
						}
						break;
					case 'sub':
						{
							if (qtdeAux["sub"] > 0) {
								this.qtdeLinhas += 2;
								sinal = "-";
								options = this.optionsTable.sub;
								qtdeAux["sub"]--;
							}
						}
						break;
					case 'sum':
						{
							if (qtdeAux["sum"] > 0) {
								this.qtdeLinhas += 2;
								sinal = "+";
								options = this.optionsTable.sum;
								qtdeAux["sum"]--;
							}
						}
						break;
				}

				if (!options.length) {
					continue;
				}
				
				// denominador de base 10
				//digitsTerm precisa ser no minimo 2 
				const denom = RandInt(1,this.digitsTerm / 2) * 10;
				let termA = ""+(makeMultTerm(0,9, this.digitsTerm, false) / denom);
				
				let termB = parseInt(options[RandInt(0, options.length - 1)]);
				if (termA == 'NaN' || termB === 'NaN'){
					alert("GeradorExpressaoN.doExpression::Erro, termos inválidos, termA="+termA+', termB='+termB);
					return false;
				}

				const sinalA = sinais[RandInt(0,sinais.length-1)];
				const sinalB = sinais[RandInt(0,sinais.length-1)];
				let start = '';
				let end = '';
				if (sinal === '*' || sinal === '/') {
					 start = '(';
					if (sinalA === '-')
						termA = '('+sinalA+termA+')';
					else
						termA = sinalA+termA;
					termB = '('+sinalB+termB+')';
					end =')';
				}
				else if (sinal === '+' || sinal === '-') {
					termA = '('+sinalA+termA+')';
					termB = '('+sinalB+termB+')';
				}

				expressionStr += start+termA+' '+sinal+' '+termB+end+' ';
				
				const sinalChosen = sinais[RandInt(0,sinais.length - 1)];
				this.termos.push({text:lastSinal+start+termA+' '+sinal+' '+termB+end+' '});
				this.termos[this.termos.length - 1].answer = eval(lastSinal+start+termA+' '+sinal+' '+termB+end);
				lastSinal = sinalChosen;
				
				if (total > 1) {
					expressionStr += sinalChosen;
					this.qtdeLinhas++;
				}
			}
			console.log(expressionStr);
			this.answer = eval(expressionStr);
			if (this.answer != 0) {
				this.expressionStr = expressionStr;
				return true;
			}
		}

		return false;
	}
}

function showExprRResp ( index, strExpr, answer ) {
	alert("Expressão R-"+index+': '+strExpr+', resposta = '+answer);
}

//BUG: ainda não usa o mix e max para gerar o números
function gerarExpressaoR ( form, targetId ) {
	console.log("Aqui estamos gerarExpressaoR");
	let min = 1;
	let max = 100;
	let mult = [];
	let div = [];
	let sum = [];
	let sub = [];
	let digitsTerm = 2;
	let qtdeExpressao = 10;
	let qtdeTerms = 5;
	let qtdeOper = {};

	for (let el of form.elements) {
		if (el.id.indexOf('OptionsR') > -1) {
			if (el.id.indexOf('OptionsRMin') > -1) {
				min = parseInt(el.value);
			}
			else if (el.id.indexOf('OptionsRMax') > -1) {
				max = parseInt(el.value);
			}
		}
		else if (el.id.indexOf('DigitsTermR') > -1) {
			digitsTermA = parseInt(el.value);
		}
		else if (el.id.indexOf('qtdeExpressao') > -1) {
			qtdeExpressao = parseInt(el.value);
		}
		else if (el.id.indexOf('qtdeTerms') > -1) {
			qtdeTerms = parseInt(el.value);
		}
	}

	if (min > max) {
		let a = min;
		min = max;
		max = a;
	}
		

	if (qtdeExpressao < 4)
		qtdeExpressao = 4;
	for (let i = 1; i < 10; i++) {
		mult.push(i);
		div.push(i);
		sum.push(i);
		sub.push(i);
	}

	if (!(mult.length || div.length || sub.length || sum.length)) {
		alert("Escolha quais termos usar em cada operação, marque de 1 ao 9 nas opções");
		return;
	}

	for (let i = 0; i < qtdeTerms / 4; i++) {
		qtdeOper["sum"] = i;
		qtdeOper["sub"] = i;
		qtdeOper["mult"] = i;
		qtdeOper["div"] = i;
	}

	let gerador = new GeradorExpressaoR({mult, div, sub, sum, digitsTerm, qtdeOper});
	let strHtml = "";
	for (let i = 0; i < qtdeExpressao; i++) {
		if (!gerador.doExpression()) {
			console.log('Falha ao gerar expressão R i='+i, gerador);
			continue;
		}
		strHtml += '<p><strong>NOTA: Para a expressão, deixe '+(gerador.qtdeLinhas - 1)+' linhas no caderno abaixo da expressão</strong><br />';
		strHtml += 'Expressão R-'+(i+1)+': '
		+'<strong>'
		+gerador.expressionStr
		+'</strong>'
		+'<br />'
		+'<button type="button" onclick="showExprRResp('+i+',`'+gerador.expressionStr+'`,'+gerador.answer+');">'
		+'Ver resposta Expressão R-'+(i+1)
		+'</button><br /></p>';
	}
	
	
	document.getElementById(targetId).innerHTML = strHtml;
}

//em 19/04/2021
//////////////////////////////////////////////////////////////////////
//gera expressões fatorial dentro dos números inteiros
class GeradorExpressaoFatorial {
	/**
	 * 
	 * @param {{mult:[], div:[], sub:[], sum:[], qtdeOper: {}, digitsTermA: number, qtdeTersm:number, min:number, max:number}} optionsTable 
	 */
	constructor (optionsTable) {
		this.optionsTable = optionsTable;
		this.digitsTermA = optionsTable.digitsTermA;
		if (!this.optionsTable.digitsTermA)
			alert("GeradorExpressaoZ::Quantidade de digitos termA é inválida");
		this.answer = -1;
		//tentativas para fazer a expressão
		this.trying = 10;
		this.expressionStr = "";
		this.qtdeLinhas = 0;
		this.termos = [];
	}

	reset (  ) {
		this.answer = 0;
		this.expressionStr = "";
		this.qtdeLinhas = 0;
		this.termos = [];
	}

	fatorial (n, p) {
		if (n <= p || p <= 0)
			return 1;
		return n * this.fatorial(n - 1, p);
	}

	permutacao (a, b) {
		return this.fatorial(a,b) / this.fatorial(a - b, 1);
	}

	arranjo (a, b) {
		return this.fatorial(a,a-b);
	}

	doExpression () {
		this.reset();
		
		const min = this.optionsTable.min;
		const max = this.optionsTable.max;
		const Pbase = 5;
		let expressionStr = "";
		
		let totalTerms = this.optionsTable.qtdeTerms;
		if (totalTerms < 2) {
			alert('GeradorExpressaoFattorial::totalTermos é menor que 2');
			return;
		}
		const sinais = ['+','-'];
		const formulas = ['permutacao', 'arranjo'];
		for (let t = 0; t < this.trying; t++) {
			expressionStr = "";
			
			this.answer = 0;
			let last = 0, begin = 0;
			let lastSinal = '+';
			for (let i = 0, total = totalTerms; total > 0; total--) {
				let termA = RandInt(min, max);
				const mb = termA - Pbase < 0? 1: termA - Pbase; 
				let termB = RandInt(mb, termA - 1);
				if (termA === 'NaN' || termB === 'NaN'){
					alert("GeradorExpressaoFatorial.doExpression::Erro, termos inválidos, termA="+termA+', termB='+termB);
					return false;
				}
				
				let start = '';
				let end = '';
				const a = termA;
				const b = termB;
				const chosenForm = formulas[RandInt(0,formulas.length - 1)];
				start = '(';
				if (chosenForm === 'permutacao')
				{
					termA = '('+a+'!)'+'/';
					termB = '('+b+'!'+'*'+'('+a+'-'+b+')!'+')';
				}

				if (chosenForm === 'arranjo')
				{
					termA = '('+a+'!)'+'/';
					termB = '('+a+'-'+b+')!';
				}
				end =')';
				
				
				expressionStr += start+termA+termB+end+' ';
				
				const sinalChosen = sinais[RandInt(0,sinais.length-1)];
				if (total === totalTerms)
					lastSinal = sinalChosen;
				
				this.termos.push({text:lastSinal+start+termA+termB+end});

				if (total === totalTerms) {
					if (chosenForm === 'permutacao')
						begin = this.permutacao(a,b);
					else if (chosenForm === 'arranjo') 
						begin = this.arranjo(a,b);
					this.termos[this.termos.length - 1].answer = (lastSinal === '-'? -1: +1) * begin;
				}
				else if (total === 1) {
					if (chosenForm === 'permutacao')
						last = this.permutacao(a,b);
					else if (chosenForm === 'arranjo')
						last = this.arranjo(a,b);
					this.termos[this.termos.length - 1].answer = (lastSinal === '-'? -1: +1) * last;
				}
				else {
					let middle = 0;
					if (lastSinal === '+') {
						if (chosenForm === 'permutacao') {
							this.answer += this.permutacao(a,b);
							middle = this.permutacao(a,b);
						}
						else if (chosenForm === 'arranjo') {
							this.answer += this.arranjo(a,b);
							middle = this.arranjo(a,b);
						}
					}
					else {
						if (chosenForm === 'permutacao') {
							this.answer -= this.permutacao(a,b);
							middle = this.permutacao(a,b);
						}
						else if (chosenForm === 'arranjo') {
							this.answer -= this.arranjo(a,b);
							middle = this.arranjo(a,b);
						}
					}

					this.termos[this.termos.length - 1].answer = (lastSinal === '-'? -1: +1) * middle;
				}

				if (total > 1) {
					expressionStr += sinalChosen;
					this.qtdeLinhas++;
					lastSinal = sinalChosen;
				}
			}
			this.answer += begin;
			this.answer += (lastSinal === '-'? -1: +1)*last;
			console.log(this.answer, begin, last);
			console.log(expressionStr);
			if (this.answer != 0) {
				this.expressionStr = expressionStr;
				return true;
			}
		}

		return false;
	}
}

function showExprFatorialResp ( index, strExpr, answer ) {
	alert("Expressão Fatorial-"+index+': '+strExpr+', resposta = '+answer);
}

function gerarExpressaoFatorial ( form, targetId ) {
	console.log("Aqui estamos gerarExpressaofatorial");
	let mult = [];
	let div = [];
	let sub = [];
	let sum = [];
	let min = 2;
	let max = 10;
	let digitsTermA = 2;
	let qtdeExpressao = 10;
	let qtdeOper = {};
	let qtdeTerms = 2;

	for (let el of form.elements) {
		if (el.id.indexOf('OptionsFatorialMin') > -1) {
			min = parseInt(el.value);
		}
		else if (el.id.indexOf('OptionsFatorialMax') > -1) {
			max = parseInt(el.value);
		}
		else if (el.id.indexOf('DigitsTermA') > -1) {
			digitsTermA = parseInt(el.value);
		}
		else if (el.id.indexOf('qtdeExpressao') > -1) {
			qtdeExpressao = parseInt(el.value);
		}
		else if (el.id.indexOf('qtdeTerms') > -1) {
			qtdeTerms = parseInt(el.value);
		}
	}

	if (min > max) {
		let a = min;
		min = max;
		max = a;
	}

	if (qtdeExpressao <= 0) {
		alert("Escolha quantos termos usar nas expressões");
		return;
	}

	let gerador = new GeradorExpressaoFatorial({mult,div, sub, sum, digitsTermA, qtdeTerms, min, max});
	let strHtml = "";
	for (let i = 0; i < qtdeExpressao; i++) {
		if (!gerador.doExpression()) {
			console.log('Falha ao gerar expressão Fatorial i='+i, gerador);
			continue;
		}
		strHtml += 'Expressão Fatorial-'+(i+1)+': '
		+'<strong>'
		+gerador.expressionStr
		+'</strong>'
		+'<br />'
		+'<button type="button" onclick="showExprFatorialResp('+i+',`'+gerador.expressionStr+'`,'+gerador.answer+');">'
		+'Ver resposta Expressão Fatorial-'+(i+1)
		+'</button><br /></p>';
	}
	
	document.getElementById(targetId).innerHTML = strHtml;
}

//em 07/06/2021
//////////////////////////////////////////////////////////////////////
//gera fatoração de números
class GeradorFatoracao {
	/**
	 * 
	 * @param {{mult:[], div:[], sub:[], sum:[], qtdeOper: {}, digitsTermA: number, qtdeTersm:number, min:number, max:number}} optionsTable 
	 */
	constructor (optionsTable) {
		this.optionsTable = optionsTable;
		this.answer = -1;
		//tentativas para fazer a expressão
		this.trying = 10;
		this.expressionStr = "";
		this.expressionArray = [];
		this.qtdeLinhas = 0;
		this.termos = [];
		this.primos = [2,3,5,7,11,13,17,19,23,29,31,37,39,41,43,47];
	}

	reset (  ) {
		this.answer = [];
		this.expressionStr = "";
		this.expressionArray = [];
		this.qtdeLinhas = 0;
		this.termos = [];
	}

	fatorial (n, p) {
		if (n <= p || p <= 0)
			return 1;
		return n * this.fatorial(n - 1, p);
	}

	permutacao (a, b) {
		return this.fatorial(a,b) / this.fatorial(a - b, 1);
	}

	arranjo (a, b) {
		return this.fatorial(a,a-b);
	}

	doExpression () {
		this.reset();
		
		const min = 0;
		const max = this.primos.length - 1;
		let expressionStr = "";
		
		let totalTerms = this.optionsTable.qtdeTerms;
		if (totalTerms < 2) {
			alert('GeradorFatoracao::totalTermos é menor que 2');
			return;
		}
		for (let t = 0; t < this.trying; t++) {
			expressionStr = "";
			
			this.answer = new Array();
			let mult = 1;
			for (let i = 0, total = totalTerms; total > 0; total--) {
				let term = this.primos[RandInt(min, max)];
				mult *= term;
				if (!mult)
					return false;
				this.answer.push({primo:term, question: mult, answer: mult / term});
			}

			let maior = 0;
			this.answer.forEach((v) => {
				if (v > maior || maior === 0) {
					maior = v;
				}
			});
			this.answer.sort((a, b) => {
				if (a.question < b.question)
					return -1;
				return 1;
			});
			this.answer.reverse();
			const str = new String(maior);
			for (const e of this.answer) {
				this.expressionArray.push(e);
				expressionStr += String(e.question).padStart(str.length)+" | "+e.primo+"\n";
			}
				
			console.log(this.answer);
			console.log(expressionStr);
			if (this.answer != 0) {
				this.expressionStr = "\n"+expressionStr;
				return true;
			}
		}

		return false;
	}
}

function showFatoracaoResp ( index, strExpr ) {
	alert("Número Fatorado-"+index+': '+strExpr);
}

function gerarFatoracao ( form, targetId ) {
	console.log("Aqui estamos gerarExpressaofatorial");
	let mult = [];
	let div = [];
	let sub = [];
	let sum = [];
	let min = 2;
	let max = 10;
	let digitsTermA = 2;
	let qtdeExpressao = 10;
	let qtdeOper = {};
	let qtdeTerms = 2;

	for (let el of form.elements) {
		if (el.id.indexOf('qtdeExpressao') > -1) {
			qtdeExpressao = parseInt(el.value);
		}
		else if (el.id.indexOf('qtdeTerms') > -1) {
			qtdeTerms = parseInt(el.value);
		}
	}

	if (min > max) {
		let a = min;
		min = max;
		max = a;
	}

	if (qtdeExpressao <= 0) {
		alert("Escolha quantos termos usar nas expressões");
		return;
	}

	let gerador = new GeradorFatoracao({mult,div, sub, sum, digitsTermA, qtdeTerms, min, max});
	let strHtml = "";
	for (let i = 0; i < qtdeExpressao; i++) {
		let t = 0;
		while (!gerador.doExpression() && ++t < 100) {
			console.log('Falha ao gerar fatoração i='+i, gerador);
		}
		strHtml += 'Fatoração-'+(i+1)+': '
		+'<strong>'
		+gerador.expressionArray[0].question
		+'</strong>'
		+'<br />'
		+'<button type="button" onclick="showFatoracaoResp('+i+',`'+gerador.expressionStr+'`);">'
		+'Ver resposta Fatoração-'+(i+1)
		+'</button><br /></p>';
	}
	
	document.getElementById(targetId).innerHTML = strHtml;
}



//////////////////////////////////////////////////////////////////////
//gera expressões dentro dos números inteiros
class GeradorExpressaoAlgebrica {
	/**
	 * 
	 * @param {{maxPotency:number, maxNumber:number, maxLiteral:number, qtdeMonomio:number}} optionsTable 
	 */
	constructor (optionsTable) {
		this.optionsTable = optionsTable;
		this.expressionStr = "";
		console.log(optionsTable.maxPotency, optionsTable.maxNumber, optionsTable.maxLiteral, optionsTable.qtdeMonomio);
	}

	reset (  ) {
		this.expressionStr = "";
	}



	/**
	 * 
	 * @param {{termA:number, 
	 *          signalA:string, 
	 *          termB:number, 
	 *          signalB:string, 
	 *          operation:string,
	 *          literalsTermA:[{
	 * 					 literal:string,
	 *           potency:number,
	 *          }],
	 *          literalsTermB:[{
	 * 					 literal:string,
	 *           potency:number,
	 *          }]
	 * 				 }} termo
	 * Exemplo de parametos que podem vir:
	 * 1ab^2 + 3b^2c^2
	 * 1ab^2 = {termA:1, [{literal:'a', pontency:1},{literal:'b', pontency:2}], signalA:'+'}
	 * + = {operation: '+'}
	 * 3b^2c^2 = {termA:3, [{literal:'b', pontency:2},{literal:'c', pontency:2}], signalA:'+'}
	 * @returns {{termA:number,
	 *            termB:number,
	 *            signalA:string,
	 *            signalB:string,
	 *            operation:string,
	 *            literalsTermA:[{
	 * 					    literal:string,
	 *             	potency:number,
	 *            }],
	 *            literalsTermB:[{
	 *  					  literal:string,
	 *              potency:number,
	 *            }],
	 * 	          result:string,
   *          }}
	 * */
	algebricTermsSolver (termo) {
		let answer = {
			termA:'',
			termB:'',
			signalA:'',
			signalB:'',
			literalTermA:[],
			literalTermB:[],
			operation:'',
			result:'',
		};
		
		if (termo.operation === '*') {
			const a = Math.abs(termo.termA);
			const b = Math.abs(termo.termB);
			const r = a * b;
			answer.termA = r;
			answer.signalA = (
														(termo.signalA === '-' && termo.signalB == '+') ||
														(termo.signalA === '+' && termo.signalB == '-')
													)? '-': '+';
			
			let literalsA = termo.literalsTermA.slice(), literalsB = termo.literalsTermB.slice();
			for (let i = 0; i < literalsA.length; i++) {
				let literalA = literalsA[i];
				let literalB = literalsB.find((b) => b.literal === literalA.literal);
				//se achar um igual
				if (literalB) {
					//então, atualiza a potência do termo A
					const index = literalsB.indexOf(literalB);
					literalsB.splice(index, 1);
					literalA.potency = literalA.potency + literalB.potency;
					if (literalA.potency === 0)
						literalsA.splice(i, 1);
					//reseta o i para ficar aqui neste literalA[i]
					i--;
				}
			}
			
			answer.termB = 0;
			answer.signalB = '';
			answer.literalsTermB = [];
			answer.operation = termo.operation;

			let literalA = '';
			literalsA.forEach((a) => {
				if (a.potency != 0 && a.potency != 1)
					literalA += a.literal+'^'+a.potency;
				else if (a.potency === 1)
					literalA += a.literal;
				//se for igual a 0 não adiciona na resposta
			});

			let literalB = '';
			literalsB.forEach((b) => {
				if (b.potency != 0 && b.potency != 1)
					literalB += b.literal+'^'+b.potency;
				else if (a.potency === 1)
					literalB += b.literal;
				//se for igual a 0 não adiciona na resposta
			});

			answer.result = '('+answer.signalA + String(answer.termA) + literalA+') / '+'('+answer.signalB + String(answer.termB) + literalB+')';
		}
		else if (termo.operation === '/') {
			//faz a fatoração dos termos...
			const divA = getPrimesN(termo.termA);
			const divB = getPrimesN(termo.termB);
			console.log('termoPrimosA',divA);
			console.log('termoPrimosB',divB);
			
			//...agora pega os termos diferentes, os iguais aqui é como se fossem cortados...
			let vA = [], vB = [];
			divA.forEach((a) => {
				if (divB.indexOf(a) === -1)
					vA.push(a);
			});

			divB.forEach((b) => {
				if (divA.indexOf(b) === -1)
					vB.push(b);
			});
			
			//...agora reconstrói os termos numéricos.
			let num = 1;
			vA.forEach((a) => num *= a);
			answer.termA = Math.abs(num);

			num = 1;
			vB.forEach((b) => num *= b);
			answer.termB = Math.abs(num);
			
			let literalsA = termo.literalsTermA.slice(), literalsB = termo.literalsTermB.slice();
			for (let i = 0; i < literalsA.length; i++) {
				let literalA = literalsA[i];
				let literalB = literalsB.find((b) => b.literal === literalA.literal);
				//se achar um igual
				if (literalB) {
					//se potência do B é menor que A, então, B se acaba e A fica
					if (literalB.potency <= literalA.potency) {
						const index = literalsB.indexOf(literalB);
						literalsB.splice(index, 1);
						literalA.potency = literalA.potency - literalB.potency;
						if (literalA.potency === 0)
							literalsA.splice(i, 1);
						//reseta o i para ficar aqui neste literalA[i]
						i--;
					}
					else {
						//se não, A sai, e B fica
						const index = i;
						literalsA.splice(index, 1);
						literalB.potency = literalB.potency - literalA.potency;
						if (literalB.potency === 0)
							literalsB.splice(literalsB.indexOf(literalB), 1);
					}
				}
			}
			//faz jogo de sinal
			let sinal = '';
			if (termo.signalA === '-') {
				if (termo.signalB === '-')
					sinal = '+';
				else
					sinal = '-';
			}
			else if (termo.signalA === '+') {
				if (termo.signalB === '-')
					sinal = '-';
				else
					sinal = '+';
			}
			answer.signalA = sinal;
			answer.signalB = sinal;
			answer.literalsTermA = literalsA;
			answer.literalsTermB = literalsB;
			
			answer.operation = termo.operation;
			let literalA = '';
			literalsA.forEach((a) => {
				if (a.potency != 0 && a.potency != 1)
					literalA += a.literal+'^'+a.potency;
				else if (a.potency === 1)
					literalA += a.literal;
				//se for igual a 0 não adiciona na resposta
			});

			let literalB = '';
			literalsB.forEach((b) => {
				if (b.potency != 0 && b.potency != 1)
					literalB += b.literal+'^'+b.potency;
				else if (a.potency === 1)
					literalB += b.literal;
				//se for igual a 0 não adiciona na resposta
			});

			//verifica se existe termoB
			if (literalB.length || answer.termB !== 1)
				answer.result = '('+answer.signalA + String(answer.termA) + literalA+') / '+'('+answer.signalB + String(answer.termB) + literalB+')';
			else
				answer.result = '('+answer.signalA + String(answer.termA) + literalA+')';
			
			//verifica se dividiu ok
			if (answer.termB === 0) {
				console.error('GeradorExpressaoAlgebrica::ocorreu divisão por zero', termo);
			}
		}
		//verifica se pode somar os dois termos
		else if (termo.operation === '+' || termo.operation === '-') {
			let equalsTerms = 0;
			for (const literalA of termo.literalsTermA)
				for (const literalB of termo.literalsTermB)
					if (literalA.literal === literalB.literal) {
						if ((termo.operation === '+' || termo.operation === '-') && literalA.potency === literalB.potency) {
							equalsTerms += 1;
							break;
						}
					}
			//aqui soma termos com mesmo literal
			if (equalsTerms === termo.literalsTermA.length || equalsTerms === 0) {
				let numeric = 0;
				if ((termo.operation === '-')) {
					if (termo.signalA === '-') {
						if (termo.signalB === '-')
							numeric = -termo.termA - (-termo.termB);
						else
							numeric = -termo.termA - (+termo.termB);
					}
					else if (termo.signalA === '+') {
						if (termo.signalB === '-')
							numeric = termo.termA - (-termo.termB);
						else
							numeric = termo.termA - (+termo.termB);
					}
				}
				else {
					if (termo.signalA === '-') {
						if (termo.signalB === '-')
							numeric = -termo.termA + (-termo.termB);
						else
							numeric = -termo.termA + (+termo.termB);
					}
					else if (termo.signalA === '+') {
						if (termo.signalB === '-')
							numeric = termo.termA + (-termo.termB);
						else
							numeric = termo.termA + (+termo.termB);
					}
				}
				answer.termA = Math.abs(numeric);
				answer.termB = 0;
				answer.signalA = (numeric < 0)? '-': '+';
				answer.signalB = '';
				answer.operation = termo.operation;
				answer.literalTermA = termo.literalTermA.slice();
				answer.literalTermB = [];
				let literalA = '';
				termo.literalsTermA.forEach((a) => {
					if (a.potency != 0 && a.potency != 1)
						literalA += a.literal+'^'+a.potency;
					else if (a.potency === 1)
						literalA += a.literal;
				});
				answer.result = '('+answer.signalA + String(answer.termA) + literalA+')';
			}
			//se não são iguais, deixa como tava
			else {
				answer.termA = termo.termA;
				answer.termB = termo.termB;
				answer.signalA = termo.signalA;
				answer.signalB = termo.signalB;
				answer.literalTermA = termo.literalsTermA.slice();
				answer.literalTermB = termo.literalsTermB.slice();
				let literalA = '', literalB = '';
				termo.literalsTermA.forEach((a) => {
					if (a.potency != 0 && a.potency != 1)
						literalA += a.literal+'^'+a.potency;
					else if (a.potency === 1)
						literalA += a.literal;
				});
				termo.literalsTermB.forEach((b) => {
					if (b.potency != 0 && b.potency != 1)
						literalB += b.literal+'^'+b.potency;
					else if (b.potency === 1)
						literalB += b.literal;
				});
				answer.result = '('+termo.signalA + String(termo.termA) + literalA + termo.signalB + String(termo.termB) + literalB+')';
			}
		}

		return answer;
	}

	algebricExpressionSolver (termos) {

	}

	doExpression () {
		this.reset();
		let expressionStr = "";
		
		//em 30/01/2022
		//formatos dos monômios
		//n = numero
		//s = sinal + ou -
		//o = sinal / ou *
		//l = literal
		//m = outro literal
		//q = quadrado de um número
		//d = dobro do n
		//p = potência
		//r = raiz quadrada de q
		const formatosBase = [
			'(snl s ql)^n',
			'(snl^2 + dm^2)',
			'(snl^2 - dm^2)',
			'(sl + n)*(sl - n)',
			'(snl^2 s dl^2)',
			'(l^3 + m^3)',
			'(l + m)*(l^2 - lm + m^2)',
			'(l^3 - m^3)',
			'(l + m)*(l^2 + lm + m^2)',
			'(sl^2 + dnl + q)',
			'(sl^2 - dnl + q)',
		];

		const monomiosBase = [
			'(x^2 s q)^2', 
			'(x^2 s n)^p', 
			'(x s n)^p', 
			'(x^2 s q)',
			'(l^3 + m^3)',
			'(l^3 - m^3)',
			'(l^2 + m^2)',
			'(l^2 - m^2)',
		];

		const answerMonomioBase = {
			'(x^2 s q)^2':'(x s r)', 
			'(x^2 s n)^p':'(x^2 s n)^(p - 1)', 
			'(x s n)^p':'(x s n)^(p - 1)', 
			'(x^2 s q)':'(x - r)',
		}

		let chosenMonomios = {
			'(x^2 s q)^2':[],
			'(x^2 s n)^p':[],
			'(x s n)^p':[],
			'(x^2 + q)':[],
			'(x^2 - q)':[],
		};
		let formatos = this.optionsTable.qtdeMonomio === 1? monomiosBase: formatosBase;
		
		
		const sinais = ['+', '-'];
		const outros = ['/', '*'];
		const sinaisTodos = ['+','-','/','*'];
		const literais = ['a','b','c','d','e','f','x','y','z'];
		let literaisExp = [];

		if (this.optionsTable.maxLiteral < literais.length) {
			while (literaisExp.length !== this.optionsTable.maxLiteral) {
				let lit = literais[RandInt(0, literais.length - 1)];
				if (literaisExp.indexOf(lit) === -1)
					literaisExp.push(lit);
			}
			console.log(literaisExp);
		}
		else {
			console.warn('Usando máximo de literais');
			literaisExp  = literais;
		}
		for (let t = 0; t < 1; t++) {
			expressionStr = "";
			console.log(this.optionsTable.qtdeMonomio);
			let chosenFormas = [];
			for (let total = this.optionsTable.qtdeMonomio === 1? 1: this.optionsTable.qtdeMonomio - 1; total > -1; total--) {
				let exp = '';
				let forma = formatos[RandInt(0, formatos.length - 1)];
				let leuPotency = false, leuDobro = false;
				let lit = literaisExp[RandInt(0, literaisExp.length - 1)];
				let litM = literaisExp[RandInt(0, literaisExp.length - 1)];
				while (litM === lit)
					litM = literaisExp[RandInt(0, literaisExp.length - 1)];
				let num = RandInt(1, this.optionsTable.maxNumber);
				let formaParam = {};
				formaParam.n = ''+num;
				for (let i = 0; i < forma.length; i++) {
					switch (forma.charAt(i)) {
						case 'n':
							{
								let n = num;
								if (leuDobro) {
									leuDobro = false;
									n *= 2;
									formaParam.d = ''+n;
								}
								else
									formaParam.n = ''+n;
								exp += ''+n;
							}
							break;
						case 'q':
							{
								let n = num;
								n *= n;
								exp += ''+n;
								formaParam.q = ''+n;
							}
							break;
						case 's':
							{
								let s = sinais[RandInt(0, sinais.length - 1)];
								exp += s;
								formaParam.s = s;
							}
							break;
						case 'o':
							{
								let o = outros[RandInt(0, outros.length - 1)]
								exp += o;
								formaParam.o = o;
							}
							break;
						case '^':
							leuPotency = true;
							exp += forma.charAt(i);
							break;
						case 'l':
							{
								exp += lit;
								formaParam.l = lit;
							}
							break;
						case 'm':
							{
								exp += litM;
								formaParam.l = litM;
							}
							break;
							
						case 'd':
							leuDobro = true;
							break;
						case 'p':
							{
								let pot = RandInt(3, this.optionsTable.maxPotency);
								exp += ''+pot;
								formaParam.p = ''+pot;
							}
							break;
						default:
							exp += forma.charAt(i);
							break;
					}
				}
				if (this.optionsTable.qtdeMonomio === 1) {
					expressionStr += exp + ', ';
					formaParam.forma = forma;
					chosenFormas.push(formaParam);
				}
				else {
					let sinalMeio = sinaisTodos[RandInt(0, sinaisTodos.length - 1)];
					//excluido
					if (sinalMeio === '-')
						sinalMeio = '+';
					expressionStr += exp + (total !== 0? ' '+sinalMeio+' ':'');
				}
			}


			console.log('Gerador expressão algebrica = ' + expressionStr);
			if (expressionStr) {
				this.expressionStr = expressionStr;
				//this.answer = this.generateAnswer({chosenFormas, answerMonomioBase})
				return true;
			}
		}

		return false;
	}


	/*
	const monomiosBase = [
			'(x^2 s q)^2', 
			'(x^2 s n)^p', 
			'(x s n)^p', 
			'(x^2 s q)',
		];
	*/
	/**
	 * 
	 * @param {{s:string,p:string,forma:string,n:string,q:string,l:string,}} firstForma 
	 * @param {{s:string,p:string,forma:string,n:string,q:string,l:string,}} secondForma 
	 */
	x2sq2_x2sq2(firstForma, secondForma) {
		let line = '';
		let str = '';
		let push = false;
		if (firstForma.s === secondForma.s) {
			if (firstForma.q === secondForma.q && firstForma.l === secondForma.l) {
				str = '('+firstForma.l+'^2 '+firstForma.s+' '+firstForma.q+')';
				line += '('+firstForma.l+'^2 '+firstForma.s+' '+firstForma.q+'), ';
				line += '('+secondForma.l+'^2 '+secondForma.s+' '+secondForma.q+') ';
				firstForma.forma = '1';
				secondForma.forma = '1';
				push = true;
			}
			else {
				str = '('+firstForma.l+'^2 '+firstForma.s+' '+firstForma.q+')^2';
				line += '('+firstForma.l+'^2 '+firstForma.s+' '+firstForma.q+')^2'+', ';
				line += '('+secondForma.l+'^2 '+secondForma.s+' '+secondForma.q+')^2';
				firstForma.forma = '1';
				secondForma.forma = '(x^2 s q)^2';
				push = true;
			}
		}
		else {
			str = '('+firstForma.l+'^2 '+firstForma.s+' '+firstForma.q+')^2';
			line += '('+firstForma.l+'^2 '+firstForma.s+' '+firstForma.q+')^2'+', ';
			line += '('+secondForma.l+'^2 '+secondForma.s+' '+secondForma.q+')^2';
			firstForma.forma = '1';
			secondForma.forma = '(x^2 s q)^2';
			push = true;
		}

		return {push, line, answer:str};
	}

	/**
	 * 
	 * @param {{s:string,p:string,forma:string,n:string,q:string,l:string,}} firstForma 
	 * @param {{s:string,p:string,forma:string,n:string,q:string,l:string,}} secondForma 
	 */
	 x2snp_x2snp(firstForma, secondForma) {
			let line = '';
			let str = '';
			let push = false;
			if (firstForma.s === secondForma.s) {
				if (firstForma.n === secondForma.n && firstForma.l === secondForma.l) {
					let fp = parseInt(firstForma.p);
					let sp = parseInt(secondForma.p);
					let menorP = fp < sp? fp: sp;
					str = '('+firstForma.l+'^2 '+firstForma.s+' '+firstForma.n+')^'+menorP;
					line += '('+firstForma.l+'^2 '+firstForma.s+' '+firstForma.n+')^'+firstForma.p;
					line += '('+secondForma.l+'^2 '+secondForma.s+' '+secondForma.n+')^'+secondForma.p;
					fp-=menorP;
					if (fp <= 0) {
						firstForma.forma = '1';
						firstForma.p = '1';
					}
					else {
						firstForma.forma = '(x^2 s n)^p';
						firstForma.p = ''+fp;
					}

					sp-=menorP;
					if (sp <= 0) {
						secondForma.forma = '1';
						secondForma.p = '1';
					}
					else {
						secondForma.forma = '(x^2 s n)^p';
						secondForma.p = ''+sp;
					}
				}
				else {
					let fp = parseInt(firstForma.p);
					str = '('+firstForma.l+'^2 '+firstForma.s+' '+firstForma.n+')^'+fp;
					line += '('+firstForma.l+'^2 '+firstForma.s+' '+firstForma.n+')^'+firstForma.p;
					line += '('+secondForma.l+'^2 '+secondForma.s+' '+secondForma.n+')^'+secondForma.p;
					
					firstForma.forma = '1';
					firstForma.p = '1';
					secondForma.forma = '(x^2 s n)^p';
				}
			}
			else {
				let fp = parseInt(firstForma.p);
				str = '('+firstForma.l+'^2 '+firstForma.s+' '+firstForma.n+')^'+fp;
				line += '('+firstForma.l+'^2 '+firstForma.s+' '+firstForma.n+')^'+firstForma.p;
				line += '('+secondForma.l+'^2 '+secondForma.s+' '+secondForma.n+')^'+secondForma.p;
				
				firstForma.forma = '1';
				firstForma.p = '1';
				secondForma.forma = '(x^2 s n)^p';
			}
			return {push:true, line, answer:str};
	 }

	 /**
	 * 
	 * @param {{s:string,p:string,forma:string,n:string,q:string,l:string,}} firstForma 
	 * @param {{s:string,p:string,forma:string,n:string,q:string,l:string,}} secondForma 
	 */
	x2sq_x2sq(firstForma, secondForma) {
		let line = '';
		let str = '';
		let push = false;
		if (firstForma.s === secondForma.s) {
			if (firstForma.q === secondForma.q && firstForma.l === secondForma.l) {
				str = '('+firstForma.l+' '+firstForma.s+' '+firstForma.n+')';
			}
			else {

			}
		}
		else {
			
		}
	}



	 /**
	 * 
	 * @param {{s:string,p:string,forma:string,n:string,q:string,l:string,}} firstForma 
	 * @param {{s:string,p:string,forma:string,n:string,q:string,l:string,}} secondForma 
	 */
		x2snp_x2snp(firstForma, secondForma) {
			let line = '';
			let str = '';
			let push = false;
			if (firstForma.s === secondForma.s) {
				if (firstForma.n === secondForma.n && firstForma.l === secondForma.l) {

				}
				else {

				}
			}
			else {
				
			}
	 }
	/**
	 * 
	 * @param {{chosenFormas:[], answerMonomioBase:{}}} param 
	 */
	generateAnswer(param) {
		let answer = [];
		let firstForma = param.chosenFormas[0];
		let secondForma = param.chosenFormas[1];
		for (let i = true; i; ) {
			let push = false;
			let str = '';
			let line = '';
			switch (firstForma.forma) {
				case '(x^2 s q)^2': 
					{
						switch (secondForma.forma) {
							case '(x^2 s q)^2': 
								
								break;
							case '(x^2 s n)^p':
								{
									
								}
								break;

							case '(x s n)^p':
								{
									if (firstForma.s === secondForma.s && firstForma.n === secondForma.n && firstForma.l === secondForma.l) {
										let p = parseInt(firstForma.p);
										p--;
										if (p > 0)
											firstForma.p = ''+p;
										else {
											firstForma.forma = '1';
											firstForma.p = '1';
										}

										p = parseInt(secondForma.p);
										p--;
										if (p > 0)
											secondForma.p = ''+p;
										else {
											secondForma.forma = '1';
											secondForma.p = '1';
										}
										str = '('+firstForma.l+' '+firstForma.s+' '+n+')';
										line += '('+firstForma.l+' '+firstForma.s+' '+firstForma.n+') ';
										line += '('+secondForma.l+' '+secondForma.s+' '+secondForma.n+') ';
										firstForma.forma = '(x s n)^p';
										secondForma.forma = '(x s n)^p';
										push = true;
										break;
									}
									else if (firstForma.forma !== '1') {
										let n = ''+firstForma.n;
										str = '('+firstForma.l+' '+firstForma.s+' '+n+')';
										line += '('+firstForma.l+' '+firstForma.s+' '+firstForma.n+') ';
										line += '('+secondForma.l+' '+secondForma.s+' '+secondForma.q+') ';
										firstForma.forma = '(x s n)^p';
										let p = parseInt(firstForma.p);
										p--;
										if (p > 0)
											firstForma.p = ''+p;
										else {
											firstForma.forma = '1';
											firstForma.p = '1';
										}
									}
									else if (secondForma.forma !== '1') {
										n += ''+secondForma.n;
										str = '('+firstForma.l+' '+firstForma.s+' '+n+')';
										line += '('+firstForma.l+' '+firstForma.s+' '+firstForma.n+') ';
										line += '('+secondForma.l+' '+secondForma.s+' '+secondForma.q+') ';
										secondForma.forma = '(x^2 s n)^p';
										let p = parseInt(secondForma.p);
										p--;
										if (p > 0)
											secondForma.p = ''+p;
										else {
											secondForma.forma = '1';
											secondForma.p = '1';
										}
									}
									else {
										i = false;
										break;
									}
								}
								break;
							case '(x^2 + q)':
								{
								}
								break;
							case '(x^2 - q)':
								{
									
								}
								break;
						}
					}
					break;
				case '(x^2 s q)':
					{
						switch (secondForma.forma) {
							case '(x^2 s q)^2':
								{

								}
								break;
							case '(x^2 s q)':
								{
									if (firstForma.s === secondForma.s) {
										if (firstForma.q === secondForma.q && firstForma.l === secondForma.l) {
											str = '('+firstForma.l+' '+firstForma.s+' '+firstForma.n+')';
											line += '('+firstForma.l+'^2 '+firstForma.s+' '+firstForma.q+') ';
											line += '('+secondForma.l+'^2 '+secondForma.s+' '+secondForma.q+') ';
											firstForma.forma = '(x s n)';
											firstForma.p = '1';
											secondForma.forma = '(x s n)';
											secondForma.p = '1';
											push = true;
											break;
										}
										else {
											str = '('+firstForma.l+' '+firstForma.s+' '+firstForma.n+')';
											line += '('+firstForma.l+' '+firstForma.s+' '+firstForma.n+') ';
											line += '('+secondForma.l+'^2 '+secondForma.s+' '+secondForma.q+') ';
											firstForma.forma = '(x s n)';
											secondForma.forma = '(x^2 s q)';
											secondForma.p = 1;
											push = true;
											break;
										}
									}
									else {
										if (firstForma.s === '+') {
											str = '('+firstForma.l+' + '+firstForma.n+')';
										}
										else {
											str = '('+firstForma.l+' - '+firstForma.n+')';
										}
										line += str+', ';
										line += '('+secondForma.l+'^2 '+secondForma.s+' '+firstForma.q+')';
										firstForma.forma = '(x s n)';
										secondForma.forma = '(x^2 s q)';
										push = true;
										break;
									}
								}
								break;
						}
					}
					break;
				case '(x s n)':
					{
						switch (secondForma.forma) {
							case '(x^2 s q)^2':
								{

								}
								break;
							case '(x^2 s q)':
								{
									if (firstForma.s === secondForma.s) {
										if (firstForma.q === secondForma.q && firstForma.l === secondForma.l) {
											str = '('+firstForma.l+' '+firstForma.s+' '+firstForma.n+')';
											line += '('+firstForma.l+' '+firstForma.s+' '+firstForma.n+') ';
											line += '('+secondForma.l+'^2 '+secondForma.s+' '+secondForma.q+') ';
											firstForma.forma = '1';
											firstForma.p = '1';
											secondForma.forma = '(x s n)';
											secondForma.p = '1';
											push = true;
											break;
										}
										else {
											str = '('+firstForma.l+' '+firstForma.s+' '+firstForma.n+')';
											line += '('+firstForma.l+' '+firstForma.s+' '+firstForma.n+') ';
											line += '('+secondForma.l+'^2 '+secondForma.s+' '+secondForma.q+') ';
											firstForma.forma = '(x s n)';
											secondForma.forma = '(x^2 s q)';
											secondForma.p = 1;
											push = true;
											break;
										}
									}
									else {
										if (firstForma.s === '+') {
											str = '('+firstForma.l+' + '+firstForma.n+')';
										}
										else {
											str = '('+firstForma.l+' - '+firstForma.n+')';
										}
										line += str+', ';
										line += '('+secondForma.l+'^2 '+secondForma.s+' '+firstForma.q+')';
										firstForma.forma = '(x s n)';
										secondForma.forma = '(x^2 s q)';
										push = true;
										break;
									}
								}
								break;
						}
					}
					break;
				case '1':
					{

					}
					break;
				case '(x^2 s n)^p':
					{

					}
					break;
				case '(x s n)^p':
					{
						
					}
					break;
				
			}

			if (push) {
				answer.push({line, currentAnswer:str});
			}
		}
	}
}

function showExpressaoAlgebricaResp( index, strExpr, answer ) {
	alert('Não tem como verificar resposta');
}

function gerarExpressaoAlgebrica ( form, targetId ) {
	console.log("Aqui estamos gerarExpressaoAlgebrica");
	let mult = [];
	let div = [];
	let sub = [];
	let sum = [];
	let digitsTermA = 2;
	let qtdeExpressao = 10;
	let qtdeOper = {};
	let qtdeMonomio = 5;
	let maxPotency = 2;
	let maxNumber = 5;
	let maxLiteral = 2;

	for (let el of form.elements) {
		if (el.id.indexOf('QtdeMonomio') > -1) {
			qtdeMonomio = parseInt(el.value);
		}
		else if (el.id.indexOf('MaxPotency') > -1) {
			maxPotency = parseInt(el.value);
		}
		else if (el.id.indexOf('MaxNumber') > -1) {
			maxNumber = parseInt(el.value);
		}
		else if (el.id.indexOf('MaxLiteral') > -1) {
			maxLiteral = parseInt(el.value);
		}
		else if (el.id.indexOf('qtdeExpressao') > -1) {
			qtdeExpressao = parseInt(el.value);
		}
	}

	console.log(qtdeMonomio, maxNumber, maxPotency, maxLiteral);
	if (qtdeExpressao <= 0) {
		alert("Escolha quantos termos usar nas expressões");
		return;
	}

	let gerador = new GeradorExpressaoAlgebrica({maxPotency, maxNumber, maxLiteral, qtdeMonomio});
	let strHtml = "";
	for (let i = 0; i < qtdeExpressao; i++) {
		if (!gerador.doExpression()) {
			console.log('Falha ao gerar expressão Algebrica i='+i, gerador);
			continue;
		}
		strHtml += 'Expressão Algebrica-'+(i+1)+': '
		+'<strong>'
		+gerador.expressionStr
		+'</strong>'
		+'<br />'
		+'<button type="button" onclick="showExpressaoAlgebricaResp('+i+',`'+gerador.expressionStr+'`,'+gerador.answer+');">'
		+'Ver resposta Expressão Algebrica-'+(i+1)
		+'</button><br /></p>';
	}
	
	
	document.getElementById(targetId).innerHTML = strHtml;
}


//////////////////////////////////////////////////////////////////////
//gera expressões dentro dos números inteiros
//derivado de GeradorExpressaoAlgebrica
class GeradorExpressaoPotencia {
	/**
	 * 
	 * @param {{mult:[], div:[], sub:[], sum:[], qtdeOper: {}, digitsTermA: number}} optionsTable 
	 */
	constructor (optionsTable) {
		this.optionsTable = optionsTable;
		this.digitsTermA = optionsTable.digitsTermA;
		console.log("Potencia", optionsTable);
		
		this.answer = -1;
		//tentativas para fazer a expressão
		this.trying = 100;
		this.expressionStr = "";
		this.qtdeLinhas = 0;
		this.termos = [];
	}

	reset (  ) {
		this.answer = 0;
		this.expressionStr = "";
		this.qtdeLinhas = 0;
		this.termos = [];
	}


	doExpression () {
		this.reset();
		let oper = [];
		let expressionStr = "";
		let qtdeOper = {}, qtdeAux = {};
		if (this.optionsTable.qtdeOper.mult)
			qtdeOper["mult"] = this.optionsTable.qtdeOper.mult;
		if (this.optionsTable.qtdeOper.div)
			qtdeOper["div"] = this.optionsTable.qtdeOper.div;
		if (this.optionsTable.qtdeOper.sub)
			qtdeOper["sub"] = this.optionsTable.qtdeOper.sub;
		if (this.optionsTable.qtdeOper.sum)
			qtdeOper["sum"] = this.optionsTable.qtdeOper.sum;
		
		let totalTerms = 0;
		for (let o in qtdeOper) {
			totalTerms += qtdeOper[o];
			oper.push(o);
		}
		
		if (!totalTerms) {
			alert("GeradorExpressaoPontecia.doExpression::qdteOper é vazio");
			return;
		}

		const sinais = ['+','-'];
		const literais = ['', 'a', 'b', 'c'];
		const maxPotency = 5;
		console.log('TentativaS ');
		for (let t = 0; t < this.trying; t++) {
			this.reset();
			expressionStr = "";
			let lastSinal = '+';
			this.termos = [];
			for (let o in qtdeOper) {
				qtdeAux[o] = qtdeOper[o];
			}
			let answers = [];
			for (let i = 0, total = totalTerms; i < this.trying * 2; i++) {
				total = 0;
				for (let o in qtdeAux)
					total += qtdeAux[o];
				if (total === 0) {
					t = this.trying;
					break;
				}
				
				const operations = ['sum','sub','mult','div'];
				let chosen = RandInt(0, oper.length - 1);
				let sinal = "";
				
				let options = [];
				switch (oper[chosen]) {
					case 'mult':
						{
							if (qtdeAux["mult"] > 0) {
								qtdeAux["mult"]--;
								this.qtdeLinhas++;
								sinal = "*";
								options = this.optionsTable.mult;
							}
						}
						break;
					case 'div':
						{
							if (qtdeAux["div"] > 0) {
								qtdeAux["div"]--;
								this.qtdeLinhas++;
								sinal = "/";
								options = this.optionsTable.div;
							}
						}
						break;
					case 'sub':
						{
							if (qtdeAux["sub"] > 0) {
								this.qtdeLinhas += 2;
								sinal = "-";
								options = this.optionsTable.sub;
								qtdeAux["sub"]--;
							}
						}
						break;
					case 'sum':
						{
							if (qtdeAux["sum"] > 0) {
								this.qtdeLinhas += 2;
								sinal = "+";
								options = this.optionsTable.sum;
								qtdeAux["sum"]--;
							}
						}
						break;
				}

				if (sinal === "") {
					//console.log("sinal = "+sinal);
					//console.log(qtdeAux);
					console.log(oper[chosen]);
					continue;
				}

				let termA = RandInt(1, this.maxTermA);
				
				let termB = RandInt(1, this.maxTermB);
				if (termA == 'NaN' || termB === 'NaN'){
					alert("GeradorExpressaoPotencia.doExpression::Erro, termos inválidos, termA="+termA+', termB='+termB);
					return false;
				}

				if (oper[chosen] === "div" && Math.fmod(termA, termB) > 0) {
					termA = RandInt(1, 9) * termB;
				}
				
				const sinalA = sinais[RandInt(0,sinais.length-1)];
				const sinalB = sinais[RandInt(0,sinais.length-1)];
				let start = '';
				let end = '';
				
				//matém a base iguais quando é divisão entre termos com potência
				if (sinal === '/') {
					if (termA < termB)
						termB = termA;
					else
						termA  =termB;
				}

				const beforeTermA = termA;
				const beforeTermB = termB;


				if (sinal === '*' || sinal === '/') {
					 start = '(';
					if (sinalA === '-')
						termA = '('+sinalA+termA+')';
					else
						termA = sinalA+termA;
					termB = '('+sinalB+termB+')';
					end =')';
				}
				else if (sinal === '+' || sinal === '-') {
					termA = '('+sinalA+termA+')';
					termB = '('+sinalB+termB+')';
				}

				const sinalChosen = sinais[RandInt(0,sinais.length - 1)];
				
				let potencyA = RandInt(0, maxPotency) * (RandInt(0, 2) == 0? -1: 1);
				let potencyB = RandInt(0, maxPotency) * (RandInt(0, 2) == 0? -1: 1);
				console.log("TRY = "+lastSinal+termA+"^"+potencyA+sinalChosen+sinalB+termB+"^"+potencyB);
				
				this.termos.push({
						termA:{term:beforeTermA, signal:sinalA, potency:potencyA}, 
						termB:{term:beforeTermB, signal:sinalB, potency:potencyB},
						operation:{signal:sinal},
						lastSignal:lastSinal
					});
					expressionStr += lastSinal+'(Math.pow('+termA+','+potencyA+')) '+
														sinal+'(Math.pow('+termB+','+potencyB+'))'+' ';
				lastSinal = sinalChosen;

				if (total > 1) {
					this.qtdeLinhas++;
				}
			}

			this.answer = undefined;
			try {
				this.answer = eval(expressionStr);
				console.log('['+t+'] = '+expressionStr);
			} catch(e) {
				return false;
			}
			if (this.answer !== undefined) {
				this.expressionStr = '';
				let str = '';
				for (const t of this.termos) {
					
					if (t.operation.signal === '/') {
						str += '\\left( \\frac{'+t.termA.signal+t.termA.term;
						if (t.termA.potency !== 1)
							str += '^'+t.termA.potency;
						str += '}{';
						str += t.termB.signal+t.termB.term;
						if (t.termB.potency !== 1)
							str += '^'+t.termB.potency;
						str += '}\\right)';
					}
					else {
						str += '('+t.termA.signal+t.termA.term;
						if (t.termA.potency !== 1)
							str += '^'+t.termA.potency;
						
						str+=')'+t.operation.signal+'(';

						str += t.termB.signal+t.termB.term;
						if (t.termB.potency !== 1)
							str += '^'+t.termB.potency;
						str += ')';
					}
				}

				this.expressionStr = str;
				return true;
			}
		}

		return false;
	}
}

function showExpressaoPotenciaResp( index, strExpr, answer ) {
	alert("Expressão Potencia-"+index+': '+strExpr+', resposta = '+answer);
}

function gerarExpressaoPotencia ( form, targetId ) {
	console.log("Aqui estamos gerarExpressaoPotencia");
	let mult = [];
	let div = [];
	let sub = [];
	let sum = [];
	let maxTermA = 2, maxTermB = 2;
	let maxPotency = 4;
	let qtdeExpressao = 10;
	let qtdeOper = {};

	for (let el of form.elements) {
		{
			if (el.id.indexOf('multOptions') > -1)
				qtdeOper['mult'] = (parseInt(el.value));
			else if (el.id.indexOf('divOptions') > -1)
				qtdeOper['div'] = (parseInt(el.value));
			else if (el.id.indexOf('subOptions') > -1)
				qtdeOper['sub'] = (parseInt(el.value));
			else if (el.id.indexOf('sumOptions') > -1)
				qtdeOper['sum'] = (parseInt(el.value));
		}
		if (el.id.indexOf('maxTermA') > -1) {
			maxTermA = parseInt(el.value);
			maxTermB = parseInt(el.value);
		}
		else if (el.id.indexOf('maxPotency') > -1) {
			maxPotency = parseInt(el.value);
		}
		else if (el.id.indexOf('qtdeExpressao') > -1) {
			qtdeExpressao = parseInt(el.value);
		}
	}

	let c = 0;
	for (let e in qtdeOper) {
		if (qtdeOper[e] > 0) {
			c++;
		}
	}
	if (!c) {
		console.error('qtdeOper = ',qtdeOper);
		alert("quqantidade de operações é inválido, zerado!");
		return;
	}

	if (!maxTermA || !maxTermB || !maxPotency) {
		alert("maxTermA = "+maxTermA+" maxTermB = "+maxTermB+" maxPotency = "+maxPotency);
		return;
	}

	if (qtdeExpressao <= 0) {
		alert("Escolha quantos termos usar nas expressões");
		return;
	}

	let gerador = new GeradorExpressaoPotencia({mult,div, sub, sum, maxTermA, maxTermB, maxPotency, qtdeOper});
	let strHtml = "";
	for (let i = 0; i < qtdeExpressao; ) {
		if (!gerador.doExpression()) {
			console.log('Falha ao gerar expressão com Potência i='+i, gerador);
			continue;
		}
		strHtml += '<p><strong>NOTA: Para a expressão, deixe '+(gerador.qtdeLinhas - 1)+' linhas no caderno abaixo da expressão</strong><br />';
		strHtml += 'Expressão com Potência-'+(i+1)+': '
		+'<math>'
		+gerador.expressionStr
		+'</math>'
		+'<br />'
		+'<button type="button" onclick="showExpressaoAlgebricaResp('+i+',`'+gerador.expressionStr+'`,'+gerador.answer+');">'
		+'Ver resposta Expressão Algebrica-'+(i+1)
		+'</button><br /></p>';
		i++;
	}
	
	
	document.getElementById(targetId).innerHTML = strHtml;
}


//////////////////////////////////////////////////////////////////////
//gera tabelas para funções do primeiro grau
class GeradorFuncaoAfim {
	/**
	 * 
	 * @param {{mult:[], div:[], sub:[], sum:[], qtdeOper: {}, digitsTermA: number}} optionsTable 
	 */
	constructor (optionsTable) {
		this.optionsTable = optionsTable;
		this.digitsTermA = optionsTable.digitsTermA;
		console.log("Potencia", optionsTable);
		
		this.answer = -1;
		//tentativas para fazer a expressão
		this.trying = 100;
		this.expressionStr = "";
		this.qtdeLinhas = 0;
		this.termos = [];
	}

	reset (  ) {
		this.answer = 0;
		this.expressionStr = "";
		this.qtdeLinhas = 0;
		this.termos = [];
	}


	doExpression () {
		this.reset();
		
		//formato de função
		//a = termo a
		//b = termo b
		//s = sinal - ou +
		const formatos = [
			'ax s b',
			'sax + b',
			'sax - b',
			'+ax',
			'-ax',
		];

		const sinais = ['+','-'];
		const literais = ['', 'a', 'b', 'c'];
		const maxPotency = 5;
		console.log('TentativaS ');
		for (let t = 0; t < this.trying; t++) {
			this.reset();
			expressionStr = "";
			let lastSinal = '+';
			this.termos = [];
			for (let o in qtdeOper) {
				qtdeAux[o] = qtdeOper[o];
			}
			let answers = [];
			for (let i = 0, total = totalTerms; i < this.trying * 2; i++) {
				total = 0;
				for (let o in qtdeAux)
					total += qtdeAux[o];
				if (total === 0) {
					t = this.trying;
					break;
				}

				if (sinal === "") {
					//console.log("sinal = "+sinal);
					//console.log(qtdeAux);
					console.log(oper[chosen]);
					continue;
				}

				let termA = RandInt(1, this.optionsTable.maxTermA);
				let termB = RandInt(1, this.optionsTable.maxTermB);
				const sinalA = sinais[RandInt(0,sinais.length-1)];
				const sinalB = sinais[RandInt(0,sinais.length-1)];
				let start = '';
				let end = '';
				
			}
			///

			this.answer = undefined;
			try {
				this.answer = eval(expressionStr);
				console.log('['+t+'] = '+expressionStr);
			} catch(e) {
				return false;
			}
			if (this.answer !== undefined) {
				this.expressionStr = '';
				let str = '';
				for (const t of this.termos) {
					
					if (t.operation.signal === '/') {
						str += '\\left( \\frac{'+t.termA.signal+t.termA.term;
						if (t.termA.potency !== 1)
							str += '^'+t.termA.potency;
						str += '}{';
						str += t.termB.signal+t.termB.term;
						if (t.termB.potency !== 1)
							str += '^'+t.termB.potency;
						str += '}\\right)';
					}
					else {
						str += '('+t.termA.signal+t.termA.term;
						if (t.termA.potency !== 1)
							str += '^'+t.termA.potency;
						
						str+=')'+t.operation.signal+'(';

						str += t.termB.signal+t.termB.term;
						if (t.termB.potency !== 1)
							str += '^'+t.termB.potency;
						str += ')';
					}
				}

				this.expressionStr = str;
				return true;
			}
		}

		return false;
	}
}

function showExpressaoPotenciaResp( index, strExpr, answer ) {
	alert("Expressão Potencia-"+index+': '+strExpr+', resposta = '+answer);
}

function gerarExpressaoPotencia ( form, targetId ) {
	console.log("Aqui estamos gerarExpressaoPotencia");
	let mult = [];
	let div = [];
	let sub = [];
	let sum = [];
	let maxTermA = 2, maxTermB = 2;
	let maxPotency = 4;
	let qtdeExpressao = 10;
	let qtdeOper = {};

	for (let el of form.elements) {
		{
			if (el.id.indexOf('multOptions') > -1)
				qtdeOper['mult'] = (parseInt(el.value));
			else if (el.id.indexOf('divOptions') > -1)
				qtdeOper['div'] = (parseInt(el.value));
			else if (el.id.indexOf('subOptions') > -1)
				qtdeOper['sub'] = (parseInt(el.value));
			else if (el.id.indexOf('sumOptions') > -1)
				qtdeOper['sum'] = (parseInt(el.value));
		}
		if (el.id.indexOf('maxTermA') > -1) {
			maxTermA = parseInt(el.value);
			maxTermB = parseInt(el.value);
		}
		else if (el.id.indexOf('maxPotency') > -1) {
			maxPotency = parseInt(el.value);
		}
		else if (el.id.indexOf('qtdeExpressao') > -1) {
			qtdeExpressao = parseInt(el.value);
		}
	}

	let c = 0;
	for (let e in qtdeOper) {
		if (qtdeOper[e] > 0) {
			c++;
		}
	}
	if (!c) {
		console.error('qtdeOper = ',qtdeOper);
		alert("quqantidade de operações é inválido, zerado!");
		return;
	}

	if (!maxTermA || !maxTermB || !maxPotency) {
		alert("maxTermA = "+maxTermA+" maxTermB = "+maxTermB+" maxPotency = "+maxPotency);
		return;
	}

	if (qtdeExpressao <= 0) {
		alert("Escolha quantos termos usar nas expressões");
		return;
	}

	let gerador = new GeradorExpressaoPotencia({mult,div, sub, sum, maxTermA, maxTermB, maxPotency, qtdeOper});
	let strHtml = "";
	for (let i = 0; i < qtdeExpressao; ) {
		if (!gerador.doExpression()) {
			console.log('Falha ao gerar expressão com Potência i='+i, gerador);
			continue;
		}
		strHtml += '<p><strong>NOTA: Para a expressão, deixe '+(gerador.qtdeLinhas - 1)+' linhas no caderno abaixo da expressão</strong><br />';
		strHtml += 'Expressão com Potência-'+(i+1)+': '
		+'<math>'
		+gerador.expressionStr
		+'</math>'
		+'<br />'
		+'<button type="button" onclick="showExpressaoAlgebricaResp('+i+',`'+gerador.expressionStr+'`,'+gerador.answer+');">'
		+'Ver resposta Expressão Algebrica-'+(i+1)
		+'</button><br /></p>';
		i++;
	}
	
	
	document.getElementById(targetId).innerHTML = strHtml;
}



/////////////////////////////////////////////////////////////////////////


function showExprALLResp ( index, strExpr, answer ) {
	alert("Expressão ALL-"+index+': '+strExpr+', resposta = '+answer);
}

function gerarExpressaoALL (form, targetId) {
	console.log("Aqui estamos gerarExpressaoALL");
	let mult = [];
	let div = [];
	let sub = [];
	let sum = [];
	let min = 2;
	let max = 10;
	let digitsTermA = 2;
	let qtdeExpressao = 10;
	let qtdeOper = {};
	let qtdeTerms = {R:2,Z:2,FAT:2};

	for (let el of form.elements) {
		if (el.id.indexOf('OptionsALLMin') > -1) {
			min = parseInt(el.value);
		}
		else if (el.id.indexOf('OptionsALLMax') > -1) {
			max = parseInt(el.value);
		}
		else if (el.id.indexOf('DigitsTermA') > -1) {
			digitsTermA = parseInt(el.value);
		}
		else if (el.id.indexOf('qtdeExpressao') > -1) {
			qtdeExpressao = parseInt(el.value);
		}
		else if (el.id.indexOf('qtdeTermsALLZ') > -1) {
			qtdeTerms.Z = parseInt(el.value);
		}
		else if (el.id.indexOf('qtdeTermsALLR') > -1) {
			qtdeTerms.R = parseInt(el.value);
		}
		else if (el.id.indexOf('qtdeTermsALLFAT') > -1) {
			qtdeTerms.FAT = parseInt(el.value);
		}
	}

	if (min > max) {
		let a = min;
		min = max;
		max = a;
	}

	for (let i = 1; i < 10; i++) {
		mult.push(i);
		div.push(i);
		sum.push(i);
		sub.push(i);
	}

	qtdeOper.mult = (qtdeTerms.Z || qtdeTerms.R) + 2;
	qtdeOper.div = (qtdeTerms.Z || qtdeTerms.R) + 2;
	qtdeOper.sum = (qtdeTerms.Z || qtdeTerms.R) + 2;
	qtdeOper.sub = (qtdeTerms.Z || qtdeTerms.R) + 2;


	if (qtdeExpressao <= 0) {
		alert("Escolha quantos termos usar nas expressões");
		return;
	}

	let geradorZ = new GeradorExpressaoZ({mult,div, sub, sum, digitsTermA, qtdeOper, qtdeTerms:qtdeTerms.Z + 2, min, max});
	let geradorR = new GeradorExpressaoR({mult,div, sub, sum, digitsTerm:digitsTermA, qtdeOper, qtdeTerms:qtdeTerms.R + 2, min, max});
	let geradorFAT = new GeradorExpressaoFatorial({mult,div, sub, sum, digitsTermA, qtdeOper, qtdeTerms:qtdeTerms.FAT + 2, min, max});
	let strHtml = "";
	for (let i = 0; i < qtdeExpressao; i++) {
		if (!geradorZ.doExpression()) {
			console.log('Falha ao gerar expressão Fatorial i='+i, gerador);
			continue;
		}

		if (!geradorR.doExpression()) {
			console.log('Falha ao gerar expressão Fatorial i='+i, gerador);
			continue;
		}

		if (!geradorFAT.doExpression()) {
			console.log('Falha ao gerar expressão Fatorial i='+i, gerador);
			continue;
		}

		let expressionStr = '', answer = 0;
		let used = new Map();
		let total = {Z:qtdeTerms.Z, R:qtdeTerms.R, FAT:qtdeTerms.FAT};
		let lastSinal = "";
		let lastZR = {Z:0,R:0};
		const sinal = ['+', '-'];
		for (let j = total.Z+total.R+total.FAT; j > 0; ) {

			switch (RandInt(0,2)) {
				case 0:
					if (total.Z > 0)
						for (let z of geradorZ.termos) {
							if (RandInt(0,1) == 0 && !used.get(z)) {
								console.log('conta Z '+j, z);
								used.set(z, true);
								if (lastSinal === '/') {
									let text = z.text;
									if (text[text.length - 1] !== ')')
										text = z.text.slice(0, z.text.length-1);
									expressionStr += '('+text+')';
									answer += (lastZR.Z / z.answer);
									lastSinal = '';
								}
								else {
									const index = RandInt(0,1);
									lastSinal = ['/', ''][index];
									if (lastSinal === '/' && (total.Z + total.R) > 1) {
										expressionStr += ' +('+z.text+') / ';
										lastZR.Z = z.answer;
									}
									else {
										expressionStr += z.text;
										answer += z.answer;
									}
								}
								j--;
								total.Z--;
								if (total.Z === 0)
									break;
							}
						}
					break;
				case 1:
					if (total.R > 0)
						for (let r of geradorR.termos) {
							if (RandInt(0,1) == 0 && !used.get(r)) {
								console.log('conta R '+j, r);
								used.set(r, true);
								if (lastSinal === '/') {
									let text = r.text;
									if (text[text.length - 1] !== ')')
										text = r.text.slice(0, r.text.length-1);
									expressionStr += '('+text+')';
									answer += (lastZR.R / r.answer);
									lastSinal = '';
								}
								else {
									const index = RandInt(0,1);
									lastSinal = ['/', ''][index];
									if (lastSinal === '/' && (total.Z + total.R) > 1) {
										expressionStr += ' +('+r.text+') / ';
										lastZR.R = r.answer;
									}
									else {
										expressionStr += r.text;
										answer += r.answer;
									}
								}
								j--;
								total.R--;
								if (total.R === 0)
									break;
							}
						}
					break;
				case 2:
					if (total.FAT > 0)
						for (let f of geradorFAT.termos) {
							if (RandInt(0,1) == 0 && !used.get(f)) {
								console.log('conta FAT '+j, f);
								used.set(f, true);
								expressionStr += f.text;
								answer += f.answer;
								j--;
								total.FAT--;
								if (total.FAT === 0)
									break;
							}
						}
					break;
			}
		}
		strHtml += 'Expressão ALL-'+(i+1)+': '
		+'<strong>'
		+expressionStr
		+'</strong>'
		+'<br />'
		+'<button type="button" onclick="showExprALLResp('+i+',`'+expressionStr+'`,'+answer+');">'
		+'Ver resposta Expressão ALL-'+(i+1)
		+'</button><br /></p>';
	}
	
	document.getElementById(targetId).innerHTML = strHtml;
}


function geradorTabuadaDivisao (form, tabuadaDiv) {
	let optionsTable = [];
	let qtdeContas = 0;
	let strHtml = "";

	for (let e of form.elements) {
		if (e.checked && e.id.indexOf("tabuadaNum") > -1) {
			optionsTable.push(parseInt(e.value));
		}
		else if (e.id === 'tabuadaDivQtde') {
			qtdeContas = parseInt(e.value);
		}
	}

	if (qtdeContas <= 0) {
		alert("Digite a quantidade de divisão para gerar");
		return;
	}

	if (!optionsTable.length) {
		alert("Escolha os números da tabuada da divisão para gerar (de 2 ao 9)");
		return;
	}

	for (let i = 0; i < qtdeContas; i++) {
		let conta = generateTerms(optionsTable, 'div');
		strHtml += '<label>'
		+'Conta N-'+i+'</label>: '
		+'<strong><span>'
		+conta.termA + ' ' + conta.sinal + ' ' + conta.termB + ' = '
		+'</span></strong>'
		+'<button type="button" onclick="alert(`'
		+conta.termA + ' ' + conta.sinal + ' ' + conta.termB + ' = '+conta.result+'`);">'
		+'Ver reposta</button>'
		+'<br />';
	}

	document.getElementById(tabuadaDiv).innerHTML = strHtml;
}



function geradorDivisaoN (form, tabuadaDiv) {
	let optionsTable = {maxDividendo:100000, minDividendo: 1000,
		minDivisor: 100,
		maxDivisor: 10000,
	};
	let qtdeContas = 0;
	let strHtml = "";

	for (let e of form.elements) {
		if (e.id.indexOf("divisaoMinDividendo") > -1) {
			optionsTable.minDividendo = parseInt(e.value);
		}
		else if (e.id.indexOf("divisaoMaxDividendo") > -1) {
			optionsTable.maxDividendo = parseInt(e.value);
		}
		else if (e.id.indexOf("divisaoMinDivisor") > -1) {
			optionsTable.minDivisor = parseInt(e.value);
		}
		else if (e.id.indexOf("divisaoMaxDivisor") > -1) {
			optionsTable.maxDivisor = parseInt(e.value);
		}
		else if (e.id === 'divisaoQtde') {
			qtdeContas = parseInt(e.value);
		}
	}

	if (optionsTable.maxDividendo < optionsTable.minDividendo) {
		const v = optionsTable.minDividendo;
		optionsTable.minDividendo = optionsTable.maxDividendo;
		optionsTable.maxDividendo = v;
	}

	if (optionsTable.maxDivisor < optionsTable.minDivisor) {
		const v = optionsTable.minDivisor;
		optionsTable.minDivisor = optionsTable.maxDivisor
		optionsTable.maxDivisor = v;
	}

	if (qtdeContas <= 0) {
		alert("Digite a quantidade de divisão para gerar");
		return;
	}

	for (let i = 0; i < qtdeContas; i++) {
		const divisor = Math.floor(Math.random() * optionsTable.maxDivisor) + optionsTable.minDivisor;
		const dividendo = Math.floor(Math.random() * optionsTable.maxDividendo) + optionsTable.minDividendo;
		const resultado = dividendo / divisor;

		strHtml += '<label>'
		+'Conta N-'+i+'</label>: '
		+'<strong><span>'
		+dividendo + ' / ' + divisor + ' = '
		+'</span></strong>'
		+'<button type="button" onclick="alert(`'
		+dividendo + ' / ' + divisor + ' = '+resultado+'`);">'
		+'Ver reposta</button>'
		+'<br />';
	}

	document.getElementById(tabuadaDiv).innerHTML = strHtml;
}


//////////////////////////////////////////////////////////////////////
//gera expressões dentro dos números reais
class GeradorExpressaoFatoracao {
	/**
	 * 
	 * @param {{mult:[], div:[], sub:[], sum:[], qtdeOper: {}, digitsTerm: number, maxValue, qtdeFator}} optionsTable 
	 */
	constructor (optionsTable) {
		this.optionsTable = optionsTable;
		this.digitsTerm = optionsTable.digitsTerm;
		if (!this.optionsTable.digitsTerm)
			alert("GeradorExpressaoR::Quantidade de digitos termo é inválida");
		this.answer = -1;
		//tentativas para fazer a expressão
		this.trying = 10000;
		this.expressionStr = "";
		this.qtdeLinhas = 0;
		this.termos = [];
	}

	reset (  ) {
		this.answer = 0;
		this.expressionStr = "";
		this.qtdeLinhas = 0;
		this.termos = [];
	}

	doExpression () {
		this.reset();
		
		
		if (!oper.length === 0) {
			alert("GeradorExpressaoN.doExpression::oper é vazio");
			return;
		}

		let expressionStr = "";
		
		if (!totalTerms) {
			alert("GeradorExpressaoR.doExpression::qdteOper é vazio");
			return;
		}

		const sinais = ['+','-'];
		let primos = getPrimesN(this.optionsTable.maxValue);

		for (let t = 0; t < this.trying; t++) {
			expressionStr = "";
			let qtdeLinhas = 0;
			let answer = "";
			this.termos = [];
			let lastSinal = '+';
			for (let o in qtdeOper) {
				qtdeAux[o] = qtdeOper[o];
			}
			for (let i = 0, total = totalTerms; ; ) {
				total = 0;
				for (let o in qtdeAux)
					total += qtdeAux[o];
				if (total === 0) {
					t = this.trying;
					break;
				}
				
				let termA = primos[RandInt(0, primos.length - 1)];
				let fatores = [termA];
				let str = ""+termA+"*";
				qtdeLinhas = RandInt(3, this.optionsTable.qtdeFator);
				for (let k = 1; k < qtdeLinhas; k++) {
					let a = primos[RandInt(0, primos.length - 1)];
					termA *= a;
					fatores.push(a);
					str += a + (k < qtdeLinhas - 1?"*":"");
				}
				
				answer = str;
				expressionStr = "" + termA;
				break;
			}
			console.log(expressionStr);
			this.answer = eval(expressionStr);
			if (this.answer != 0) {
				this.expressionStr = expressionStr;
				this.qtdeLinhas = qtdeLinhas;
				this.answer = answer;
				return true;
			}
		}

		return false;
	}
}

function showExprFatoracaoResp ( index, strExpr, answer ) {
	alert("Expressão fratoracao-"+index+': '+strExpr+', resposta = '+answer);
}

//BUG: ainda não usa o mix e max para gerar o números
function gerarExpressaoFatoracao ( form, targetId ) {
	console.log("Aqui estamos gerarExpressaoFatorcao");

	let qtdeExpressao = 10;
	let qtdeFator = 5;
	let maxValue = 100;

	for (let el of form.elements) {
		if (el.id.indexOf('qtdeFator') > -1) {
			qtdeExpressao = parseInt(el.value);
		}
		else if (el.id.indexOf('maxValue') > -1) {
			maxValue = parseInt(el.value);
		}
		else if (el.id.indexOf('qtdeExpressao') > -1) {
			qtdeExpressao = parseInt(el.value);
		}
	}

	let gerador = new GeradorExpressaoFatoracao({qtdeFator, maxValue});
	let strHtml = "";
	for (let i = 0; i < qtdeExpressao; i++) {
		if (!gerador.doExpression()) {
			console.log('Falha ao gerar expressão Fatoracao i='+i, gerador);
			continue;
		}
		strHtml += '<p><strong>NOTA: Para a expressão, deixe '+(gerador.qtdeLinhas - 1)+' linhas no caderno abaixo da expressão</strong><br />';
		strHtml += 'Expressão R-'+(i+1)+': '
		+'<strong>'
		+gerador.expressionStr
		+'</strong>'
		+'<br />'
		+'<button type="button" onclick="showExprFatoracaoResp('+i+',`'+gerador.expressionStr+'`,'+gerador.answer+');">'
		+'Ver resposta Expressão Fatoracao-'+(i+1)
		+'</button><br /></p>';
	}
	
	
	document.getElementById(targetId).innerHTML = strHtml;
}

//jumpTo('bodyTag');


class DivisaoExplicada {
	static NOVO_PASSO = () => 1;
	static SHOW_PASSO = () => 2;
	/**
	 * 
	 * @param {{termA, termB, qtdeLines}} config 
	 */
	constructor ( config ) {
		this.passos = 0;
		this.state = 0;
		this.passoState = 0;
		this.currentDividendo = 0;
		this.currentRespDigito = 0;
		this.config = config;
		this.matrix = [];
		for (let i = 0; i < config.qtdeLines; i++)
			this.matrix.push(Array(512).join(' '));

		this.lines = {
			comments: {
				resposta:"",
				divisor:"",
				desceuUm: "",
				pegaNums: "", //comentário dizendo: 123'4 / 13 = pega 123 porque é maior que 13
			},
			resetComments: (keep) =>{
				for (let e in this.lines.comments)
					if (this.lines.comments[e] !== this.lines.comments[keep])
						this.lines.comments[e] = "";
			},

			applyComments: (matrix, lines, comment, lineName, x) => {
				matrix = [];
				for (let i = 0; i < lines; i++)
					this.matrix.push(Array(512).join(' '));
				//for (let i = 0; i < )
			}
		};
	}

	/**
	 * 1234 / 13 passo 0
	 * 1'234 / 13 passo 1, pega o 1 número, ele é maior que o 13? não
	 * 12'34 / 13 passo 2, então pega o 12, ele é maior que o 13? não
	 * 123'4 / 13 passo 3, então pega o 123, ele é maior que o 13? sim, então vamos dividir primeiro 123 por 13
	 * 123'4 / 13, agora, em baixo do 13, vamos colocar um número que multiplique o 13 e o resultado tem que próximo ou igual ao 123, mas não pode passar
	 * 123'4 / 13
	 *          0 //começamos com 0, 0 vezes 13 dá 0, tá longe de 123
	 * 123'4 / 13
	 *          1 //vamos tentar com 1, 1 vezes 13 dá 13, tá longe de 123
	 * 123'4 / 13
	 *          2 //vamos tentar com 2, 2 vezes 13 dá 26, tá longe de 123
	 * 123'4 / 13
	 *          3 //vamos tentar com 3, 3 vezes 13 dá 39, tá longe de 123
	 * 123'4 / 13
	 *          4 //vamos tentar com 4, 4 vezes 13 dá 52, tá longe de 123
	 * 123'4 / 13
	 *          5 //vamos tentar com 5, 5 vezes 13 dá 65, tá longe de 123
	 * 123'4 / 13
	 *          6 //vamos tentar com 6, 4 vezes 13 dá 78, tá longe de 123
	 * 123'4 / 13
	 *          7 //vamos tentar com 7, 4 vezes 13 dá 91, tá longe de 123
	 * 123'4 / 13
	 *          8 //vamos tentar com 8, 4 vezes 13 dá 104, tá ficando perto de 123
	 * 123'4 / 13
	 *          9 //vamos tentar com 9, 4 vezes 13 dá 117, tá mais perto ainda de 123
	 * 123'4 / 13
	 *         10 //vamos tentar com 10, 4 vezes 13 dá 130, passou de 123
	 * 123'4 / 13
	 *          9 //se com 10 passou, e com 9 não, nosso número procurado é o 9
	 * 123'4 / 13
	 *          9 //multiplicamos 9 vezes 13, dá 117
	 * 123'4 / 13
	 *-117      9
	 * //agora colocamos o 117 subtraindo o 123, então, 123 menos 117 dá 6
	 * 123'4 / 13
	 *-117      9 
	 *   6 //resultado da subtração de cima
	 * 123'4 / 13
	 *-117      9 
	 *   6 //agora, precisamos baixar um número lá de cima e juntar com o 6 aqui
	 * 123'4 / 13
	 *-117      9 
	 *   64 //virou 64
	 * 123'4 / 13
	 *-117      9 
	 *   64 //agora divida 64 por 13, 
	 * 
	 * 123'4 / 13
	 *-117      9 
	 *   64 //ou melhor, ache um número que multiplicado por 13 dê 64 ou chegue perto, mas que não passe de 64
	 * 
	 * 123'4 / 13
	 *-117      90 //começamos com 0, 0 vezes 13 dá 0, tá muito longe de 64
	 *   64
	 * 
	 * 123'4 / 13
	 *-117      91 //agora tenta com 1, 1 vezes 13 dá 13, tá muito longe de 64
	 *   64
	 * 
	 * 123'4 / 13
	 *-117      92 //agora tenta com 2, 2 vezes 13 dá 26, tá muito longe de 64
	 *   64
	 * 
	 * 123'4 / 13
	 *-117      93 //agora tenta com 3, 3 vezes 13 dá 39, tá muito longe de 64
	 *   64
	 * 
	 * 123'4 / 13
	 *-117      94 //agora tenta com 4, 4 vezes 13 dá 52, tá ficando perto de 64
	 *   64
	 * 
	 * 123'4 / 13
	 *-117      95 //agora tenta com 5, 5 vezes 13 dá 65, opa, passou de 64
	 *   64
	 * 
	 * 123'4 / 13
	 *-117      94 //se com 5 passou, então, o número procurado é o 4, 4 vezes 13 dá 52
	 *   64
	 * 
	 * 123'4 / 13
	 *-117      94
	 *   64
	 *  -52 //64 menos 52 dá 12
	 * 123'4 / 13
	 *-117      94
	 *   64
	 *  -52
	 *   12 //como não tem mais número para baixar, poderiamos terminar a divisão aqui
	 * 
	 * E o resultado seria:
	 * 1234 dividio por 13 dá 94 e sobra 12
	 */

	proximoPasso (  ) {
		this.state = DivisaoExplicada.NOVO_PASSO;
	}

	nextExplain (  ) {
		switch (this.passoState) {
			case 1: //passo comum

		}
	}

	update (  ) {
		switch (this.state) {
			case DivisaoExplicada.NOVO_PASSO:
				{
					this.passos++;
					let result = Math.floor(this.currentDividendo / this.config.termB) * this.currentRespDigito;
					let maxResult = this.currentDividendo - this.config.termB;
					let exactResult = this.currentDividendo;
					if (result == exactResult) {
						this.lines.comments.resposta = "//com "+this.currentRespDigito+" deu exatamente "+exactResult;
						this.lines.resetComments("resposta");
					}
					else if (result >= maxResult) {
						this.lines.comments.divisor = "//com "+this.currentRespDigito+" tá ficando perto de "+this.currentDividendo;
						this.lines.resetComments("divisor");
					}
				}
				break;
		} 
	}
}
