import { Component, OnInit } from '@angular/core';
import { AppointmentService, Appointment } from '../appointment.service';
import { SavedSearchService } from '../saved-search.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  filterForm: FormGroup;
  savedSearchName: string = '';
  selectedSearchName: string = '';
  selectedValue: string = '';
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
      filterValue: ['']
    });
  }

  ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe((data: Appointment[]) => {
      this.appointments = data;
      this.filteredAppointments = data;
    });
  }

  applyFilters(): void {
    const filterValue = this.filterForm.get('filterValue')?.value;
    if (this.selectedValue && filterValue) {
      this.filteredAppointments = this.appointments.filter(appointment =>
        String((appointment as any)[this.selectedValue]).toLowerCase().includes(filterValue.toLowerCase())
      );
    } else {
      this.filteredAppointments = this.appointments;
    }
  }

  saveSearch(): void {
    const filters = {
      selectedValue: this.selectedValue,
      filterValue: this.filterForm.get('filterValue')?.value
    };
    const sort = {};
    this.savedSearchService.saveSearch(this.savedSearchName, filters, sort);
  }

  loadSearch(name: string): void {
    const savedSearch = this.savedSearchService.getSearchByName(name);
    if (savedSearch) {
      this.selectedValue = savedSearch.filters.selectedValue;
      this.filterForm.setValue({ filterValue: savedSearch.filters.filterValue });
      this.applyFilters();
    }
  }
}
