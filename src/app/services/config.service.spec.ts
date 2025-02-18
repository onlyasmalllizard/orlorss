import {TestBed, waitForAsync} from '@angular/core/testing';
import { ConfigService } from './config.service';
import {HttpClient} from "@angular/common/http";
import {httpClientMock} from "../utils/testing/service-mocks/http-client.mock";
import {configResponse} from "../utils/testing/responses/config.response";

const httpClient = httpClientMock(configResponse);

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClient }
      ]
    });
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getConfig', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should make a http request for config json if the sessionStorage config key is empty', waitForAsync(() => {
      sessionStorage.clear();

      service.getConfig().subscribe({
        next: config => {
          expect(httpClient.get).toHaveBeenCalled();
          expect(config).toEqual(configResponse)
        },
        error: e => fail(e)
      })
    }));

    it('should return the correct config json if it has already been set', waitForAsync(() => {
      sessionStorage.setItem('config', JSON.stringify(configResponse));

      service.getConfig().subscribe({
        next: config => {
          expect(httpClient.get).not.toHaveBeenCalled();
          expect(config).toEqual(configResponse);
        },
        error: e => fail(e)
      });
    }));
  });
});
