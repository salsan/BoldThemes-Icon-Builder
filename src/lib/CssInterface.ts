export interface DeclarationsInterface {
    type: 'declaration';
    property: 'content';
    value: string;
  }

export interface RuleInterface {
    type: 'font-face' | 'rule';
    selectors: string[];
    declarations: DeclarationsInterface[];
  }

export interface StylesheetInterface {
    rules:RuleInterface[];
  }

export interface CssInterface {
    type: 'stylesheet';
     stylesheet: StylesheetInterface;
  }
