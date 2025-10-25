
///////////////////////////////////////////////
//gera exprões dentro dos números inteiros
class GeradorExpressaoZ {
  /**
	 * 
	 * @param {{makeTestePEMDAS:boolean,withParenteses:boolean, maxPotency:number, minNumber:number, maxNumber:number, maxLiteral:number, qtdeMonomio:number, oper:object, difficult:string}} optionsTable 
	 */
	constructor (optionsTable) {
		this.optionsTable = optionsTable;
    this.optionsTable.minNumber = 0;
    this.optionsTable.maxNumber = 20;
    this.optionsTable.qtdeMonomio = 7;
		this.expressionStr = "";
    this.makeTestePEMDAS = optionsTable.makeTestePEMDAS || false;
    this.testePEMDAS = {};
    this.difficult = optionsTable.difficult || "medium";
		console.log(optionsTable.maxPotency, optionsTable.maxNumber, optionsTable.maxLiteral, optionsTable.qtdeMonomio);
	}

	reset (  ) {
		this.expressionStr = "";
	}

	async doExpression () {
		this.reset();
		let expressionStr = "";
		
		//em 01/02/2023 às 15:56
    //a = um número qualquer escolhido
    //b = um número qualquer escolhido que vem depois de um 'a' ou 'A' escolhido
    //c = um número entre 1 e 5
		//s = sinal + ou -
    //n = sinal negativo
		//A = quadrado de um número a
    //B = quadrado de um número b
    //D = 2 vezes 'a' vezes 'b'
		//p = potência de 2
		//r = raiz quadrada de q
    //i = iniciar tudo para a expressão seguinte, tipo resetar valores para usar nos próximos tokenbs do formato
    //Q = dividendo tabuada de dididir
    //q = divisor de 'q' tabuada de dividir 
    //t = numero de 0 até 5
    //Y = dividendo usando até no máximo valor 30
    //x = divisor usando até no máximo valor de 1 até 5
    //NOTA: entre cada formato é escolhido um sinal s
    //NOTA: a potencia tem que ficar por último fora da expressão pro js executar corretamente (defeito)
    //NOTA: 'a' é maior que 'b'
    //NOTA: em 25/10/2025 agora os formatos precisam iniciar com um 's' ou '+' ou '-' para ter o sinal de Link!
		const formatosBase = {
      sum:[],
      sub:[],
      mult:[],
      div:[],
      exp:[],
      parenA:[],
      parenB:[],
      parenC:[],
      parenD:[],
      expComParen:[],
      expNegComParen:[],
    };
    
    if (this.optionsTable.oper["expComParen"]) {
      let cel = 0;
      this.optionsTable.oper["paren"] = true;
      for (let e in this.optionsTable.oper)
        cel += (e == "sum" || e === "sub" || e === "div" || e === "exp" || e === "expComParen" || e === "expNegComParen" || e === "paren");
      if (cel <= 2) {
        alert("Escolha mais de dois assuntos! Escolhido "+cel);
        throw "Escolhido menos de 2 assuntos";
      }
    }
      
    if (this.difficult === "hard" || this.difficult === "medium") {
      //da sum
      formatosBase.sum.push('+a +b');
      formatosBase.sum.push('+a sb');

      if (this.optionsTable.oper["sub"]) {
        formatosBase.sub.push('sa -b');
        formatosBase.sub.push('sb');
        formatosBase.sub.push('sa');
      }
      if (this.optionsTable.oper["mult"]) {
        formatosBase.mult.push('sa * (sb)');
        formatosBase.mult.push('sa * sb');
      }
      if (this.optionsTable.oper["div"]) {
        formatosBase.div.push('sQ / (sq)');
        formatosBase.div.push('sQ / (-q)');
      }
      //NOTA:
      //tem um bug no interpretadorC que faz com que tenha de colocar as expressões expoente com parenteses
      //Talvez fosse melhor ter feito em ANTLR4 com C++ mesmo.
      //expoente
      if (this.optionsTable.oper["exp"]) {
        formatosBase.exp.push('s(c^(2))');
        formatosBase.exp.push('s(c^(t)) + (-c)^(t)');
        formatosBase.exp.push('s(-c)^(2)');
      }

      //expoente com parenteses
      if (this.optionsTable.oper["expComParen"]) {
        formatosBase.expComParen.push('s((sc)^(t))');
        formatosBase.expComParen.push('s((sc)^(t))*(sa)');
        formatosBase.expComParen.push('s((sc)^(t))*(sa)*(sQ/(sq))');
      }

      if (this.optionsTable.oper["expNegComParen"]) {
        formatosBase.expNegComParen.push('s((sc)^(-t))');
        formatosBase.expNegComParen.push('s((sc)^(-t))*(sa)');
        formatosBase.expNegComParen.push('s((sc)^(-t))*(sa)*(sQ/(sq))');
      }

      //parênteses
      //fazer dividido por tópicos foi muito bom pra adicionar novas opções
      if (this.optionsTable.oper["paren"]) {
        //opção default é apenas soma
        formatosBase.parenA.push('s(sa sb)');
        //subtração ou aleatórios
        if (this.optionsTable.oper['sub']) {
          formatosBase.parenB.push('s(sa sb)');
          formatosBase.parenB.push('s(sa sb sc)');
        }
        //opção de div
        if (this.optionsTable.oper['div'] && this.optionsTable.oper['mult']) {
          formatosBase.parenC.push('s(sQ / (sq) sQ / (sq)) * (sc)');
          formatosBase.parenC.push('s(sc) * (sQ / (sq) sQ / (sq))');
        }
        else if (this.optionsTable.oper['mult']) {
          formatosBase.parenD.push('s(sa sb sc) * (sa)');
          formatosBase.parenD.push('s(sa sb s(sa sb)) * (sc)');
        } 
        else if (this.optionsTable.oper['div']) {
          formatosBase.parenD.push('s(sQ / (sq) + sQ / (sq))');
        }
      }
    }
    else {
      if (this.optionsTable.oper["sum"]) {
        //da sum
        formatosBase.sum.push('+t');
      }

      if (this.optionsTable.oper["sub"]) {
        formatosBase.sub.push('-t');
      }
      if (this.optionsTable.oper["mult"]) {
        formatosBase.mult.push('st * (st)');
        formatosBase.sum.push('st');
      }
      if (this.optionsTable.oper["div"]) {
        formatosBase.div.push('sY / (sx)');
        formatosBase.div.push('sY / (-x)');
      }
      //NOTA:
      //tem um bug no interpretadorC que faz com que tenha de colocar as expressões expoente com parenteses
      //Talvez fosse melhor ter feito em ANTLR4 com C++ mesmo.
      //expoente
      if (this.optionsTable.oper["exp"]) {
        formatosBase.exp.push('s(+t^(+2))');
        formatosBase.exp.push('s(-t)^(+2)');
      }

      //expoente com parenteses
      if (this.optionsTable.oper["expComParen"]) {
        formatosBase.expComParen.push('s((st)^(+t))');
      }

      if (this.optionsTable.oper["expNegComParen"]) {
        formatosBase.expNegComParen.push('s((st)^(-t))');
      }

      //parênteses
      //fazer dividido por tópicos foi muito bom pra adicionar novas opções
      if (this.optionsTable.oper["paren"]) {
        //opção default é apenas soma
        formatosBase.parenA.push('s(st +t)');
        //subtração ou aleatórios
        if (this.optionsTable.oper['sub']) {
          formatosBase.parenB.push('s(st -t)');
        }
        //opção de div
        if (this.optionsTable.oper['div'] && this.optionsTable.oper['mult']) {
          formatosBase.parenC.push('s(sQ / (sq))');
        }
        else if (this.optionsTable.oper['mult']) {
          formatosBase.parenD.push('s(st*t)');
          formatosBase.parenD.push('s(st*(st))');
        } 
        else if (this.optionsTable.oper['div']) {
          formatosBase.parenD.push('s(sQ / (sq))');
        }
      }
    }

    const formatoSemParenteses = this.optionsTable.formatosSemParenteses || [
      'a + b',
		];

		let formatos = [];
    for (let el in formatosBase)
      if (formatosBase[el].length)
        formatos.push(el);
    
    if (formatos.length === 0) {
      alert("formatos nulo!");
      return false;
    }
    console.log("formatos = '"+formatos);

    const sinal = ['-', '+'];
    const sinalLink = ['-','+'];		
		let valid = 0;

    console.log(this.optionsTable.qtdeMonomio);
    let maior = -1;
    let maiorResp = {};
		for (let ts = 0; ; ) {
			let expUser = '';//expressão para o usuário
      let expJS = '';//expressão para o javascript calcular
			let vars = [];
      let varsCount = 0;

			let chosenFormas = [];
      const maxMonomio = this.optionsTable.qtdeMonomio;// RandInt(2, this.optionsTable.qtdeMonomio);
      let chosenAssuntos = [];
			for (let total = 0, lastMonomio = maxMonomio - 1; total < maxMonomio; ) {
        varsCount++;
        //escolhe a forma
        let member = formatos[RandInt(0, formatos.length - 1)];
				let forma = formatosBase[member][RandInt(0, formatosBase[member].length - 1)];
        if (chosenAssuntos.indexOf(member) === -1)
          chosenAssuntos.push(member);
        if (chosenFormas.indexOf(forma) === -1)
          chosenFormas.push(forma);

        let last = '';
        let opLink = sinalLink[RandInt(0, sinalLink.length - 1)];
        if (formatos.length === 1 && formatos[0] === "sum") {
          opLink = "+";
        }
        
        console.log('formato escolhido = '+forma);
        let a = 0;
        let A = 0;
        let b = 0;
        let B = 0;
        let s = '';         

        let strForma = "";
        let varsForma = [];
        let notLink = false;
				{
          let tokens = [];
          a = RandInt(this.optionsTable.minNumber, this.optionsTable.maxNumber);
          A = a * a;
          let ok = false;
          /*
          while (!ok) {
            b = RandInt(this.optionsTable.minNumber, this.optionsTable.maxNumber);
            B = b * b;
            ok = b <= a;
          }
          */

          let c = RandInt(1, 5);
          let t = RandInt(0, 5);

          s = sinal[RandInt(0, sinal.length - 1)];
          
          //formato das expressões binárias
          //t = termo de variável aleatória
          //l = valor lógico true ou false (V ou F para o usuário)
          //o = operador binário pode ser && ou || (E ou OU para o user)
          //i = inverso lógico (negação)
          let Q = 0, q = 0;
          let Y = 0, x = 0;
          let lastSetted = "";
          const setVar = (name, v)=>{
            return String(name)+varsCount+"="+v+" ";
          }
          const getVarName = (name)=>{
            return String(name)+varsCount;
          }

          for (let j = 0; forma.charAt(j); j++) {
            let varName = "";
            let value = 0;
            switch (forma.charAt(j)) {
              case 'a':
                a = RandInt(this.optionsTable.minNumber, this.optionsTable.maxNumber);
                A = a * a;
                lastSetted = "a";
                varName = getVarName("a");
                varsForma.push(setVar("a", s+a));
                value = a;
                break;
              case 'b':
                ok = false;
                while (!ok) {
                  b = RandInt(this.optionsTable.minNumber, this.optionsTable.maxNumber);
                  B = b * b;
                  ok = b <= a;
                }
                lastSetted = "b";
                varName = getVarName("b");
                varsForma.push(setVar("b", s+b));
                value = b;
                break;

              case 'c': {
                c = RandInt(1, 5);
                lastSetted = "c";
                varName = getVarName("c");
                varsForma.push(setVar("c", s+c));
                value = c;
              }
              break;

              case 't': {
                t = RandInt(0, 5);
                lastSetted = "t";
                varName = getVarName("t");
                varsForma.push(setVar("t", s+t));
                value = t;
              }
              break;

              
              case 'A':
                lastSetted = "A";
                varName = getVarName("A");
                varsForma.push(setVar("A", s+A));
                value = A;
                break;
              case 'B':
                lastSetted = "B";
                varName = getVarName("B");
                varsForma.push(setVar("B", s+B));
                value = B;
                break;
              case'D':
                {
                  let D = 2 * a * b;
                  lastSetted = "D";
                  varName = getVarName("D");
                  varsForma.push(setVar("D", s+D));
                  value = D;
                }
                break;
              case 's':
                {
                  s = sinal[RandInt(0, sinal.length - 1)];
                  if (formatos.length === 1 && formatos[0] === "sum") {
                    s = "+";
                  }
                }
                break;
              case 'Q':{
                  let a = RandInt(1,9);
                  let b = RandInt(1,9);
                  Q = a * b;
                  if (RandInt(0,1))
                    q = a;
                  else
                    q = b;
                  B = Q;
                  varName = getVarName("Q");
                  varsForma.push(setVar("Q", s+Q));
                  value = Q;
                }
                break;
              case 'q':{
                  varName = getVarName("q");
                  varsForma.push(setVar("q", s+q));
                  value = q;
                }
                break;
              case 'Y':{
                  let a = RandInt(1,6);
                  let b = RandInt(1,6);
                  Y = a * b;
                  if (RandInt(0,1))
                    x = a;
                  else
                    x = b;
                  varName = getVarName("Y");
                  varsForma.push(setVar("Y", s+Y));
                  value = Y;
                }
                break;
              case 'x':{
                  varName = getVarName("x");
                  varsForma.push(setVar("x", s+x));
                  value = x;
                }
                break;
              default:
                break;
            }

            //copia as formas pra string
            if (forma.charAt(j) != 's') {
              if (varName.length)
                strForma += value;
              else 
                strForma += forma.charAt(j);
            }
            else {
              strForma += s;
              notLink = true;
            }
          }
				}

        expJS += strForma;
        vars = [...vars, ...varsForma];

        if (total >= lastMonomio) {
          break;
        }

        total++;

        console.log("[expr]='"+expJS+"'");
        console.log("["+forma+"]=['"+varsForma+"']")
      }

			console.log('Gerador expressão Numérica notável = \'' + expJS + "'");
      console.log("chosenAssuntos "+chosenAssuntos);
      
      let varsArgs = "";
      vars.forEach((element, index) => {
        varsArgs += (index > 0?",":"") + element;
      });
      const resp = await runAST(expJS, varsArgs);
      console.log("resp = "+resp);
			if (resp !== undefined) {
        ts++;
				
        let answer = parseFloat(resp.result);

				if (answer - Math.floor(answer) === 0) {
          if (chosenAssuntos.length >= maior || maior === -1) {
            maior = chosenAssuntos.length;

            this.expressionStr = resp.userExpr;
            this.expressionStrJS = resp.exprJS;
            this.answer = answer;
            if (this.makeTestePEMDAS)
              this.testePEMDAS = await createTestePEMDAS(expJS, varsArgs);
            if (ts > 10)
              return true;
          }
        }
			}
		}

		return false;
	}
}

