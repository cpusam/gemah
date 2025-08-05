
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

	doExpression () {
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
    //NOTA: entre cada formato é escolhido um sinal s
    //NOTA: a potencia tem que ficar por último fora da expressão pro js executar corretamente (defeito)
    //NOTA: 'a' é maior que 'b'
		const formatosBase = this.optionsTable.formatosBase || [
      'a sb',
		];
    if (this.optionsTable.oper["sub"]) {
      formatosBase.splice(0, 1);
      formatosBase.push('a -b');
    }
    if (this.optionsTable.oper["mult"]) {
      formatosBase.push('a * (sb)');
      formatosBase.push('a * (-b)');
    }
    if (this.optionsTable.oper["div"]) {
      formatosBase.push('Q / (sq)');
      formatosBase.push('Q / (-q)');
    }
    //expoente
    if (this.optionsTable.oper["exp"]) {
      formatosBase.push('c^2');
      formatosBase.push('c^2 + (-c)^2');
      formatosBase.push('(-c)^3');
    }

    //parênteses
    //fazer dividido por tópicos foi muito bom pra adicionar novas opções
    if (this.optionsTable.oper["paren"]) {
      //opção default
      formatosBase.push('(sa +b)');
      formatosBase.push('(-a sb)');
      formatosBase.push('(sa sb)');
      formatosBase.push('(sa sb sc)');
      //opção de div
      if (this.optionsTable.oper['div'] && this.optionsTable.oper['mult']) {
        formatosBase.push('(sQ / (sq) sQ / (sq)) * (sc)');
        formatosBase.push('(sc) * (sQ / (sq) sQ / (sq))');
      }
      else if (this.optionsTable.oper['mult']) {
        formatosBase.push('(sa s b s c) * (sa)');
      } 
      else if (this.optionsTable.oper['div']) {
        formatosBase.push('(sQ / (sq) + sQ / (sq))');
      }
    }

    const formatoSemParenteses = this.optionsTable.formatosSemParenteses || [
      'a + b',
		];

		let formatos = formatosBase;//this.optionsTable.withParenteses? formatosBase: formatoSemParenteses;

    const sinal = ['-', '+'];
    const sinalLink = ['-','+'];		
		
    console.log(this.optionsTable.qtdeMonomio);
		for (let t = 0; t < 100; t++) {
			let expUser = '';//expressão para o usuário
      let expJS = '';//expressão para o javascript calcular
			
			let chosenFormas = [];
      const maxMonomio = this.optionsTable.qtdeMonomio;// RandInt(2, this.optionsTable.qtdeMonomio);
			for (let total = 0, lastMonomio = maxMonomio - 1; total < maxMonomio; total++) {
        //escolhe a forma
				let forma = formatos[RandInt(0, formatos.length - 1)];
        chosenFormas.push(forma);
        let last = '';
        let opLink = sinalLink[RandInt(0, sinalLink.length - 1)];
        
        console.log('formato escolhido = '+forma);
        let a = 0;
        let A = 0;
        let b = 0;
        let B = 0;
        let s = '';         

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

          s = sinal[RandInt(0, sinal.length - 1)];
          
          //formato das expressões binárias
          //t = termo de variável aleatória
          //l = valor lógico true ou false (V ou F para o usuário)
          //o = operador binário pode ser && ou || (E ou OU para o user)
          //i = inverso lógico (negação)
          let Q = 0, q = 0;
          let lastSetted = "";
            for (let j = 0; forma.charAt(j); j++) {
              switch (forma.charAt(j)) {
                case 'a':
                  a = RandInt(this.optionsTable.minNumber, this.optionsTable.maxNumber);
                  A = a * a;
                  lastSetted = "a";
                  expUser += ' '+a;
                  expJS += ' '+a;
                  tokens.push(a);
                  break;
                case 'b':
                  ok = false;
                  while (!ok) {
                    b = RandInt(this.optionsTable.minNumber, this.optionsTable.maxNumber);
                    B = b * b;
                    ok = b <= a;
                  }
                  lastSetted = "b";
                  expUser += ' '+b;
                  expJS += ' '+b;
                  tokens.push(b);
                  break;

                  case 'c': {
                    lastSetted = "c";
                    expUser += ' '+c;
                    expJS += ' '+c;
                    tokens.push(c);
                  }
                  break;

                
                case 'A':
                  expUser += ' '+A;
                  expJS += ' '+A;
                  lastSetted = "A";
                  tokens.push(A);
                  break;
                case 'B':
                  expUser += ' '+B;
                  expJS += ' '+B;
                  lastSetted = "B";
                  tokens.push(B);
                  break;
                case'D':
                  {
                    let D = 2 * a * b;
                    expUser += ' '+D;
                    expJS += ' '+D;
                    lastSetted = "D";
                    tokens.push(D);
                  }
                  break;
                case 's':
                  {
                    expUser += ' '+s;
                    expJS += ' '+s;
                    last = 's';
                    tokens.push(s);
                  }
                  break;
                case 'n': 
                  {
                    expUser += ' '+'-';
                    expJS += '-';
                    tokens.push('n');
                  }
                  break;
                //não coloca esses chars
                case '^': {
                  let p = "";
                  let con = 1;
                  for (let k = j + 1; con; k++) {
                    let ch = forma.charAt(k);
                    if (ch >= '0' && ch <= '9') {
                      p += ch;
                    }
                    else {
                      j = k;
                      con = 0;
                      break;
                    }
                  }

                  let valueBefore = null;
                  switch(lastSetted) {
                    case 'A':
                      valueBefore = A;
                      break;
                    case 'B':
                      valueBefore = B;
                      break;
                    case 'D':
                      valueBefore = D;
                      break;
                    case 'a':
                      valueBefore = a;
                      break;
                    case 'b':
                      valueBefore = b;
                      break;
                    case 'c':
                      valueBefore = c;
                      break;
                    default:
                      valueBefore = null;
                      break;
                  }

                  if (valueBefore) {
                    let hasParenteses = forma.charAt(j-1) === ')';
                    let r = Math.pow(valueBefore, parseInt(p));
                    console.log("valueBefore = '"+valueBefore+"'");
                    console.log("p = '"+p+"'");
                    expJS += ' '+s+r;
                    expUser += ' '+s
                    +(hasParenteses?'(':'')
                    +valueBefore
                    +(hasParenteses?')':'')+'^'+p;
                  }
                }
                break;
                case 'p':
                  expUser += '^2';
                  tokens.push('^2');
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
                    expUser += ' '+B;
                    expJS += ' '+B;
                    tokens.push(B);
                  }
                  break;
                case 'q':{
                    B = q;
                    expUser += ' '+B;
                    expJS += ' '+B;
                    tokens.push(B);
                  }
                  break;
                default:
                  expUser += ' '+forma.charAt(j);
                  expJS += ''+forma.charAt(j);
                  tokens.push(forma.charAt(j));
                  break;
              }
            }

          if (last !== 'e') {
            console.log('['+total+'] expUser = '+last+' exp \''+expUser+'\'');
            console.log('['+total+'] expJS = '+last+' exp \''+expJS+'\'');
          }
				}

        if (total != lastMonomio) {
          expUser += ' '+opLink;
          expJS += ''+opLink; 
        }
      }

			console.log('Gerador expressão Numérica notável = \'' + expJS + "'");
      const resp = eval(expJS);
			if (resp !== 'undefined') {

        this.expressionStr = expUser;
        this.expressionStrJS = expJS;
        this.answer = resp;
				//this.answer = this.generateAnswer({chosenFormas, answerMonomioBase})
				return true;
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
      else if (el.id.indexOf('chosenExp') > -1) {
        qtdeOper["exp"] = true;
        oper["exp"] = true;
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
		if (!gerador.doExpression()) {
			console.log('Falha ao gerar expressão N i='+i, gerador);
			continue;
		}
		//strHtml += '<p><strong>NOTA: Para a expressão, deixe '+(gerador.qtdeLinhas - 1)+' linhas no caderno abaixo da expressão</strong><br />';
		strHtml += 'Expressão N-'+(i+1)+': '
		+'<strong>'
		+gerador.expressionStr
		+'</strong>'
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