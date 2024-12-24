
///////////////////////////////////////////////
//gera exprões dentro dos números inteiros
class GeradorExpressaoZ {
	/**
	 * 
	 * @param {{mult:[], div:[], sub:[], sum:[], qtdeOper: {}, digitsTermA: number}} optionsTable 
	 */
	constructor (optionsTable) {
		this.optionsTable = optionsTable;
		this.digitsTermA = optionsTable.digitsTermA;
    this.digitsTermADiv = optionsTable.digitsTermADiv;
		if (!this.optionsTable.digitsTermA)
			alert("GeradorExpressaoZ::Quantidade de digitos termA é inválida");
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
			alert("GeradorExpressaoZ.doExpression::oper é vazio");
			return;
		}

		let expressionStr = "";
		let qtdeOper = {}, qtdeAux = {};
		
		
		let totalTerms = 0;
		
		let t = 0;
    while (1) {
      for (t = 0; t < this.trying; t++) {
        expressionStr = "";
        if (this.optionsTable.qtdeOper.mult)
          qtdeOper["mult"] = RandInt(0, 2);
        if (this.optionsTable.qtdeOper.div)
          qtdeOper["div"] = RandInt(0, 2);
        if (this.optionsTable.qtdeOper.sub)
          qtdeOper["sub"] = RandInt(1, 3);
        if (this.optionsTable.qtdeOper.sum)
          qtdeOper["sum"] = RandInt(1, 3);

        totalTerms = 0;
        for (let o in qtdeOper) {
          totalTerms += qtdeOper[o];
        }
        
        if (!totalTerms) {
          continue;
        }

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
          if (oper[chosen] === 'div') {
            parseInt(''+makeMultTerm(0,9, this.digitsTermADiv, false));
          }
          let termB = parseInt(options[RandInt(0, options.length - 1)]);
          if (termA == 'NaN' || termB === 'NaN'){
            alert("GeradorExpressaoZ.doExpression::Erro, termos inválidos, termA="+termA+', termB='+termB);
            return false;
          }
          /**
          if (oper[chosen] === "sub" && termB > termA) {
            let aux = termB;
            termB = termA;
            termA = aux;
          }
          */

          if (oper[chosen] === "div" && Math.fmod(termA, termB) > 0) {
            termA = RandInt(0, 9) * termB;
          }

          expressionStr += ' '+termA+' '+sinal+' '+termB;
          if (total > 1) {
            expressionStr += RandInt(0, 1)?' + ': ' - ';
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
    }

		return false;
	}
}

function showExprNResp ( index, strExpr, answer ) {
	alert("Expressão N-"+index+': '+strExpr+', resposta = '+answer);
}

function gerarExpressaoZ ( form, targetId ) {
	console.log("Aqui estamos gerarExpressaoZ");
	let mult = [];
	let div = [];
	let sub = [];
	let sum = [];
  for (let i = 1; i < 10; i++) {
    mult.push(i);
    sum.push(i);
    sub.push(i);
    div.push(i);
  }

	let digitsTermA = 1;
  let digitsTermADiv = 2;
	let qtdeExpressao = 10;
	let qtdeOper = {};
  let terms = 0;
  for (let el of form.elements) {
    if (el.type === 'checkbox' && el.checked) {
      terms = 1;
      if (el.id.indexOf('chosenMult') > -1) {
        qtdeOper["mult"] = RandInt(0, 2);
      }
      else if (el.id.indexOf('chosenDiv') > -1) {
        qtdeOper["div"] = RandInt(0, 2);
      }
      else if (el.id.indexOf('chosenSub') > -1) {
        qtdeOper["sub"] = RandInt(1, 3);
      }
      else if (el.id.indexOf('chosenSum') > -1) {
        qtdeOper["sum"] = RandInt(1, 3);
      }
    }
    else if (el.id.indexOf('qtdeExpressao') > -1) {
      qtdeExpressao = parseInt(el.value);
    }
  }

  if (qtdeExpressao <= 0) {
		alert("Escolha quantos termos usar nas expressões");
		return;
	}

  if (!terms) {
    alert("Escolha uma opção de operação.");
    return;
  }

	let gerador = new GeradorExpressaoZ({mult,div, sub, sum, digitsTermA, digitsTermADiv, qtdeOper});
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