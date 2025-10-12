


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
		const resultado = String(Math.floor(dividendo / divisor)) + ' com resto ' + String(dividendo % divisor);

		strHtml += '<label>'
		+'Conta N-'+i+'</label>: '
		+'<strong><span>'
		+dividendo + ' / ' + divisor + ' = '
		+'</span></strong>'
		+'<button type="button" onclick="alert(`'
		+dividendo + ' / ' + divisor + ' deu resultado '+resultado+'`);">'
		+'Ver reposta</button>'
		+'<br />';
	}

	document.getElementById(tabuadaDiv).innerHTML = strHtml;
}
