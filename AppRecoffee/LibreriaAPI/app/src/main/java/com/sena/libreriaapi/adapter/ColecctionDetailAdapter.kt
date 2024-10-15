package com.sena.libreriaapi.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.sena.libreriaapi.R

data class CollectionDetail(
    val id: Int,
    val kilo: Int,
    val stage: String,
    val personId: Int,
    val harvestId: Int,
    val state: Boolean
)

class CollectionDetailAdapter(
    private val collectionDetails: MutableList<CollectionDetail>,
    private val personNames: Map<Int, String>,
    private val harvestDates: Map<Int, String>
) : RecyclerView.Adapter<CollectionDetailAdapter.CollectionDetailViewHolder>() {

    class CollectionDetailViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val kilo: TextView = view.findViewById(R.id.textView_kilo)
        val stage: TextView = view.findViewById(R.id.textView_stage)
        val personName: TextView = view.findViewById(R.id.textView_person)
        val harvestDate: TextView = view.findViewById(R.id.textView_harvest)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CollectionDetailViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_collection_detail, parent, false)
        return CollectionDetailViewHolder(view)
    }

    override fun onBindViewHolder(holder: CollectionDetailViewHolder, position: Int) {
        val collectionDetail = collectionDetails[position]
        val personName = personNames[collectionDetail.personId] ?: "Persona no encontrada"
        val harvestDate = harvestDates[collectionDetail.harvestId] ?: "Cosecha no encontrada"

        holder.kilo.text = "Kilos: ${collectionDetail.kilo}"
        holder.stage.text = "Etapa: ${collectionDetail.stage}"
        holder.personName.text = "Persona: $personName"
        holder.harvestDate.text = "Recolección: $harvestDate"
    }

    override fun getItemCount(): Int {
        return collectionDetails.size
    }
}
