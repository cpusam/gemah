//sorteia um número inteiro de >=min até <=max
/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns inteiro de min até max, incluindo max
 */
function RandInt ( min=-1, max=-1 )
{
	min = Math.floor(min);
	max = Math.floor(max);
	if (min > max)
	{
		let aux = max;
		max = min;
		min = aux;
	}

	return Math.floor(min + ((max - min) + 1) * Math.random());
}

function once (fn, context) {
	let result;
	return function () {
		if (fn) {
			result = fn.apply(context || this, arguments);
			fn = null;
		}
		return result;
	}
}

function shuffle(array) {
  var currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


//as configurações
const BASE_EXP = 10;//número máximo da expressão
const SIZE_EXP = 5;//tamanho da expressão

function getDivisoresN (num)
{
	let div = [];
	
	for (let i = 1; i <= num; i++)
		if (num % i === 0)
			div.push(i);
	
	return div;
}

//retorna os primos de 2 até num
function getPrimesN (num) {
	let primes = [];
	for (let i = 1; i <= num; i++) {
		if (num % i === 0) {
			let ret = getDivisoresN(i);
			if (ret.length === 2) {
				primes.push(i);
			}
		}
	}
	return primes;
}

function frac(num) {
	return (num - Math.floor(num));
}

/**
	 * 
	 * @param {HTMLElement} element 
	 */
function shake ( element ) {
	if (!element)
		return false;
	
	if (element.classList.contains('shakeOnce'))
		element.classList.remove("shakeOnce");
	
	element.classList.add("shakeOnce");
	element.addEventListener('animationiteration', () => {
		element.classList.remove("shakeOnce");
	});

	return true;
}

const randomObjectKey = (obj) => {
	var keys = Object.keys(obj);
	return keys[ keys.length * Math.random() << 0];
};

const appendChildHTML = (target, str) => {
	
}


//////////////////////////////////////////////////////////////////////
class Gerador {
	/**
	 * 
	 * @param {{mult:[], div:[], sub:[], sum:[], qtdeOper: {}, digitsTermA: number}} optionsTable 
	 */
	constructor (optionsTable) {
		this.optionsTable = optionsTable;
		this.digitsTermA = optionsTable.digitsTermA;
		if (!this.optionsTable.digitsTermA)
			alert("Gerador::Quantidade de digitos termA é inválida");
		this.answer = -1;
		//tentativas para fazer a expressão
		this.trying = 100;
		this.expressionStr = "";
		this.qtdeLinhas = 0;
		this.termos = [];
		this.config = optionsTable;
	}

	getExpression() {
		return this.expressionStr;
	}

	reset (  ) {
		this.expressionStr = "";
		this.qtdeLinhas = 0;
		this.termos = [];
	}


	doExpression () {
		this.reset();

		return false;
	}
}

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

function marcarCheckbox ( formId, checked, termB ) {
	let form = document.getElementById(formId);
	for (let el of form.elements) {
		if (el.type === "checkbox" && el.id.indexOf(termB) > -1)
			el.checked = checked;
	}
}