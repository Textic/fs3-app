import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resultado } from '../models';
import { AuthService } from './auth';

@Injectable({
	providedIn: 'root'
})
export class ResultadoService {
	private apiUrl = 'http://localhost:8080/api/resultados';

	constructor(private http: HttpClient, private authService: AuthService) { }

	getAll(): Observable<Resultado[]> {
		return this.http.get<Resultado[]>(this.apiUrl, { headers: this.authService.getAuthHeaders() });
	}

	getById(id: number): Observable<Resultado> {
		return this.http.get<Resultado>(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
	}

	create(resultado: Resultado): Observable<Resultado> {
		return this.http.post<Resultado>(this.apiUrl, resultado, { headers: this.authService.getAuthHeaders() });
	}

	update(id: number, resultado: Resultado): Observable<Resultado> {
		return this.http.put<Resultado>(`${this.apiUrl}/${id}`, resultado, { headers: this.authService.getAuthHeaders() });
	}

	delete(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
	}

	getByPaciente(pacienteId: number): Observable<Resultado[]> {
		return this.http.get<Resultado[]>(`${this.apiUrl}/paciente/${pacienteId}`, { headers: this.authService.getAuthHeaders() });
	}
}
