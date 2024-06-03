import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Service {
  name: string;
  price: number;
}

export interface Appointment {
  id: number;
  animalName: string;
  doctorName: string;
  date: string;
  services: Service[];
  diagnostic: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private appointmentsURL = 'http://localhost:8080/appointments';

  constructor(private http: HttpClient) { }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.appointmentsURL}/getAllAppointments`);
  }

  updateAppointment(id: number | undefined, appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.appointmentsURL}/update/${id}`, appointment);
  }
  addAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.appointmentsURL}/addAppointment`, appointment);
  }
}
