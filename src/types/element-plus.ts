import {ElForm, FormItemRule} from 'element-plus'

export type TElForm = InstanceType<typeof ElForm>

export type TFormRules = Record<string, FormItemRule[]>
