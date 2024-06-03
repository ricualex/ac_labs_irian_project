import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService, Appointment } from '../appointment.service';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./add-appointment.component.css']
})
export class AddAppointmentComponent {
  appointmentForm: FormGroup;

  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private fb: FormBuilder
  ) {
    this.appointmentForm = this.fb.group({
      animalName: [''],
      doctorName: [''],
      date: [''],
      services: [''],
      diagnostic: [''],
      status: ['']
    });
  }

  onSubmit(): void {
    const newAppointment: Appointment = {
      ...this.appointmentForm.value,
      services: this.appointmentForm.value.services.split(',').map((service: string) => service.trim())
    };
    this.appointmentService.addAppointment(newAppointment).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
