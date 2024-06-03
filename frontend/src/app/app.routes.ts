import { Routes } from '@angular/router';
import { AppointmentsComponent } from './appointments/appointments.component';
import { EditAppointmentComponent } from './edit-appointment/edit-appointment.component';
import {AddAppointmentComponent} from "./add-appointment/add-appointment.component";

export const routes: Routes = [
  { path: '', component: AppointmentsComponent },
  { path: 'appointments/edit/:id', component: EditAppointmentComponent },
  { path: 'appointments/add', component: AddAppointmentComponent }
];
