import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Laboratorio } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {
  private apiUrl = '/api/laboratorios';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.apiUrl);
  }

  getById(id: number): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(`${this.apiUrl}/${id}`);
  }

  create(laboratorio: Laboratorio): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(this.apiUrl, laboratorio);
  }

  update(id: number, laboratorio: Laboratorio): Observable<Laboratorio> {
    return this.http.put<Laboratorio>(`${this.apiUrl}/${id}`, laboratorio);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
