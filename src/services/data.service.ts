export interface CovidData {
  Country: string;
  NewConfirmed: number;
  NewDeaths: number;
  NewRecovered: number;
  TotalConfirmed: number;
  TotalDeaths: number;
  TotalRecovered: number;
}

export interface CountryData {
  name: string;
  flag: string;
  population: number;
}

export default class DataService {
  static getCOVIDData(): Promise<{ date: string; covidInfo: CovidData[] }> {
    return fetch(`https://api.covid19api.com/summary`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(({ Countries, Global }) => {
        let covidInfo: CovidData[] = [];
        let date: string = '';

        covidInfo = Countries.map(
          ({ Country, NewConfirmed, TotalConfirmed, NewDeaths, TotalDeaths, NewRecovered, TotalRecovered }: CovidData) => {
            return {
              Country,
              NewConfirmed,
              TotalConfirmed,
              NewDeaths,
              TotalDeaths,
              NewRecovered,
              TotalRecovered,
            };
          }
        );

        covidInfo.push({
          Country: 'World',
          NewConfirmed: Global.NewConfirmed,
          TotalConfirmed: Global.TotalConfirmed,
          NewDeaths: Global.NewDeaths,
          TotalDeaths: Global.TotalDeaths,
          NewRecovered: Global.NewRecovered,
          TotalRecovered: Global.TotalRecovered,
        });

        date = Countries[0].Date;
        return { date, covidInfo };
      })
      .catch((err) => {
        console.log('Fetch Error :', err);
        return { date: '', covidInfo: [] };
      });
  }

  static getCountryData(): Promise<{ countryInfo: CountryData[] }> {
    return fetch(`https://restcountries.eu/rest/v2/all?fields=name;population;flag`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((CountryData) => {
        return { countryInfo: CountryData };
      })
      .catch((err) => {
        console.log('Fetch Error :', err);
        return { countryInfo: [] };
      });
  }
}
