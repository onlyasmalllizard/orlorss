import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, of, shareReplay, tap} from "rxjs";
import {Config} from "../models/config.model";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Checks whether we have saved the config in session storage. If we have, returns that. Otherwise, gets the
   * config from the json file and stores it in session storage before returning it.
   */
  public getConfig(): Observable<Config> {
    let config: Config;
    const storedConfig = sessionStorage.getItem('config');

    if (storedConfig) {
      config = JSON.parse(storedConfig) as Config;
    }

    // @ts-expect-error Typescript doesn't like that config might not have been initialised, but the if statement
    // specifically checks for this
    if (config) {
      return of(config);
    } else {
      return this.http.get('assets/config/config.json').pipe(
        map(conf => conf as unknown as Config),
        tap(conf => sessionStorage.setItem('config', JSON.stringify(conf))),
        shareReplay(1)
      );
    }
  }

  /** Getter: Base url for the api */
  public get apiBaseUrl(): Observable<string> {
    return this.getConfig().pipe(map(config => config.apiBaseUrl));
  }
}
