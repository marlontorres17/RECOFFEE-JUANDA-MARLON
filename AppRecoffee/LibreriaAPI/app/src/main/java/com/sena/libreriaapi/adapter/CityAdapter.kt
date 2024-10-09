package com.sena.libreriaapi.adapter

import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import com.sena.libreriaapi.Entity.City

class CityAdapter(context: Context, cities: List<City>) :
    ArrayAdapter<City>(context, android.R.layout.simple_spinner_item, cities) {

    init {
        setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view: TextView = super.getView(position, convertView, parent) as TextView
        view.text = getItem(position)?.name
        return view
    }

    override fun getDropDownView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view: TextView = super.getDropDownView(position, convertView, parent) as TextView
        view.text = getItem(position)?.name
        return view
    }
}
