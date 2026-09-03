import en from './localization/EN';
import uk from './localization/UK';
import ru from './localization/RU';
import {LocalizationObjProps} from 'services/GlobalUtils';

const localizationObj = {en, uk, ru} as LocalizationObjProps;
export const localization = (language: string) => localizationObj[language];

export interface FormState {
  date: string;
  total: string;
  rate: string;
  newbies: string;
}

export const INITIAL_FORM_STATE: FormState = {
  date: '',
  total: '',
  rate: '',
  newbies: '',
};

export const DATE_REGEX = /^(0[1-9]|1[0-2])\.\d{2}$/;
