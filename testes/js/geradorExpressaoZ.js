
///////////////////////////////////////////////
//gera exprões dentro dos números inteiros
class GeradorExpressaoZ {
  /**
	 * 
	 * @param {{withParenteses:boolean, maxPotency:number, minNumber:number, maxNumber:number, maxLiteral:number, qtdeMonomio:number, oper:object}} optionsTable 
	 */
	constructor (optionsTable) {
		this.optionsTable = optionsTable;
    this.optionsTable.minNumber = 0;
    this.optionsTable.maxNumber = 20;
    this.optionsTable.qtdeMonomio = 5;
		this.expressionStr = "";
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
    //Q = dividendo tabuada de vididir
    //q = divisor de 'q' tabuada de dividir 
    //t = numero de 0 até 5
    //NOTA: entre cada formato é escolhido um sinal s
    //NOTA: a potencia tem que ficar por último fora da expressão pro js executar corretamente (defeito)
    //NOTA: 'a' é maior que 'b'
		const formatosBase = {
      sum:[],
      sub:[],
      mult:[],
      div:[],
      exp:[],
      paren:[],
      expComParen:[],
      expNegComParen:[],
    };
    if (this.optionsTable.oper["sum"]) {
      formatosBase.sum.push('a +b');
    }
    if (this.optionsTable.oper["sub"]) {
      formatosBase.sub.push('a -b');
    }
    if (this.optionsTable.oper["mult"]) {
      formatosBase.mult.push('a * (sb)');
      formatosBase.mult.push('a * b');
    }
    if (this.optionsTable.oper["div"]) {
      formatosBase.div.push('Q / (sq)');
      formatosBase.div.push('Q / (-q)');
    }
    //NOTA:
    //tem um bug no interpretadorC que faz com que tenha de colocar as expressões expoente com parenteses
    //Talvez fosse melhor ter feito em ANTLR4 com C++ mesmo.
    //expoente
    if (this.optionsTable.oper["exp"]) {
      formatosBase.exp.push('(c^(2))');
      formatosBase.exp.push('(c^(2)) + (-c)^2');
      formatosBase.exp.push('(-c)^3');
    }

    //expoente com parenteses
    if (this.optionsTable.oper["expComParen"]) {
      formatosBase.expComParen.push('((sc)^(t))');
      formatosBase.expComParen.push('((sc)^(t))*(sa)');
      formatosBase.expComParen.push('((sc)^(t))*(sa)*(sQ/(sq))');
    }

    if (this.optionsTable.oper["expNegComParen"]) {
      formatosBase.expNegComParen.push('((sc)^(-t))');
      formatosBase.expNegComParen.push('((sc)^(-t))*(sa)');
      formatosBase.expNegComParen.push('((sc)^(-t))*(sa)*(sQ/(sq))');
    }

    //parênteses
    //fazer dividido por tópicos foi muito bom pra adicionar novas opções
    if (this.optionsTable.oper["paren"]) {
      //opção default é apenas soma
      formatosBase.paren.push('(sa sb)');
      //subtração ou aleatórios
      if (this.optionsTable.oper['sub']) {
        formatosBase.sub.push('(sa sb)');
        formatosBase.sub.push('(sa sb sc)');
      }
      //opção de div
      if (this.optionsTable.oper['div'] && this.optionsTable.oper['mult']) {
        formatosBase.paren.push('(sQ / (sq) sQ / (sq)) * (sc)');
        formatosBase.paren.push('(sc) * (sQ / (sq) sQ / (sq))');
      }
      else if (this.optionsTable.oper['mult']) {
        formatosBase.mult.push('(sa sb sc) * (sa)');
        formatosBase.mult.push('(sa sb s(sa sb)) * (sc)');
      } 
      else if (this.optionsTable.oper['div']) {
        formatosBase.div.push('(sQ / (sq) + sQ / (sq))');
      }
    }

    const formatoSemParenteses = this.optionsTable.formatosSemParenteses || [
      'a + b',
		];

		let formatos = [];
    for (let el in this.optionsTable.oper)
      formatos.push(el);
    if (formatos.length === 0) {
      alert("formatos nulo!");
      return false;
    }
      

    const sinal = ['-', '+'];
    const sinalLink = ['-','+'];		
		let valid = 0;

    console.log(this.optionsTable.qtdeMonomio);
		for (let t = 0; t < 100; t++) {
			let expUser = '';//expressão para o usuário
      let expJS = '';//expressão para o javascript calcular
			let vars = [];
      let varsCount = 0;

			let chosenFormas = [];
      const maxMonomio = this.optionsTable.qtdeMonomio;// RandInt(2, this.optionsTable.qtdeMonomio);
      let chosenAssuntos = [];
			for (let total = 0, lastMonomio = maxMonomio - 1; total < maxMonomio; total++) {
        varsCount++;
        //escolhe a forma
        let member = formatos[RandInt(0, formatos.length - 1)];
				let forma = formatosBase[member][RandInt(0, formatosBase[member].length - 1)];
        if (chosenAssuntos.indexOf(member) > -1) {
          let tries = 0;
          do {
            member = formatos[RandInt(0, formatos.length - 1)];
				    forma = formatosBase[member][RandInt(0, formatosBase[member].length - 1)];
            tries++;
          } while (tries < 100 && chosenAssuntos.indexOf(member) > -1);
          chosenAssuntos.push(member);
        }

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
				{
          let tokens = [];
          a = RandInt(this.optionsTable.minNumber, this.optionsTable.maxNumber);
          A = a * a;
          let ok = false;
          while (!ok) {
            b = RandInt(this.optionsTable.minNumber, this.optionsTable.maxNumber);
            B = b * b;
            ok = b <= a;
          }

          let c = RandInt(1, 5);
          let t = RandInt(0, 5);

          s = sinal[RandInt(0, sinal.length - 1)];
          
          //formato das expressões binárias
          //t = termo de variável aleatória
          //l = valor lógico true ou false (V ou F para o usuário)
          //o = operador binário pode ser && ou || (E ou OU para o user)
          //i = inverso lógico (negação)
          let Q = 0, q = 0;
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
                lastSetted = "c";
                varName = getVarName("c");
                varsForma.push(setVar("c", s+c));
                value = c;
              }
              break;

              case 't': {
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
            }
          }
				}

        expJS += strForma;
        vars = [...vars, ...varsForma];
        console.log("[expr]='"+expJS+"'");
        console.log("["+forma+"]=['"+varsForma+"']")

        if (total != lastMonomio) {
          expUser += ' '+opLink;
          expJS += ''+opLink; 
        }
      }

			console.log('Gerador expressão Numérica notável = \'' + expJS + "'");
      let varsArgs = "";
      vars.forEach((element, index) => {
        varsArgs += (index > 0?",":"") + element;
      });
      const resp = await runAST(expJS, varsArgs);
      console.log("resp = "+resp);
			if (resp !== 'undefined') {

        this.expressionStr = resp.userExpr;
        this.expressionStrJS = resp.exprJS;
        this.answer = resp.result;
				//this.answer = this.generateAnswer({chosenFormas, answerMonomioBase})
				if (this.answer - Math.floor(this.answer) === 0)
          return true;
			}
		}

		return false;
	}
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
  }

  if (qtdeExpressao <= 0) {
		alert("Escolha quantos termos usar nas expressões");
		return;
	}

  if (!terms) {
    alert("Escolha uma opção de operação.");
    return;
  }

	let gerador = new GeradorExpressaoZ({oper, digitsTermA, digitsTermADiv, qtdeOper});
	let strHtml = "";
	for (let i = 0; i < qtdeExpressao; i++) {
    let ret = await gerador.doExpression()
		if (!ret) {
			console.log('Falha ao gerar expressão N i='+i, gerador);
			continue;
		}
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