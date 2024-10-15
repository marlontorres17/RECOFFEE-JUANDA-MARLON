package com.sena.libreriaapi.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.sena.libreriaapi.R

data class Lot(
    val id: Int,
    val name: String,
    val description: String,
    val sizeMeters: Int,
    val farmId: Int,
    val state: Boolean
)

class LotAdapter(
    private val lots: MutableList<Lot>,
    private val farmNames: Map<Int, String>
) : RecyclerView.Adapter<LotAdapter.LotViewHolder>() {

    class LotViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val name: TextView = view.findViewById(R.id.textView_lot_name)
        val description: TextView = view.findViewById(R.id.textView_lot_description)
        val sizeMeters: TextView = view.findViewById(R.id.textView_lot_size)
        val farmName: TextView = view.findViewById(R.id.textView_farm_name)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LotViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_lot, parent, false)
        return LotViewHolder(view)
    }

    override fun onBindViewHolder(holder: LotViewHolder, position: Int) {
        val lot = lots[position]
        val farmName = farmNames[lot.farmId] ?: "Finca no encontrada"

        holder.name.text = "Nombre: ${lot.name}"
        holder.description.text = "Descripción: ${lot.description}"
        holder.sizeMeters.text = "Tamaño: ${lot.sizeMeters} m²"
        holder.farmName.text = "Finca: $farmName"
    }

    override fun getItemCount(): Int {
        return lots.size
    }
}
