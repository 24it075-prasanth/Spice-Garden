package com.spicegarden.controller;

import com.spicegarden.entity.Reservation;
import com.spicegarden.repository.ReservationRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin
public class ReservationController {

    private final ReservationRepository reservationRepository;

    public ReservationController(
            ReservationRepository reservationRepository) {

        this.reservationRepository = reservationRepository;
    }

    // GET ALL RESERVATIONS
    @GetMapping
    public List<Reservation> getAllReservations() {

        return reservationRepository.findAll();
    }

    // GET ONE RESERVATION
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(
            @PathVariable Long id) {

        return reservationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE RESERVATION
    @PostMapping
    public Reservation createReservation(
            @RequestBody Reservation reservation) {

        reservation.setStatus("PENDING");

        return reservationRepository.save(reservation);
    }

    @PutMapping("/{id}/status")
public ResponseEntity<Reservation> updateStatus(
        @PathVariable Long id,
        @RequestParam String status) {

    return reservationRepository.findById(id)
            .map(reservation -> {

                reservation.setStatus(status);

                Reservation updated =
                        reservationRepository.save(reservation);

                return ResponseEntity.ok(updated);

            })
            .orElse(ResponseEntity.notFound().build());
}
}