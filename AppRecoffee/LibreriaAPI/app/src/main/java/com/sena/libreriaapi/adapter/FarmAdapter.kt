package com.sena.libreriaapi.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.sena.libreriaapi.R

data class Farm(
    val id: Int,
    val name: String,
    val description: String,
    val sizeMeter: Int,
    val coordinate: String,
    val codeUnique: String,
    val personId: Int,
    val cityId: Int,
    val state: Boolean
)

class FarmAdapter(
    private val farms: MutableList<Farm>,
    private val personNames: Map<Int, String>,
    private val cityNames: Map<Int, String>
) : RecyclerView.Adapter<FarmAdapter.FarmViewHolder>() {

    class FarmViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val name: TextView = view.findViewById(R.id.textView_farm_name)
        val description: TextView = view.findViewById(R.id.textView_farm_description)
        val sizeMeter: TextView = view.findViewById(R.id.textView_farm_size)
        val coordinate: TextView = view.findViewById(R.id.textView_farm_coordinate)
        val codeUnique: TextView = view.findViewById(R.id.textView_farm_code)
        val personName: TextView = view.findViewById(R.id.textView_person_name)
        val cityName: TextView = view.findViewById(R.id.textView_city_name)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): FarmViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_farm, parent, false)
        return FarmViewHolder(view)
    }

    override fun onBindViewHolder(holder: FarmViewHolder, position: Int) {
        val farm = farms[position]
        val personName = personNames[farm.personId] ?: "Persona no encontrada"
        val cityName = cityNames[farm.cityId] ?: "Ciudad no encontrada"

        holder.name.text = "Nombre: ${farm.name}"
        holder.description.text = "Descripción: ${farm.description}"
        holder.sizeMeter.text = "Tamaño: ${farm.sizeMeter} m²"
        holder.coordinate.text = "Coordenadas: ${farm.coordinate}"
        holder.codeUnique.text = "Código de la finca: ${farm.codeUnique}"
        holder.personName.text = "Administrador: $personName"
        holder.cityName.text = "Ciudad: $cityName"
    }

    override fun getItemCount(): Int {
        return farms.size
    }
}
