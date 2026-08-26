import {heroImages, qualityImages} from 'services/GlobalUtils';
import {CreateUserPayload} from 'api/users';
import en from './localization/EN';
import uk from './localization/UK';
import ru from './localization/RU';
import {LocalizationObjProps} from 'services/GlobalUtils';

const localizationObj = {en, uk, ru} as LocalizationObjProps;
export const localization = (language: string) => localizationObj[language];

export const QUALITY_OPTIONS = Object.keys(qualityImages).filter((key) => key !== '');
export const HERO_OPTIONS = Object.keys(heroImages);

export const INITIAL_USER_FORM: CreateUserPayload = {
  name: '',
  damageDealer: HERO_OPTIONS[0],
  quality: QUALITY_OPTIONS[0],
  stars: 16,
  temple: 16,
  isActive: true,
};