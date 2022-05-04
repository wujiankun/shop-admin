import {ElForm} from 'element-plus'

import {
  InternalRuleItem,
  Rule,
  RuleType,
  SyncValidateResult,
  ValidateOption,
  Value,
  Values
} from 'async-validator/dist-types/interface';

export type TElForm = InstanceType<typeof ElForm>

export interface RuleItem {
  type?: RuleType;
  required?: boolean;
  pattern?: RegExp | string;
  min?: number;
  max?: number;
  len?: number;
  enum?: Array<string | number | boolean | null | undefined>;
  whitespace?: boolean;
  fields?: Record<string, Rule>;
  options?: ValidateOption;
  defaultField?: Rule;
  transform?: (value: Value) => Value;
  message?: string | ((a?: string) => string);
  asyncValidator?: (rule: InternalRuleItem, value: Value, callback: (error?: string | Error) => void, source: Values, options: ValidateOption) => void | Promise<void>;
  validator?: (rule: InternalRuleItem, value: Value, callback: (error?: string | Error) => void, source: Values, options: ValidateOption) => SyncValidateResult | void;
}

export type TFormRules = Record<string, RuleItem[]>
