
//todas respostas devem ter esse valor do checkbox
let answerLogic = true;
//nível de dificuldade, mais baixo é 0
let level = 1;

let answers = {
  "resp1": {
    chosen: false,
    answer: false,
  }, 
  "resp2":{
    chosen: false,
    answer: true,
  }
};

function onChooseAnswer(elCheckbox) {
  answers[elCheckbox.id].chosen = elCheckbox.checked;
}

function generateCode(formId, codeId) {
  let form = document.getElementById(formId);
  let code = document.getElementById(codeId);
  while (code.firstChild) {
    code.removeChild(code.lastChild);
  }
  let chosenQuestions = [], questionsHtml = [];
  let declaredNum = 'num', declaredEnd = null, declaredStart = null;
  let usedNum = 0, usedStart = 0, usedEnd = 1;
  const codeBase = {
    fullInterval: () => {
      let text = ''+declaredNum+' >= '+usedStart+' && '+declaredNum+' <= '+usedEnd;
      if (declaredEnd && !declaredStart)
        text = ''+declaredNum+' >= '+usedStart+' && '+declaredNum+' <= '+declaredEnd;
      else if (!declaredEnd && declaredStart)
        text = ''+declaredNum+' >= '+declaredStart+' && '+declaredNum+' <= '+usedEnd;
      else if (declaredEnd && declaredStart)
        text = ''+declaredNum+' >= '+declaredStart+' && '+declaredNum+' <= '+declaredEnd;

      let result = usedNum >= usedStart && usedNum <= usedEnd;
      return {text, result};
    },
    greatThan: () =>{
      let text = ''+declaredNum+' > '+usedEnd;
      if (declaredEnd)
        text = ''+declaredNum+' > '+declaredEnd;
    
      let result = usedNum > usedEnd;
      return {text, result};
    },
    lessThan: () =>{
      let text = ''+declaredNum+' < '+usedEnd;
      if (declaredEnd) {
        text = ''+declaredNum+' < '+declaredEnd;
      }

      let result =  usedNum < usedEnd;
      return {text, result};
    },
    greatOrEqualsThan: () =>{
      let text = ''+declaredNum+' >= '+usedEnd;
      if (declaredEnd)
        text = ''+declaredNum+' >= '+declaredEnd;

      let result = usedNum >= usedEnd;
      return {text, result};
    },
    lessOrEqualsThan: () =>{
      let text = ''+declaredNum+' <= '+usedEnd;
      if (declaredEnd)
        text = ''+declaredNum+' <= '+declaredEnd;

      let result = usedNum <= usedEnd;
      return {text, result};
    },
    lessOrGreatThan: () => {
      let text = ''+declaredNum+' < '+usedStart+' || '+declaredNum+' > '+usedEnd;
      if (declaredEnd && !declaredStart)
        text = ''+declaredNum+' < '+usedStart+' || '+declaredNum+' > '+declaredEnd;
      else if (!declaredEnd && declaredStart)
        text = ''+declaredNum+' < '+declaredStart+' || '+declaredNum+' > '+usedEnd;
      else if (declaredEnd && declaredStart)
        text = ''+declaredNum+' < '+declaredStart+' || '+declaredNum+' > '+declaredEnd;

      let result = usedNum < usedStart || usedNum > usedEnd;
      return {text, result};
    },
  };

  const colors = {
    'if':'<strong>if</strong>',
    'else if':'<strong>else if</strong>',
    'else':'<strong>else</strong>',
    'int':'<strong style="color:green">int</strong>',
    'return':'<strong>return</strong>',
  }

  const codeIf = {
    ifCmd: (base)=>{
      const obj = base[0]();
      let str = colors['if']+' ('+obj.text+')';
      return [str, obj.result];
    },
    ifElseCmd: (base)=>{
      let obj1 = base[0]();
      let r = -1;
      if (obj1.result)
        r = 0;
      else
        r = 1;
      return [
        colors['if']+' ('+obj1.text+')', r == 0,
        colors['else'], r == 1,
      ];
    },
    ifElseIfElseCmd: (base)=>{
      const a = base[0]();
      const b = base[1]();
      let r = -1;
      if (a.result)
        r = 0;
      else if (b.result)
        r = 1;
      else
        r = 2;

      return [
        colors['if']+' ('+a.text+')',r == 0,
        colors['else if']+' ('+b.text+')', r == 1,
        colors['else'], r == 2,
      ];
    },
    ifElseIfElseIfElseCmd: (base)=>{
      const a = base[0]();
      const b = base[1]();
      const c = base[2]();
      let r = -1;
      if (a.result)
        r = 0;
      else if (b.result)
        r = 1;
      else if (c.result)
        r = 2;
      else
        r = 3;

      return [
        colors['if']+' ('+a.text+')', r == 0,
        colors['else if']+' ('+b.text+')', r == 1,
        colors['else if']+' ('+c.text+')', r == 2,
        colors['else'], r == 3,
      ];
    }
  };
  
  
  let qtdeCmds = 0;
  let codeKeys = Object.keys(codeIf);
  let baseKeys = Object.keys(codeBase);
  qtdeCmds = codeKeys.length;
  
  const qtde = 5;
  const num = RandInt(-10, 10);
  answers = {};
  let answerId = 1;
  let declaredId = 1;
  let usedDeclared = [];
  const declaredNames = ['i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'];
  let chosenNames = [...declaredNames];
  for (let c = 0; c < qtde; c++) {

    let chosen = RandInt(0, qtdeCmds-1);
    let lineFunction = codeKeys[chosen];
    let cmdLine = null;

    let base = [], baseCallbacks = [];
    for (let i = 0; i < 3; ) {
      let n = RandInt(0, baseKeys.length - 1);
      if (base.indexOf(n) > -1)
        continue;

      base.push(n);
      baseCallbacks.push(codeBase[baseKeys[n]]);
      i++;
    }
    
    declaredNum = 'num';
    usedNum = num;
    if (RandInt(0,1)) {
      usedEnd = num + RandInt(0, num);
      usedStart = num - RandInt(0, num);
    }
    else {
      usedEnd = RandInt(0, num);
      usedStart = num - RandInt(0, num);
    }

    declaredEnd = null;
    declaredStart = null;

    if (c === 0) {
      questionsHtml.push(
        '<span class="ident1">'+colors['int']+' '+declaredNum+' = '+usedNum+';</span><br>'+
        '<br>');
      
    }
    let strHtml = '';

    //aqui pode usar o declaredStart/End
    //escolher os valores para declared
    //level define a dificuldade
    if (level > 0 && RandInt(0, 2) === 0) {
      let tries = 0;
      let strStart = '';
      let strEnd = '';
      let i = 0;
      do {
        i = RandInt(0, chosenNames.length - 1);
        strStart = '<span class="ident1">'+colors['int']+' '+chosenNames[i]+' = '+usedStart+';</span><br>';
      } while (usedDeclared.indexOf(chosenNames[i]) > -1 && tries++ < 100);

      let j = 0;
      do {
        j = RandInt(0, chosenNames.length - 1);
        strEnd = '<span class="ident1">'+colors['int']+' '+chosenNames[j]+' = '+usedEnd+';</span><br>';
      } while (tries++ < 100 && i === j);

      {
        usedDeclared.push(chosenNames[i]);
        usedDeclared.push(chosenNames[j]);
        declaredStart = chosenNames[i];
        declaredEnd = chosenNames[j];

        let r = RandInt(0, 1);
        if (r) {
          strHtml += 
            strEnd+strStart+  
            '<br>';
        }
        else  {
          strHtml += 
            strStart+strEnd+
            '<br>';
        }
      }

      if (usedDeclared.length >= chosenNames.length - 3) {
        for (let e  = 0; e < declaredNames.length; e++) {
          chosenNames[e] = declaredNames[e] + declaredId;
        }
        declaredId++;
      }
    }

    cmdLine =  codeIf[lineFunction](baseCallbacks);

    

    for (let k = 0, r = answerId; k < cmdLine.length; k+=2, r++, answerId++) {
      strHtml += 
      '<span class="ident1">'+cmdLine[k]+'</span><br>'+
      '<label id="answer2">'+
        '<span class="ident2">printf("Mensagem '+r+'");</span>'+
        '<input type="checkbox" id="resp'+r+'" onclick="onChooseAnswer(this)"><br>'+
        '</label>'
      ;

        answers['resp'+r] = {
          chosen: -1,
          answer: cmdLine[k + 1],
        };
      }
      strHtml += '<br>';
      questionsHtml.push(strHtml);
  }
  let arrayHtml = [
    '<span style="color: green;">#include &lt;stdio.h&gt;</span><br>',
    '<br>',
    '<span>'+colors['int']+' main() {</span><br>',
    ...questionsHtml,
    '<br>',
    '<span class="ident1">'+colors['return']+' 0;</span><br>',
    '<span>}</span><br>',
  ]
  for (let el = 0; el < arrayHtml.length; el++) {
    code.insertAdjacentHTML(
      "beforeend",
      arrayHtml[el]
    )
  }
}

function corrigirRespostas(formId, codeId) {
  let form = document.getElementById(formId);
  let code = document.getElementById(codeId);
  Array.from(code.children).forEach(el => {
      console.log("aqui id = "+el.id);
      if (el.id.indexOf('answer') < 0)
        return;
      let chosen = Array.from(el.children).find(subEl =>{
        return (subEl.id.indexOf('resp') > -1);
      });
      if (!chosen)
        return;
      
        if (answers[chosen.id].chosen > -1) {
          if (chosen.checked === answers[chosen.id].answer)
            el.classList.add('rightAnswer');
          else
            el.classList.add('wrongAnswer');
        }
    }
  );
}
