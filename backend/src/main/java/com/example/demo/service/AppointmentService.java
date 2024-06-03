package com.example.demo.service;

import com.example.demo.model.Appointment;
import com.example.demo.repository.AppointmentsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {
    private final AppointmentsRepository appointmentsRepository;

    @Autowired
    public AppointmentService(AppointmentsRepository appointmentsRepository) {
        this.appointmentsRepository = appointmentsRepository;
    }

    public Appointment addAppointment(Appointment appointment) {
        return appointmentsRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentsRepository.findAll();
    }

    public Appointment updateAppointment(Long id, Appointment appointmentDetails) {
        Optional<Appointment> existingAppointment = appointmentsRepository.findById(id);
        if (existingAppointment.isPresent()) {
            Appointment appointment = existingAppointment.get();
            appointment.setAnimalName(appointmentDetails.getAnimalName());
            appointment.setDoctorName(appointmentDetails.getDoctorName());
            appointment.setDate(appointmentDetails.getDate());
            appointment.setServices(appointmentDetails.getServices());
            appointment.setDiagnostic(appointmentDetails.getDiagnostic());
            appointment.setStatus(appointmentDetails.getStatus());
            return appointmentsRepository.save(appointment);
        }
        return null;
    }
}
