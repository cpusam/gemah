

//////////////////////////////////////////////////////////////////////
//gera expressões dentro dos números inteiros
//ver caderno 12/Computação_II/06-06-2025
const NodeTypes = {
  NONE: 0,
  END: 1,
  PAREN: 2,
  NUMBER: 3,
  SIGNAL: 4,
  OPERATOR: 5,
};
class ExprNode {
  /**
   * 
   * @param {{type:number,nextFinal:[],nextMiddle:[]}} config 
   */
  constructor(config) {
    this.type = config.type || NodeTypes.NONE;
    //nextMiddle contém objetos do tipo ExprNode
    this.nextMiddle = config.nextMiddle || [];
    this.nextFinal = config.nextFinal || [];
    this.currentSymbol = null;
  }

  //gera o token baseado no vetor nextMiddle
  chooseNextMiddle() {
    if (!this.nextMiddle.length)
      return NodeTypes.NONE;
    let c = RandInt(0, this.nextMiddle.length - 1);
    if (this.nextMiddle.length === 1)
      c = 0;
    this.currentSymbol = this.nextMiddle[c];
    return this.nextMiddle[c];
  }
  chooseNextFinal() {
    if (!this.nextFinal.length)
      return NodeTypes.NONE;
    let c = RandInt(0, this.nextFinal.length - 1);
    if (this.nextFinal.length === 1)
      c = 0;
    this.currentSymbol = this.nextFinal[c];
    return this.nextFinal[c];
  }
  getCurrentSymbol() {
    return this.currentSymbol || this;
  }
}


class GeradorExpressaoNotavel {
	/**
	 * 
	 * @param {{minNumberValue:number, maxNumberValue:number, maxTerms:number, tokenProcessorCallback: function, signal:[string], operators:[string]}} optionsTable 
	 */
	constructor (optionsTable) {
		this.options = optionsTable;
    this.signal = this.options.signal || ["-", "+"];
    this.operators = this.options.operators || ["/", "*"];
		this.expressionStrJS = "";
    this.expressionStr = "";
    this.expressionPhrase = "";
    this.answer = "";
    this.terms = 0;
    this.level = 0;
    this.onlyPositives = this.options.onlyPositives || false;
    this.onlyNegatives = this.options.onlyNegatives || false;
    this.maxLevel = this.options.maxLevel || 3;
    this.maxTerms = this.options.maxTerms || 5;
    this.tokenProcessorCallback = this.options.tokenProcessorCallback || null;
    if (!this.tokenProcessorCallback )
      this.tokenProcessorCallback = ()=>{};
    this.minNumberValue = this.options.minNumberValue || 0;
    this.maxNumberValue = this.options.maxNumberValue || 100;
    this.tokens = [];
    this.symbols = [];
    this.startList = [];
    this.startSymbol = null;
    this.setupSymbols();
	}

  //deve ser chamado para configurar o parser.
  setupSymbols() {
    this.symbols = [
      new ExprNode({type:NodeTypes.END}),//0
      new ExprNode({type:NodeTypes.PAREN,}),//1
      new ExprNode({type:NodeTypes.NUMBER,}),//2
      new ExprNode({type:NodeTypes.SIGNAL,}),//3
      new ExprNode({type:NodeTypes.OPERATOR,}),//4
    ];

    //configura parenteses
    this.symbols[1].nextMiddle = [this.symbols[3]];
    this.symbols[1].nextFinal = [this.symbols[2]];

    //configura signal
    this.symbols[3].nextFinal = [this.symbols[1], this.symbols[2]];

    //configura numero
    this.symbols[2].nextFinal = [this.symbols[3], this.symbols[4],];

    //configura operador
    this.symbols[4].nextFinal = [this.symbols[1]];

    this.startList = [this.symbols[3], this.symbols[1]];
    this.startSymbol = null;
    console.log("setupSymbols");
  }

	reset (  ) {
		this.expressionStrJS = "";
    this.expressionStr = "";
    this.expressionPhrase = "";
    this.expressionWrongStr = "";
    this.tokens = [];
    this.answer = "";
    this.terms = 0;
    this.level = 0;
    this.maxLevel = this.options.maxLevel || 3;
    this.maxTerms = this.options.maxTerms || 5;
    this.startSymbol = this.startList[RandInt(0, this.startList.length - 1)];
    console.log("reset");
	}

	doExpression () {
		let valid = false;
    this.stack = [];
    do {
      this.stack = [];
      this.reset();
      this.execute(this.startSymbol);
      valid = this.terms != this.maxTerms;
      if (valid) {
        try {
          eval(this.expressionStrJS);
        } 
        catch (e) {
          valid = false;
        }
      }
    }while (!valid);
    for (let s of this.stack) {
      console.log(s);
    }
    console.log("expressao gerada '"+this.expressionStrJS+"'")
		return this.expressionStrJS.length !== 0;
	}

  /**
	 * 
   * @brief constrói um numero em formato de strings.
   * 
	 */
  StrNumber() {
    return (String(RandInt(this.minNumberValue, this.maxNumberValue)));
  }

  /**
   * 
   * @brief gera uma string de sinal aleatório
   * @returns 
   */
  StrSignal() {
    if (this.onlyPositives)
      return "+";
    
    if (this.onlyNegatives)
      return "-";
    
    return  this.signal[RandInt(0, this.signal.length - 1)];
  }

  /**
   * 
   * @brief gera uma string de operador aleatório
   * @returns 
   */
  StrOperator() {
    return this.operators[RandInt(0, this.operators.length - 1)];
  }

  /**
   * 
   * @param {ExprNode} next 
   */
  execute(next) {
    switch (next.type) {
      case NodeTypes.NONE:
      case NodeTypes.END: {
        this.stack.push("Entrando no NONE/END");
        return;
        break;
      }
      case NodeTypes.PAREN: {
        this.level++;
        if (this.level > this.maxLevel)
          return;
        this.stack.push("Entrando no paren");
        this.expressionStrJS += "(";
        this.tokenProcessorCallback(this,"(", NodeTypes.PAREN);
        const middle = next.chooseNextMiddle();
        this.stack.push("  start paren");
        this.execute(middle);
        this.stack.push("  end paren");
        this.expressionStrJS += ")";
        this.tokenProcessorCallback(this,")", NodeTypes.PAREN);
        break;
      }
      case NodeTypes.NUMBER: {
        
        let genstr = this.StrNumber();
        this.stack.push("Entrando no NUMBER '"+genstr+"'");
        console.log("Entrando no NUMBER '"+genstr+"'");
        this.expressionStrJS += genstr;
        this.tokenProcessorCallback(this, genstr, next.type);
        this.terms++;
        if (this.terms > this.maxTerms)
          return;
        const n = next.chooseNextFinal();
        this.execute(n);
        break;
      }
      case NodeTypes.SIGNAL: {
        let genstr = this.StrSignal();
        this.stack.push("Entrando no signal '"+genstr+"'");
        console.log("Entrando no signal '"+genstr+"'");
        this.expressionStrJS += genstr;
        this.tokenProcessorCallback(this, genstr, next.type);
        const n = next.chooseNextFinal();
        this.stack.push("next = '"+n.type+"'");
        this.execute(n);
        break;
      }
      case NodeTypes.OPERATOR: {
        
        let genstr = this.StrOperator();
        this.stack.push("Entrando no operator '"+genstr+"'");
        this.expressionStrJS += genstr;
        this.tokenProcessorCallback(this, genstr, next.type);
        const n = next.chooseNextFinal();
        this.execute(n);
        break;
      }
    }
  }
}