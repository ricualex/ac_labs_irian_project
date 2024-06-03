import { Component, OnInit } from '@angular/core';
import { AppointmentService, Appointment } from '../appointment.service';
import { SavedSearchService } from '../saved-search.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  filterForm: FormGroup;
  savedSearchName: string = '';
  selectedSearchName: string = '';
  visibleColumns: { [key: string]: boolean } = {
    id: true,
    animalName: true,
    doctorName: true,
    date: true,
    services: true,
    diagnostic: true,
    status: true,
    actions: true
  };

  constructor(
    private appointmentService: AppointmentService,
    protected savedSearchService: SavedSearchService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      filterValue: [''],
      selectedValue: ['']
    });
  }

  ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe((data: Appointment[]) => {
      this.appointments = data;
      this.sortAppointmentsByDateDesc();
      this.filteredAppointments = this.appointments;
    });
  }

  sortAppointmentsByDateDesc(): void {
    this.appointments.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }

  applyFilters(): void {
    const filterValue = this.filterForm.get('filterValue')?.value;
    const selectedValue = this.filterForm.get('selectedValue')?.value;
    if (selectedValue && filterValue) {
      this.filteredAppointments = this.appointments.filter(appointment =>
        String((appointment as any)[selectedValue]).toLowerCase().includes(filterValue.toLowerCase())
      );
    } else {
      this.filteredAppointments = this.appointments;
    }
  }

  saveSearch(): void {
    const filters = {
      selectedValue: this.filterForm.get('selectedValue')?.value,
      filterValue: this.filterForm.get('filterValue')?.value
    };
    const sort = {};
    this.savedSearchService.saveSearch(this.savedSearchName, filters, sort);
  }

  loadSearch(name: string): void {
    const savedSearch = this.savedSearchService.getSearchByName(name);
    if (savedSearch) {
      this.filterForm.setValue({
        selectedValue: savedSearch.filters.selectedValue,
        filterValue: savedSearch.filters.filterValue
      });
      this.applyFilters();
    }
  }

  protected readonly Object = Object;
}
