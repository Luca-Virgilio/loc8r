import { Injectable } from '@angular/core';
//  service taht makes HTTP request -> Promises
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from './home-list/home-list.component';
@Injectable({
  providedIn: 'root'
})
export class Loc8rDataService {

  constructor(private http: HttpClient) { }

  private apiBaseUrl = 'http://localhost:3000/api';

  public getLocations(lat: number, lng: number): Promise<Location[]> {

    // sett lng and lat for testing
    lng = -0.7992599;
    lat = 51.378091;
    const maxDistance: number = 20000;
    const url: string = `${this.apiBaseUrl}/locations?lng=${lng}&lat=${lat}&maxDistance=${maxDistance}`;
    //console.log(url);
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Location[])
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }

  public getLocationById(locationId: string): Promise<Location> {
    const url: string = `${this.apiBaseUrl}/locations/${locationId}`;
    //console.log(locationId);
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Location)
      .catch(this.handleError);
  }

  public addReviewByLocationId(locationId: string, formData: any): Promise<any> {
    const url: string = `${this.apiBaseUrl}/locations/${locationId}/reviews`;
    return this.http
    .post(url, formData)
    .toPromise()
    .then(response => response as any)
    .catch(this.handleError);
    }

}
