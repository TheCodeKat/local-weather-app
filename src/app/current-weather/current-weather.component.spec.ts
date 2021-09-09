import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { CurrentWeatherComponent } from './current-weather.component';
import { WeatherService } from '../weather/weather.service';
import { WeatherServiceFake } from '../weather/weather.service.fake';
import { fakeWeather } from '../weather/weather.service.fake'
import { injectSpy } from 'angular-unit-test-helper';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('CurrentWeatherComponent', () => {
  let component: CurrentWeatherComponent;
  let fixture: ComponentFixture<CurrentWeatherComponent>;
  let weatherServiceMock: jasmine.SpyObj<WeatherService>
});
