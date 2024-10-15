package com.sena.libreriaapi.Entity

data class Farm(
    val name: String,
    val description: String,
    val sizeMeter: Int,
    val coordinate: String,
    val personId: Int,
    val cityId: Int,
    val id: Int,
    val state: Boolean
)
