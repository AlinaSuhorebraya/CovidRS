import './style.scss';
import DataService from './services/data.service';
import AppService from './services/app.service';

const app = new AppService();

Promise.all([DataService.getCOVIDData(), DataService.getCountryData()]).then(([{ covidInfo, date }, { countryInfo }]) =>{
  app.covidInfo = covidInfo;
  app.date = date;
  app.countriesInfo = countryInfo;
  app.generateGeneralInfo();
  app.render();
  app.initEvents();
});
