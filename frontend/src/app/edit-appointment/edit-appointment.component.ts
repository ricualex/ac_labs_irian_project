import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService, Appointment } from '../appointment.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./edit-appointment.component.css']
})
export class EditAppointmentComponent implements OnInit {
  appointmentForm: FormGroup;
  appointmentId: number | undefined;
  errorMessage: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private fb: FormBuilder
  ) {
    this.appointmentForm = this.fb.group({
      animalName: ['', Validators.required],
      doctorName: ['', Validators.required],
      date: ['', Validators.required],
      services: ['', Validators.required],
      diagnostic: [''],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.errorMessage = '';
    this.appointmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.appointmentService.getAppointments().subscribe((appointments: Appointment[]) => {
      const appointment = appointments.find(app => app.id === this.appointmentId);
      if (appointment) {
        this.appointmentForm.patchValue({
          animalName: appointment.animalName,
          doctorName: appointment.doctorName,
          date: appointment.date,
          services: appointment.services.join(', '),
          diagnostic: appointment.diagnostic,
          status: appointment.status
        });
      }
    });
  }

  onSubmit(): void {
    const updatedAppointment: Appointment = {
      id: this.appointmentId,
      ...this.appointmentForm.value,
      services: this.appointmentForm.value.services.split(',').map((service: string) => service.trim())
    };

    if (updatedAppointment.status === "incheiata" && !updatedAppointment.diagnostic.trim()) {
      this.errorMessage = "O programare poate fi trecuta in statusul “incheiata” doar daca a fost completat campul de diagnostic!";
      return;
    }

    this.appointmentService.updateAppointment(this.appointmentId, updatedAppointment).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