let clicksData = {
};
function onClickAnswer(answerEl, idEl, correctIndex, indexEl) {
  if (clicksData[idEl].currentClick >= clicksData[idEl].total) {
    return;
  }

  //apaga todas as outras classes porque só tem que ficar uma só.
  if ((answerEl.classList.contains('correctState') || answerEl.classList.contains('wrongState')) === false) {
    answerEl.classList.remove(...answerEl.classList);
  }

  if (correctIndex === clicksData[idEl].currentClick) {
    if (clicksData[idEl].elementosClicados.indexOf(answerEl) === -1) {
      clicksData[idEl].elementosClicados.push(answerEl);
      clicksData[idEl].currentClick++;
      clicksData[idEl].resultado.totalClicks++;
      clicksData[idEl].resultado.clicksCertos++;
    }

    if (!answerEl.classList.contains('correctState'))
      answerEl.classList.add('correctState');
    if (answerEl.classList.contains('wrongState'))
      answerEl.classList.remove('wrongState');
    
  }
  else {
    if (clicksData[idEl].elementosClicados.indexOf(answerEl) === -1) {
      clicksData[idEl].resultado.totalClicks++;
      clicksData[idEl].resultado.clicksErrados++;
    }
    if (answerEl.classList.contains('correctState'))
      answerEl.classList.remove('correctState');
    if (!answerEl.classList.contains('wrongState'))
      answerEl.classList.add('wrongState');
  }

  let resultado = document.getElementById("expressaoResultado"+indexEl);
  if (!resultado)
    return;
  resultado.textContent = 'Acertos: '+(clicksData[idEl].resultado.clicksCertos)
                          +' Erros: '+(clicksData[idEl].resultado.clicksErrados);
}

