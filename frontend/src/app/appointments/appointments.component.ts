import { Component, OnInit } from '@angular/core';
import { AppointmentService, Appointment } from '../appointment.service';
import { SavedSearchService } from '../saved-search.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from "@angular/router";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    NgForOf
  ],
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  filterForm: FormGroup;
  savedSearchName: string = '';
  selectedSearchName: string = '';

  constructor(
    private appointmentService: AppointmentService,
    protected savedSearchService: SavedSearchService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      doctorName: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe((data: Appointment[]) => {
      this.appointments = data;
      this.filteredAppointments = data;
    });
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    this.filteredAppointments = this.appointments.filter(appointment =>
      (!filters.doctorName || appointment.doctorName.includes(filters.doctorName)) &&
      (!filters.status || appointment.status === filters.status)
    );
  }

  saveSearch(): void {
    const filters = this.filterForm.value;
    const sort = {}; // Include sorting logic here if applicable
    this.savedSearchService.saveSearch(this.savedSearchName, filters, sort);
  }

  loadSearch(name: string): void {
    const savedSearch = this.savedSearchService.getSearchByName(name);
    if (savedSearch) {
      this.filterForm.setValue(savedSearch.filters);
      this.applyFilters();
      // Apply sorting logic if applicable
    }
  }
}
