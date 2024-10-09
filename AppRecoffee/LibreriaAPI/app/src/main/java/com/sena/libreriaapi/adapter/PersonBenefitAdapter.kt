package com.sena.libreriaapi.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.sena.libreriaapi.R

data class PersonBenefit(
    val id: Int,
    val date: String,
    val price: Double,
    val amount: Int,
    val personId: Int,
    val benefitId: Int,
    val state: Boolean
)

class PersonBenefitAdapter(
    private val personBenefits: MutableList<PersonBenefit>,
    private val personNames: Map<Int, String>,
    private val benefitNames: Map<Int, String>
) : RecyclerView.Adapter<PersonBenefitAdapter.PersonBenefitViewHolder>() {

    class PersonBenefitViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val personName: TextView = view.findViewById(R.id.textView_person)
        val benefitName: TextView = view.findViewById(R.id.textView_benefit)
        val date: TextView = view.findViewById(R.id.textView_date)
        val price: TextView = view.findViewById(R.id.textView_price)
        val amount: TextView = view.findViewById(R.id.textView_amount)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PersonBenefitViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_person_benefit, parent, false)
        return PersonBenefitViewHolder(view)
    }

    override fun onBindViewHolder(holder: PersonBenefitViewHolder, position: Int) {
        val personBenefit = personBenefits[position]
        val personName = personNames[personBenefit.personId] ?: "Persona no encontrada"
        val benefitName = benefitNames[personBenefit.benefitId] ?: "Beneficio no encontrado"

        holder.personName.text = "Persona: $personName"
        holder.benefitName.text = "Beneficio: $benefitName"
        holder.date.text = "Fecha: ${personBenefit.date}"
        holder.price.text = "Precio: ${personBenefit.price}"
        holder.amount.text = "Cantidad: ${personBenefit.amount}"
    }

    override fun getItemCount(): Int {
        return personBenefits.size
    }
}
