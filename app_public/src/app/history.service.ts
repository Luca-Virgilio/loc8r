import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private urls: string[] = [];
  constructor(private router: Router) {
    this.router.events
      .pipe(filter(routerEvent => routerEvent instanceof NavigationEnd))
      .subscribe((routerEvent: NavigationEnd) => {
        const url = routerEvent.urlAfterRedirects;
        this.urls = [...this.urls, url];
      });
  }

  public getPreviousUrl(): string {
    const length = this.urls.length;
    //return length > 1 ? this.urls[length – 2] : '/';
    if (length > 1) {
      return this.urls[length - 2];
    } else {
      return '/';
    }
  }
  public getLastNonLoginUrl(): string {
    const exclude: string[] = ['/register', '/login'];
    const filtered = this.urls.filter(url => !exclude.includes(url));
    const length = filtered.length;
    //console.log(this.urls);
    //return length > 1 ? filtered[length – 1] : '/';
    if (length>1){
      return filtered[length - 1];
    }else {
      return '/';
    }
    }
}
