import { Component, OnInit } from '@angular/core';
import { AppointmentService, Appointment } from '../appointment.service';
import { SavedSearchService } from '../saved-search.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgForOf,
    RouterLink
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
  filterValue: string = '';

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
    const filterValue = this.filterForm.get("filterValue")?.value;
    if (this.selectedValue && filterValue) {
      this.filteredAppointments = this.appointments.filter(appointment =>
        String((appointment as Partial<Appointment> & { [key: string]: any })[this.selectedValue]).toLowerCase().includes(filterValue.toLowerCase())
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
    const sort = {}; // Include sorting logic here if applicable
    this.savedSearchService.saveSearch(this.savedSearchName, filters, sort);
  }

  loadSearch(name: string): void {
    const savedSearch = this.savedSearchService.getSearchByName(name);
    if (savedSearch) {
      this.selectedValue = savedSearch.filters.selectedValue;
      this.filterForm.setValue({ filterValue: savedSearch.filters.filterValue });
      this.applyFilters();
      // Apply sorting logic if applicable
    }
  }
}
