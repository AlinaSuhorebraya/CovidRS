import AppService, { ratio, status, timePeriod } from './app.service';
import { CountryData, CovidData } from './data.service';

describe('AppService Test', () => {
  describe('GlobalDataChangeMethods', () => {
    const covidInfo: CovidData[] = [];
    const date = new Date().toString();
    const countryInfo: CountryData[] = [];
    const appService = new AppService();

    it('should change country', () => {
      appService.changeCountry('Belarus');
      expect(appService.currentCountry).toEqual('Belarus');
    });

    it('should change status', () => {
      appService.changeStatus(1);
      expect(appService.status).toEqual(status.Deaths);
    });

    it('should change period', () => {
      appService.changePeriod(timePeriod.ByDay);
      expect(appService.timePeriod).toEqual(timePeriod.ByDay);
    });

    it('should change ratio', () => {
      appService.changeRatio(ratio.Relative);
      expect(appService.ratio).toEqual(ratio.Relative);
    });
  });
});
