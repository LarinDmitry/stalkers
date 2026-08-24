import en from './localization/EN';
import uk from './localization/UK';
import ru from './localization/RU';
import {ZeroDamagePlayer} from './components/ZeroDamage';
import {useQuery} from '@tanstack/react-query';
import {getAllUsersDamage} from 'api/user-damage';
import {LocalizationObjProps} from 'services/GlobalUtils';

const localizationObj = {en, uk, ru} as LocalizationObjProps;
export const localization = (language: string) => localizationObj[language];

export const calculateGini = (damages: number[]) =>
  damages.reduce((sum, x) => sum + damages.reduce((innerSum, y) => innerSum + Math.abs(x - y), 0), 0) /
  ((2 * damages.length ** 2 * damages.reduce((sum, damage) => sum + damage, 0)) / damages.length);

export const useZeroDamagePlayers = (): ZeroDamagePlayer[] => {
  const {data: latestZveks = []} = useQuery({
    queryKey: ['allUsersDamage'],
    queryFn: getAllUsersDamage,
  });

  return latestZveks.reduce((acc: ZeroDamagePlayer[], {name, info}) => {
    const lastInfo = info[info.length - 1];
    if (!lastInfo?.damageByDay) return acc;

    const zeroDays = lastInfo.damageByDay.reduce<number[]>((days, damage, idx) => {
      if (damage === 0) days.push(idx + 1);
      return days;
    }, []);

    if (zeroDays.length > 0) {
      acc.push({name, zeroDays});
    }
    return acc;
  }, []);
};
