import en from './localization/EN';
import uk from './localization/UK';
import ru from './localization/RU';
import {ZeroDamagePlayer} from './components/ZeroDamage';
import {LocalizationObjProps} from 'services/GlobalUtils';
import {useAppSelector} from 'services/hooks';
import {selectDataConfiguration} from 'store/dataSlice';

const localizationObj = {en, uk, ru} as LocalizationObjProps;
export const localization = (language: string) => localizationObj[language];

export const calculateGini = (damages: number[]) =>
  damages.reduce((sum, x) => sum + damages.reduce((innerSum, y) => innerSum + Math.abs(x - y), 0), 0) /
  ((2 * damages.length ** 2 * damages.reduce((sum, damage) => sum + damage, 0)) / damages.length);

export const zeroDamagePlayers = () => {
  const {latestZveks} = useAppSelector(selectDataConfiguration);

  return latestZveks.reduce((acc: ZeroDamagePlayer[], {name, info}) => {
    const zeroDays = info[info.length - 1]?.damageByDay.reduce<number[]>((days, damage, idx) => {
      damage === 0 && days.push(idx + 1);
      return days;
    }, []);

    zeroDays.length > 0 && acc.push({name, zeroDays});
    return acc;
  }, []);
};
