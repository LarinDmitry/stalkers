import en from './localization/EN';
import uk from './localization/UK';
import ru from './localization/RU';
import {LocalizationObjProps} from 'services/GlobalUtils';

const localizationObj = {en, uk, ru} as LocalizationObjProps;
export const localization = (language: string) => localizationObj[language];
