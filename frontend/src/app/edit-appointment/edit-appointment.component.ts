import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService, Appointment } from '../appointment.service';
import {FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from "@angular/common";

interface Service {
  name: string;
  price: number;
}

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
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
      services: this.fb.array([], Validators.required),
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
          diagnostic: appointment.diagnostic,
          status: appointment.status
        });

        const serviceControls = appointment.services.map(service => this.fb.group({
          name: [service.name, Validators.required],
          price: [service.price, Validators.required]
        }));
        const serviceFormArray = this.fb.array(serviceControls);
        this.appointmentForm.setControl('services', serviceFormArray);
      }
    });
  }

  get services(): FormArray {
    return this.appointmentForm.get('services') as FormArray;
  }

  onSubmit(): void {
    const updatedAppointment: Appointment = {
      id: this.appointmentId,
      ...this.appointmentForm.value,
      services: this.services.value
    };

    if (updatedAppointment.status === "incheiata" && !updatedAppointment.diagnostic.trim()) {
      this.errorMessage = "O programare poate fi trecuta in statusul “incheiata” doar daca a fost completat campul de diagnostic!";
      return;
    }

    this.appointmentService.updateAppointment(this.appointmentId, updatedAppointment).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  addService(): void {
    this.services.push(this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required]
    }));
  }

  removeService(index: number): void {
    this.services.removeAt(index);
  }
}
