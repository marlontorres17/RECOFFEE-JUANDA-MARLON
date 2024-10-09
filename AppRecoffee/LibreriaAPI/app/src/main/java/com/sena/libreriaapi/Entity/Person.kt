package com.sena.libreriaapi.Entity

data class Person(
    val firstName: String,
    val secondName: String,
    val firstLastName: String,
    val secondLastName: String,
    val email: String,
    val dateOfBirth: String,
    val gender: String,
    val cityId: Int,
    val typeDocument: String,
    val numberDocument: String,
    val id: Int,
    val state: Boolean
)