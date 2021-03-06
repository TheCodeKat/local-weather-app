import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators'
import { environment } from '../../environments/environment'

import { ICurrentWeather } from '../interfaces';
import { defaultPostalCode, PostalCodeService } from '../postal-code/postal-code.service';

export interface ICurrentWeatherData { 
  weather: [{
    description: string,
    icon: string
  }],
  main: {
    temp: number
  },
  sys: {
    country: string
  },
  dt: number,
  name: string
}

export interface IWeatherService {
  readonly currentWeather$: BehaviorSubject<ICurrentWeather>,
  getCurrentWeather(
  searchText: string, 
  country: string
  ): Observable<ICurrentWeather>,
  getCurrentWeatherByCoords(coords: GeolocationCoordinates): Observable<ICurrentWeather>,
  updateCurrentWeather(
    search: string,
    country?: string
  ): void
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService implements IWeatherService{
  readonly currentWeather$ =
    new BehaviorSubject<ICurrentWeather>({ 
    city: '--',
    country: '--',
    date: Date.now(),
    image: '',
    temperature: 0,
    description: '',
  })

  constructor(private httpClient: HttpClient, private postalCodeService: PostalCodeService) { }

  updateCurrentWeather(search: string, 
    country?: string): void { 
    this.getCurrentWeather(search, country)
      .subscribe(weather => 
        this.currentWeather$.next(weather)
      )
  }

  /** The searchText could be either a postal code or a city name
  * The resolvePostalCode() function makes a request to the API to see
  * if the code entered by the user is a valid postal code. If it is,
  * we'll get back the data about that postal code and we'll be able to getCurrentWeatherByCoords().
  * If it wasn't a valid postal code, e.g the API didn't return any results, we assume that the user entered
  * a city name instead and we perform a request to the Weather API.
  */
  getCurrentWeather(searchText: string, country?: string): Observable<ICurrentWeather> {
    return this.postalCodeService.resolvePostalCode(searchText).pipe(
      switchMap((postalCode) => {
        if (postalCode && postalCode !== defaultPostalCode) {
          return this.getCurrentWeatherByCoords({
            latitude: postalCode.lat,
            longitude: postalCode.lng,
          } as GeolocationCoordinates)
        } else {
          const uriParams = new HttpParams().set(
            'q',
            country ? `${searchText},${country}` : searchText
          )
          return this.getCurrentWeatherHelper(uriParams)
        }
      })
    )
  }

  getCurrentWeatherByCoords(coords: GeolocationCoordinates): Observable<ICurrentWeather> {
    const uriParams = new HttpParams()
        .set('lat', coords.latitude.toString())
        .set('lon', coords.longitude.toString())
      return this.getCurrentWeatherHelper(uriParams)
  }
  
  private getCurrentWeatherHelper(uriParams: HttpParams):
    Observable<ICurrentWeather> { 
    uriParams = uriParams.set('appid', environment.appId)
    return this.httpClient
      .get<ICurrentWeatherData>(
        `${environment.baseUrl}api.openweathermap.org/data/2.5/weather`,
        { params: uriParams } 
      )
      .pipe(map(data => this.transformToICurrentWeather(data)))
    }

  private transformToICurrentWeather(data: ICurrentWeatherData): ICurrentWeather {
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image:
`http://openweathermap.org/img/w/${data.weather[0].icon}.png`, 
      temperature: this.convertKelvinToFahrenheit(data.main.temp), 
      description: data.weather[0].description,
    }
  }
  private convertKelvinToFahrenheit(kelvin: number): number
  { 
    return kelvin * 9 / 5 - 459.67
  }

}
