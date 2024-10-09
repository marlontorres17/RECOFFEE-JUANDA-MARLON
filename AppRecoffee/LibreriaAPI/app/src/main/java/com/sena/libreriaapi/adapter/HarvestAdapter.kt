package com.sena.libreriaapi.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.sena.libreriaapi.R

data class Harvest(
    val id: Int,
    val date: String,
    val kiloPrice: Double,
    val lotId: Int,
    val state: Boolean
)

class HarvestAdapter(
    private val harvests: MutableList<Harvest>,
    private val lotNames: Map<Int, String>,
    private val onDeleteClick: (Harvest) -> Unit
) : RecyclerView.Adapter<HarvestAdapter.HarvestViewHolder>() {

    class HarvestViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val lotName: TextView = view.findViewById(R.id.textView_lot)
        val date: TextView = view.findViewById(R.id.textView_date)
        val kiloPrice: TextView = view.findViewById(R.id.textView_kilo_price)
        val deleteButton: ImageButton = view.findViewById(R.id.button_delete)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): HarvestViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_harvest, parent, false)
        return HarvestViewHolder(view)
    }

    override fun onBindViewHolder(holder: HarvestViewHolder, position: Int) {
        val harvest = harvests[position]
        val lotName = lotNames[harvest.lotId] ?: "Lote no encontrado"

        holder.lotName.text = "Lote: $lotName"
        holder.date.text = "Fecha: ${harvest.date}"
        holder.kiloPrice.text = "Precio por Kilo: ${harvest.kiloPrice}"

        holder.deleteButton.setOnClickListener {
            onDeleteClick(harvest)
        }
    }

    override fun getItemCount(): Int {
        return harvests.size
    }

    fun removeHarvest(harvest: Harvest) {
        val position = harvests.indexOf(harvest)
        if (position != -1) {
            harvests.removeAt(position)
            notifyItemRemoved(position)
        }
    }
}
