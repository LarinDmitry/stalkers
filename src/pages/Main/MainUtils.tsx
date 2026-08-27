import en from './localization/EN';
import uk from './localization/UK';
import ru from './localization/RU';
import {LocalizationObjProps} from 'services/GlobalUtils';
import {UserSortField} from 'api/users';

const localizationObj = {en, uk, ru} as LocalizationObjProps;
export const localization = (language: string) => localizationObj[language];

export const backgroundColor = [
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 206, 86)',
  'rgb(75, 192, 192)',
  'rgb(153, 102, 255)',
  'rgb(255, 159, 64)',
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 206, 86)',
  'rgb(75, 192, 192)',
  'rgb(153, 102, 255)',
  'rgb(255, 159, 64)',
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 206, 86)',
  'rgb(75, 192, 192)',
  'rgb(153, 102, 255)',
  'rgb(255, 159, 64)',
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
];

export const hoverBackgroundColor = [
  'rgb(255, 69, 132)',
  'rgb(54, 132, 235)',
  'rgb(255, 176, 86)',
  'rgb(75, 162, 192)',
  'rgb(153, 72, 255)',
  'rgb(255, 129, 64)',
  'rgb(255, 69, 132)',
  'rgb(54, 132, 235)',
  'rgb(255, 176, 86)',
  'rgb(75, 162, 192)',
  'rgb(153, 72, 255)',
  'rgb(255, 129, 64)',
  'rgb(255, 69, 132)',
  'rgb(54, 132, 235)',
  'rgb(255, 176, 86)',
  'rgb(75, 162, 192)',
  'rgb(153, 72, 255)',
  'rgb(255, 129, 64)',
  'rgb(255, 69, 132)',
  'rgb(54, 132, 235)',
];

export const TABLE_KEY_TO_SORT_FIELD: Record<string, UserSortField> = {
  name: UserSortField.NAME,
  quality: UserSortField.QUALITY,
  gey: UserSortField.STARS,
  temple: UserSortField.TEMPLE,
  hero: UserSortField.DAMAGE_DEALER,
};
