package com.sena.libreriaapi.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.sena.libreriaapi.R

data class Liquidation(
    val id: Int, // Campo id agregado
    val totalKilo: Double,
    val totalBenefit: Double,
    val totalPay: Double,
    val personId: Int
)

class LiquidationAdapter(
    private val liquidations: MutableList<Liquidation>, // Mutable list to allow removal
    private val personNames: Map<Int, String>,
    private val onDeleteClick: (Liquidation) -> Unit // Lambda to handle deletion
) : RecyclerView.Adapter<LiquidationAdapter.LiquidationViewHolder>() {

    class LiquidationViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val personName: TextView = view.findViewById(R.id.textView_person)
        val totalKilos: TextView = view.findViewById(R.id.textView_total_kilos)
        val totalBenefit: TextView = view.findViewById(R.id.textView_total_benefit)
        val totalPay: TextView = view.findViewById(R.id.textView_total_pay)
        val deleteButton: ImageButton = view.findViewById(R.id.button_delete) // Botón de eliminar
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LiquidationViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_liquidation, parent, false)
        return LiquidationViewHolder(view)
    }

    override fun onBindViewHolder(holder: LiquidationViewHolder, position: Int) {
        val liquidation = liquidations[position]
        val personName = personNames[liquidation.personId] ?: "Persona no encontrada"

        holder.personName.text = "Persona: $personName"
        holder.totalKilos.text = "Total Kilos: ${liquidation.totalKilo}"
        holder.totalBenefit.text = "Total Beneficios: ${liquidation.totalBenefit}"
        holder.totalPay.text = "Total Pago: ${liquidation.totalPay}"

        // Configurar el evento de clic en el botón de eliminar
        holder.deleteButton.setOnClickListener {
            onDeleteClick(liquidation)
        }
    }

    override fun getItemCount(): Int {
        return liquidations.size
    }

    // Método para eliminar un item del adaptador
    fun removeLiquidation(liquidation: Liquidation) {
        val position = liquidations.indexOf(liquidation)
        if (position != -1) {
            liquidations.removeAt(position)
            notifyItemRemoved(position)
        }
    }
}