function showExprNResp ( index, strExpr, answer ) {
	alert("Expressão N-"+index+': '+strExpr+', resposta = '+answer);
}

async function gerarExpressaoZ ( form, targetId ) {
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
  let oper = {};

	let digitsTermA = 1;
  let digitsTermADiv = 2;
	let qtdeExpressao = 10;
	let qtdeOper = {};
  let terms = 0;
  let makeTestePEMDAS = false;
  let difficult = "medium";
  for (let el of form.elements) {
    if (el.type === 'checkbox' && el.checked) {
      terms = 1;
      if (el.id.indexOf('chosenMult') > -1) {
        qtdeOper["mult"] = RandInt(0, 2);
        oper['mult'] = 1;
      }
      else if (el.id.indexOf('chosenDiv') > -1) {
        qtdeOper["div"] = RandInt(0, 2);
        oper['div'] = 1;
      }
      else if (el.id.indexOf('chosenSub') > -1) {
        qtdeOper["sub"] = RandInt(1, 3);
        oper['sub'] = 1;
      }
      else if (el.id.indexOf('chosenSum') > -1) {
        qtdeOper["sum"] = RandInt(1, 3);
        oper['sum'] = 1;
      }
      else if (el.id === ('chosenExp')) {
        qtdeOper["exp"] = true;
        oper["exp"] = true;
      }
      else if (el.id === ('chosenExpComParen')) {
        qtdeOper["expComParen"] = true;
        oper["expComParen"] = true;
      }
      else if (el.id.indexOf('chosenParen') > -1) {
        qtdeOper["paren"] = true;
        oper["paren"] = true;
      }
    }
    else if (el.id.indexOf('qtdeExpressao') > -1) {
      qtdeExpressao = parseInt(el.value);
    }
    else if (el.id.indexOf('makeTestePEMDAS') > -1) {
      makeTestePEMDAS = true;
      console.log("makeTestePEMDAS mode!");
    }
    else if (el.type === "radio" && el.checked && el.name === "nivel") {
      difficult = el.value;
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

  //reseta
  clicksData = {};
	let gerador = new GeradorExpressaoZ({makeTestePEMDAS, oper, digitsTermA, digitsTermADiv, qtdeOper, difficult});
	let strHtml = "";
	for (let i = 0; i < qtdeExpressao; i++) {
    let ret = false;
    do {
      ret = await gerador.doExpression()
      if (!ret) {
        console.log('Falha ao gerar expressão N i='+i, gerador);
        continue;
      }
    } while (!ret);
    strHtml += '<div id="expressao'+(i+1)+'">'
    if (makeTestePEMDAS) {
      strHtml += 'Expressão N-'+(i+1)+': '
      +'<strong class="preserveSpaces"> '
      +gerador.expressionStr
      +' </strong>'
      +'<br />';
      
      strHtml += '<span style="color:red;">Clique em cada opção de acordo com a ordem de resolução no PEMDAS</span>';
      strHtml += '<br/>';

      for (let j = 0; j < gerador.testePEMDAS.steps.length; j++) {
        let correctIndex = parseInt(gerador.testePEMDAS.steps[j].index);
        {
          clicksData['expressao'+(i+1)] = {
            currentClick:0, total: gerador.testePEMDAS.steps.length,
            elementosClicados: [],
            resultado: {
              totalClicks: 0,
              clicksCertos: 0,
              clicksErrados: 0,
            }
          };
        }
        
        strHtml += '<div class="'+((j % 2 === 0)?"indexParNaoSelecionadoState": "indexImparNaoSelecionadoState")
        +'" height="40" id=`expressao'+(i+1)+'_step'+(j)
        +'` onclick="onClickAnswer(this, `expressao'+(i+1)
        +'`, '+correctIndex+', '+(i+1)+')">';
        strHtml += '<span>';
          strHtml += gerador.testePEMDAS.steps[j].text;
        strHtml += '</span>';
        strHtml += '</div>';
      }
      strHtml += '<div class="resultadoPEMDAS" id="expressaoResultado'+(i+1)+'">';
        strHtml += 'Acertos: 0 Erros: 0';
      strHtml += '</div>';
		  strHtml += '<br />';
    }
    else {
      //strHtml += '<p><strong>NOTA: Para a expressão, deixe '+(gerador.qtdeLinhas - 1)+' linhas no caderno abaixo da expressão</strong><br />';
      strHtml += 'Expressão N-'+(i+1)+': '
      +'<strong class="preserveSpaces"> '
      +gerador.expressionStr
      +' </strong>'
      +'<br />'
      +'<button type="button" onclick="showExprNResp('+(i+1)+',`'+gerador.expressionStr+'`,'+gerador.answer+');">'
      +'Ver resposta Expressão N-'+(i+1)
      +'</button><br /></p>';
    }
    strHtml += '</div><br/>';
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