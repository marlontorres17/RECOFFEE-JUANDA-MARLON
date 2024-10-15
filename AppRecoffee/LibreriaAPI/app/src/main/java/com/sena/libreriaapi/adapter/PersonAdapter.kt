package com.sena.libreriaapi.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.ArrayAdapter
import com.sena.libreriaapi.Entity.Person
import com.sena.libreriaapi.Entity.Persona
import com.sena.libreriaapi.R

class PersonAdapter(context: Context, persons: List<Persona>) :
    ArrayAdapter<Persona>(context, 0, persons) {

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        return createViewFromResource(position, convertView, parent)
    }

    override fun getDropDownView(position: Int, convertView: View?, parent: ViewGroup): View {
        return createViewFromResource(position, convertView, parent)
    }

    private fun createViewFromResource(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = convertView ?: LayoutInflater.from(context).inflate(R.layout.spinner_item, parent, false)

        val person = getItem(position)
        val textView = view.findViewById<TextView>(R.id.spinnerItemText)
        textView.text = person?.firstName

        return view
    }
}
