import * as ST from './ST';
import * as CLS from './CLS';
import * as MNL from './MNL';
import {DataPayload} from 'store/dataSlice';

export const dataSources = {
  ST,
  CLS,
  MNL,
};

export const loadDataSource = (key: keyof typeof dataSources): DataPayload => {
  const source = dataSources[key];

  return {
    latestZveks: source.latestZveks,
    teamDetails: source.teamDetails,
    guildStatistic: source.guildStatistic,
  };
};
