let score = {
};
let config = {

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

function verificarResposta(idQuestion, answer, elementID, typed, resultID) {
  if (typed)
    document.getElementById(elementID).textContent += typed;
  let str = document.getElementById(elementID).textContent;
  let ok = 0;
  for (let i = 0; i < str.length; i++)
    ok += str[i] === answer[i];
  if (config.liveAnswer) {
    //https://emojidb.org/
    if (ok === str.length)
      document.getElementById(resultID).textContent = "✅";
    else
      document.getElementById(resultID).textContent = "❌";
  }

  if (str === answer) {
    somarPonto(idQuestion); 
    document.getElementById(resultID).textContent = "👍";
  }
}


function desfazerUltimo(idQuestion, answer, elementID, typed, resultID) {
  let str = document.getElementById(elementID).textContent;
  if (str.length === 0)
    return;

  let ok = "";
  for (let i = 0; i < str.length - 1; i++)
    ok += str[i];
  document.getElementById(elementID).textContent = ok;
  verificarResposta(idQuestion, answer, elementID, undefined, resultID);
}

function limparResposta(idQuestion, answer, elementID) {
  document.getElementById(elementID).textContent = "";
}

function gerarQuestaoC(form, targetID) {
  score = {
    total: 0,
    corrects: 0,
    wrongs: 0,
    tried:[]
  };

  config = {
    liveAnswer: false,
  };

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
  };
  let qtde = 10;
  let maxTerms = 5;
  let mode = "select";
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
    else if (el.name.indexOf('mode') > -1 && el.checked) {
      mode = el.value;
		}
    else if (el.name.indexOf('liveAnswer') > -1 && el.value === "yes" && el.checked) {
      config.liveAnswer = true;
		}
    else if (el.name.indexOf('liveAnswer') > -1 && el.value === "no" && el.checked) {
      config.liveAnswer = false;
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
  let tokens = [];
  let callback = (gerador, strValue, nodeType)=>{
    switch (nodeType) {
      case NodeTypes.NUMBER:{
        gerador.expressionPhrase += " " + numbers[strValue];
        gerador.expressionStr += " "+ strValue;
        console.log("callback.NUMBER '"+strValue+"' type = "+nodeType)
        if (gerador.tokens.indexOf(strValue) === -1)
          gerador.tokens.push(strValue);
        break;
      }
      case NodeTypes.SIGNAL:{
        let id = signal.indexOf(strValue);
        if (id < 0)
          return;
        gerador.expressionPhrase += " "+signalName[id];
        gerador.expressionStr += " "+ signal[id];
        if (gerador.tokens.indexOf(strValue) === -1)
          gerador.tokens.push(strValue);
        break;
      }
      case NodeTypes.PAREN:{
        let id = strValue in paren;
        if (!id)
          return;
        gerador.expressionPhrase += " "+paren[strValue];
        gerador.expressionStr += " "+ strValue;
        if (gerador.tokens.indexOf(strValue) === -1)
          gerador.tokens.push(strValue);
        break;
      }
      case NodeTypes.OPERATOR:{
        let id = operators.indexOf(strValue);
        if (id < 0)
          return;
        gerador.expressionPhrase += " "+operatorsName[id];
        gerador.expressionStr += " "+ operators[id];
        if (gerador.tokens.indexOf(strValue) === -1)
          gerador.tokens.push(strValue);
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
    tokens = gerador.tokens;
    let correctPhrase = gerador.expressionPhrase;
    let correctStr = gerador.expressionStr;
    let wrong = gerador.expressionStr;
    let changed = false;
    do {
      let strNewSignal = "", position = -1;
      for (let j = 0; j < gerador.expressionStr.length; j++) {
        let id = signal.indexOf(gerador.expressionStr[j]);
        if (id > -1) {
          if (RandInt(0, 1) === 1) {
            do {
              strNewSignal = signal[RandInt(0, signal.length - 1)];
            } while (strNewSignal === signal[id]);
            position = j;
            changed = true;
          }
        }
      }
      
      if (changed) {
        wrong = "";
        for (let j = 0; j < gerador.expressionStr.length; j++) {
          if (j === position)
            wrong += strNewSignal;
          else
            wrong += gerador.expressionStr[j];
        }
      }
    } while (!changed);
    i++;
    htmlStr+="<div>\n";
    htmlStr += "<fieldset>\n";
    htmlStr += "<legend>Qual expressão representa a frase: <strong>"+correctPhrase+"</strong> ?</legend><br/>\n";
    if (mode === "select") {
      let options = [
        "<label><div><input type='radio' name='answer"+i+"' value='1' onclick='somarPonto("+i+")' >"+correctStr+"</label></div><br/>\n",
        "<label><div><input type='radio' name='answer"+i+"' value='0' onclick='diminuirPonto("+i+")'>"+wrong+"</label></div><br/>\n",
      ];
      
      shuffle(options);

      for (let o of options) 
        htmlStr += o;
    }
    else {
      htmlStr += "<div id='controlsAnswer'>";
        shuffle(tokens);
        htmlStr += "<div><strong id='inputAnswer"+i+"' class='inputAnswer'></strong><span id='result"+i+"'></span></div><br/>"
        for (let j = 0; j < tokens.length; j++)
          htmlStr += "<button class='answerToken' onclick='verificarResposta("+i+",`"+gerador.expressionStrJS+"`, `inputAnswer"+i+"`, `"+tokens[j]+"`,`result"+i+"` )'>"+tokens[j]+"</button>";
        htmlStr += "<button class='answerDel' onclick='limparResposta("+i+",`"+gerador.expressionStrJS+"`, `inputAnswer"+i+"`)'>DEL</button>";
        htmlStr += "<button class='answerDel' onclick='desfazerUltimo("+i+",`"+gerador.expressionStrJS+"`, `inputAnswer"+i+"`,`result"+i+"`)'>⌫</button>";
        htmlStr += "<br/>";
      htmlStr += "</div>";
    }
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