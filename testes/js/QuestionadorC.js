const score = {
  total: 0,
  corrects: 0,
  wrongs: 0,
  tried:[]
};
function somarPonto(idQuestion) {
  if (score.tried.indexOf(idQuestion) > -1)
    return;
  score.tried.push(idQuestion);
  score.corrects++;
  score.total++;
  document.getElementById("correct").innerText = score.corrects;
  document.getElementById("total").innerText = score.total;
}
function diminuirPonto(idQuestion) {
  if (score.tried.indexOf(idQuestion) > -1)
    return;
  score.tried.push(idQuestion);
  score.wrongs++;
  score.total++;
  document.getElementById("wrong").innerText = score.wrongs;
  document.getElementById("total").innerText = score.total;
}

function gerarQuestaoC(form, targetID) {
  let operators = [];
  let signal = [];
  let operatorsName = [];
  let signalName = [];
  const paren = {"(": "abre parenteses", ")": "fecha parenteses"};
  const numbers = {
    "0":"zero",
    "1":"um",
    "2":"dois",
    "3":"três",
    "4":"quatro",
    "5":"cinco",
    "6":"seis",
    "7":"sete",
    "8":"oito",
    "9":"nove",
  }
  let qtde = 10;
  let maxTerms = 5;
  for (let el of form.elements) {
		if (el.id.indexOf('somar') > -1) {
			signal.push("+");
      signalName.push("mais");
		}
		else if (el.id.indexOf('subtrair') > -1) {
			signal.push("-");
      signalName.push("menos");
		}
		else if (el.id.indexOf('dividir') > -1) {
			operators.push("/");
      operatorsName.push("dividido por");
		}
		else if (el.id.indexOf('multiplicar') > -1) {
			operators.push("*");
      operators.push("vezes");
		}
    else if (el.id.indexOf('maxTerms') > -1) {
      //tem um bug que deixa adicionar um numero a mais
			maxTerms = parseInt(el.value) - 1;
		}
	}

  if (!signal.length) {
    signal = ["-","+"];
    signalName = ["menos", "mais"];
  }
  if (!operators.length) {
    operators = ["/","*"];
    operatorsName = ["dividido por", "vezes"];
  }

  let callback = (gerador, strValue, nodeType)=>{
    switch (nodeType) {
      case NodeTypes.NUMBER:{
        gerador.expressionPhrase += " " + numbers[strValue];
        gerador.expressionWrongStr += " "+ strValue;
        gerador.expressionStr += " "+ strValue;
        console.log("callback.NUMBER '"+strValue+"' type = "+nodeType)
        break;
      }
      case NodeTypes.SIGNAL:{
        let id = signal.indexOf(strValue);
        if (id < 0)
          return;
        gerador.expressionPhrase += " "+signalName[id];
        let wrongID = id;
        if (RandInt(0, 1) === 1) {
          do {
            wrongID = RandInt(0, signal.length - 1);
          } while(wrongID === id);
        }
        gerador.expressionWrongStr += " "+signal[wrongID];
        gerador.expressionStr += " "+ signal[id];
        break;
      }
      case NodeTypes.PAREN:{
        let id = strValue in paren;
        if (!id)
          return;
        gerador.expressionPhrase += " "+paren[strValue];
        gerador.expressionWrongStr += " " + strValue;
        gerador.expressionStr += " "+ strValue;
        break;
      }
      case NodeTypes.OPERATOR:{
        let id = operators.indexOf(strValue);
        if (id < 0)
          return;
        gerador.expressionPhrase += " "+operatorsName[id];
        let wrongID = id;
        if (RandInt(0, 1) === 1) {
          do {
            wrongID = RandInt(0, operators.length - 1);
          } while(wrongID === id);
        }
        gerador.expressionWrongStr += " "+operators[wrongID];
        gerador.expressionStr += " "+ operators[id];
        break;
      }
    }
  };
  //* @param {{minNumberValue:number, maxNumberValue:number, maxTerms:number, tokenProcessorCallback: function, signal:[string], operators:[string]}} optionsTable 
  const gerador = new GeradorExpressaoNotavel({minNumberValue: 0, maxNumberValue: 9, maxTerms: maxTerms, tokenProcessorCallback: callback, signal: signal, operators: operators});
  let htmlStr = "";
  htmlStr += "<div id='container'>";
  htmlStr+="<div id='questions'>";
  for (let i = 0; i < qtde; ) {
    gerador.doExpression();
    let correctPhrase = gerador.expressionPhrase;
    let correctStr = gerador.expressionStr;
    let wrong = gerador.expressionWrongStr;
    
    i++;
    htmlStr+="<div>\n";
    htmlStr += "<fieldset>\n";
    htmlStr += "<legend>Qual expressão representa a frase: <strong>"+correctPhrase+"</strong> ?</legend><br/>\n";
    let options = [
      "<label><input type='radio' name='answer"+i+"' value='1' onclick='somarPonto("+i+")' >"+correctStr+"</label><br/>\n",
      "<label><input type='radio' name='answer"+i+"' value='0' onclick='diminuirPonto("+i+")'>"+wrong+"</label><br/>\n",
    ];
    
    shuffle(options);

    for (let o of options) 
      htmlStr += o;
    htmlStr += "</fieldset>\n";
    htmlStr+="</div><br/>\n";
  }

  htmlStr += "<div id='questionSocre' class='fixedFloat'>\n";
    htmlStr += "<p>Acertos <strong id='correct'>"+score.corrects+"</strong> Erros <span id='wrong'>"+score.wrongs+"</span> de um total de <span id='total'>"+score.total+"</span></p>"
  htmlStr+="</div>";
  htmlStr+="</div>";
  htmlStr += "</div>\n";
    htmlStr += "<div class='footerSeparator'>\n";
    htmlStr += "</div>\n";
  htmlStr += '</div>';
  document.getElementById(targetID).innerHTML = htmlStr;
}