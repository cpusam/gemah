//////////////////////////////////////////////////////////////////////
//gera expressões dentro dos números NATURAIS
//derivado de GeradorExpressaoNotavel em 01/02/2023
class GeradorExpressaoNotavelNatural {
	/**
	 * 
	 * @param {{withParenteses:boolean, maxPotency:number, minNumber:number, maxNumber:number, maxLiteral:number, qtdeMonomio:number}} optionsTable 
	 */
	constructor (optionsTable) {
		this.optionsTable = optionsTable;
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
		//s = sinal + ou -
    //n = sinal negativo
		//A = quadrado de um número a
    //B = quadrado de um número b
    //D = 2 vezes 'a' vezes 'b'
		//p = potência de 2
		//r = raiz quadrada de q
    //i = iniciar tudo para a expressão seguinte, tipo resetar valores para usar nos próximos tokenbs do formato
    //NOTA: entre cada formato é escolhido um sinal s
    //NOTA: a potencia tem que ficar por último fora da expressão pro js executar corretamente (defeito)
    //NOTA: 'a' é maior que 'b'
		const formatosBase = [
      '(a + b)',
      '(A + D + B)',
      '(a + b)*(a + b)',
      '(A + B)'
		];

    const formatoSemParenteses = [
      'a + b',
		];

		let formatos = this.optionsTable.withParenteses? formatosBase: formatoSemParenteses;

    const sinal = ['-', '+'];
    const sinalLink = ['+'];
		
		
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

        let hasPotency = forma.indexOf('^') > -1;
        if (hasPotency)
          expJS += 'Math.pow(';
          

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

          s = sinal[RandInt(0, sinal.length - 1)];
          
          //formato das expressões binárias
          //t = termo de variável aleatória
          //l = valor lógico true ou false (V ou F para o usuário)
          //o = operador binário pode ser && ou || (E ou OU para o user)
          //i = inverso lógico (negação)
            for (let j = 0; forma.charAt(j); j++) {
              switch (forma.charAt(j)) {
                case 'a':
                  a = RandInt(this.optionsTable.minNumber, this.optionsTable.maxNumber);
                  A = a * a;
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
                  expUser += ' '+b;
                  expJS += ' '+b;
                  tokens.push(b);
                  break;
                case 'A':
                  expUser += ' '+A;
                  expJS += ' '+A;
                  tokens.push(A);
                  break;
                case 'B':
                  expUser += ' '+B;
                  expJS += ' '+B;
                  tokens.push(B);
                  break;
                case'D':
                  {
                    let D = 2 * a * b;
                    expUser += ' '+D;
                    expJS += ' '+D;
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
                case '^':
                case 'p':
                  expUser += '^2';
                  tokens.push('^2');
                  break;
                default:
                  expUser += ' '+forma.charAt(j);
                  expJS += ''+forma.charAt(j);
                  tokens.push(forma.charAt(j));
                  break;
              }
            }

          if (last !== 'e') {
            console.log('['+total+'] = '+last+' exp \''+expUser+'\'');
            console.log('['+total+'] = '+last+' exp \''+expJS+'\'');
          }
				}

        if (hasPotency) {
          expJS += ','+'2'+')';
        }

        if (total != lastMonomio) {
          expUser += ' '+opLink;
          expJS += ''+opLink; 
        }
      }

			console.log('Gerador expressão Numérica notável = \'' + expJS + "'");
      const resp = eval(expJS);
			if (resp !== 'undefined') {
        //só aceitar resposta >=0
        if (resp < 0) {
          continue;
        }

        this.expressionStr = '<span>_</span>'+expUser+'<span>_</span>';
        this.expressionStrJS = expJS;
        this.answer = resp;
				//this.answer = this.generateAnswer({chosenFormas, answerMonomioBase})
				return true;
			}
		}

		return false;
	}
}

function showExpressaoNotavelNaturalResp( index, strExpr, answer ) {
	alert('Resposta = '+answer);
}

function gerarExpressaoNotavelNatural ( form, targetId ) {
	console.log("Aqui estamos gerarExpressaoNotavelNatural");
	let mult = [];
	let div = [];
	let sub = [];
	let sum = [];
	let digitsTermA = 2;
	let qtdeExpressao = 10;
	let qtdeOper = {};
	let qtdeMonomio = 5;
	let maxPotency = 2;
  let minNumber = 2;
	let maxNumber = 5;
	let maxLiteral = 2;
  let withParenteses = false;

	for (let el of form.elements) {
    console.log(el.id);
    if (el.id.indexOf('Parenteses') > -1) {
			withParenteses = el.checked;
		}
		else if (el.id.indexOf('QtdeMonomio') > -1) {
			qtdeMonomio = parseInt(el.value);
		}
		else if (el.id.indexOf('MaxPotency') > -1) {
			maxPotency = parseInt(el.value);
		}
		else if (el.id.indexOf('NumberMin') > -1) {
			minNumber = parseInt(el.value);
		}
    else if (el.id.indexOf('NumberMax') > -1) {
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

  if (minNumber > maxNumber) {
    let a = minNumber;
    minNumber = maxNumber;
    maxNumber = a;
  }

	let gerador = new GeradorExpressaoNotavelNatural({withParenteses, maxPotency, minNumber, maxNumber, maxLiteral, qtdeMonomio});
	let strHtml = "";
	for (let i = 0; i < qtdeExpressao; i++) {
		if (!gerador.doExpression()) {
			console.log('Falha ao gerar expressão Notavel Natural i='+i, gerador);
			continue;
		}
		strHtml += 'Expressão Númérica-'+(i+1)+': '
    +'<br />'
		+'<strong>'
		+gerador.expressionStr
		+'</strong>'
		+'<br />'
		+'<button type="button" onclick="showExpressaoNotavelNaturalResp('+i+',`'+gerador.expressionStr+'`,'+gerador.answer+');">'
		+'Ver resposta Expressão-'+(i+1)
		+'</button><br /></p>';
	}
	
	document.getElementById(targetId).innerHTML = strHtml;
}
