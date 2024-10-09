package com.sena.libreriaapi.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.sena.libreriaapi.R

data class Benefit(
    val id: Int,
    val name: String,
    val description: String,
    val cost: Double,
    val farmId: Int,
    val state: Boolean
)

class BenefitAdapter(
    private val benefits: MutableList<Benefit>,
    private val farmNames: Map<Int, String>
) : RecyclerView.Adapter<BenefitAdapter.BenefitViewHolder>() {

    class BenefitViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val name: TextView = view.findViewById(R.id.textView_name)
        val description: TextView = view.findViewById(R.id.textView_description)
        val cost: TextView = view.findViewById(R.id.textView_cost)
        val farmName: TextView = view.findViewById(R.id.textView_farm)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BenefitViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_benefit, parent, false)
        return BenefitViewHolder(view)
    }

    override fun onBindViewHolder(holder: BenefitViewHolder, position: Int) {
        val benefit = benefits[position]
        val farmName = farmNames[benefit.farmId] ?: "Granja no encontrada"

        holder.name.text = "Nombre: ${benefit.name}"
        holder.description.text = "Descripción: ${benefit.description}"
        holder.cost.text = "Costo: ${benefit.cost}"
        holder.farmName.text = "Finca: $farmName"
    }

    override fun getItemCount(): Int {
        return benefits.size
    }
}
