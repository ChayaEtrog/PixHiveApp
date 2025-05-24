import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemStatisticsDto, UserStatisticsDto } from '../types/UserGrowth';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  
  private apiUrl = 'https://pixhiveapp-production.up.railway.app/api/Statistics';

  constructor(private http: HttpClient) { }

  getUserStatistics(): Observable<UserStatisticsDto[]> {
    return this.http.get<any>(`${this.apiUrl}/user-statistics`);
  }

  getSystemStatistics(): Observable<SystemStatisticsDto> {
    return this.http.get<any>(`${this.apiUrl}/system-statistics`);
  }
}
