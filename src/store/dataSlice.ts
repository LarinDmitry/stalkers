import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from 'services/reduxStore';
import {loadDataSource} from 'src/data';

interface TeamDetails {
  name: string;
  damageDealer: string;
  quality: string;
  stars: number;
  temple: number;
}

export interface LatestZveks {
  name: string;
  info: {
    date: string;
    damage: number;
    guildTotal: number;
    damageByDay: number[];
  }[];
}

export interface GuildStatistic {
  date: string;
  total: number;
  rate: number;
  newbies: number;
}

export type DataSource = 'ST' | 'CLS';

export interface DataState {
  latestZveks: LatestZveks[];
  teamDetails: TeamDetails[];
  guildStatistic: GuildStatistic[];
  selectedSource: DataSource;
}

export type DataPayload = Omit<DataState, 'selectedSource'>;

const initialState: DataState = {
  ...loadDataSource('ST'),
  selectedSource: 'ST',
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setDataSource: (state, action: PayloadAction<DataSource>) => {
      const data = loadDataSource(action.payload);
      state.latestZveks = data.latestZveks;
      state.teamDetails = data.teamDetails;
      state.guildStatistic = data.guildStatistic;
      state.selectedSource = action.payload;
    },
  },
});

export const selectDataConfiguration = (state: RootState) => state.data;

export const {
  actions: {setDataSource},
} = dataSlice;

export default dataSlice.reducer;
