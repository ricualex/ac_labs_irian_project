import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService, Appointment } from '../appointment.service';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import {CommonModule} from "@angular/common";

interface Service {
  name: string;
  price: number;
}

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  styleUrls: ['./add-appointment.component.css']
})
export class AddAppointmentComponent {
  appointmentForm: FormGroup;
  serviceForm: FormGroup;
  services: Service[] = [
    { name: 'Consultation', price: 50 },
    { name: 'Vaccination', price: 100 },
    { name: 'Surgery', price: 1000 }
  ];

  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private fb: FormBuilder
  ) {
    this.appointmentForm = this.fb.group({
      animalName: ['', Validators.required],
      doctorName: ['', Validators.required],
      date: ['', Validators.required],
      selectedServices: this.fb.array([], Validators.required),
      diagnostic: [''],
      status: [{ value: 'creata', disabled: true }, Validators.required]
    });

    this.serviceForm = this.fb.group({
      serviceName: ['', Validators.required],
      servicePrice: ['', Validators.required]
    });
  }

  get selectedServices() {
    return this.appointmentForm.get('selectedServices') as FormArray;
  }

  onSubmit(): void {
    const newAppointment: Appointment = {
      ...this.appointmentForm.value,
      services: this.selectedServices.value,
      status: 'creata'
    };
    this.appointmentService.addAppointment(newAppointment).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  addService(): void {
    if (this.serviceForm.valid) {
      const newService: Service = {
        name: this.serviceForm.value.serviceName,
        price: this.serviceForm.value.servicePrice
      };
      this.services.push(newService);
      this.serviceForm.reset();
    }
  }

  onServiceChange(event: any, service: Service) {
    if (event.target.checked) {
      this.selectedServices.push(this.fb.group({ name: service.name, price: service.price }));
    } else {
      const index = this.selectedServices.controls.findIndex(x => x.value.name === service.name);
      this.selectedServices.removeAt(index);
    }
  }
}
