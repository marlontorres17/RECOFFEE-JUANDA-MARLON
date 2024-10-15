package com.sena.libreriaapi

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.fragment.app.Fragment

class HomeFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(R.layout.fragment_home, container, false)

        // Obtener la referencia al Button
        val button = rootView.findViewById<Button>(R.id.button)

        // Configurar el listener para el clic
        button.setOnClickListener {
            // Iniciar la AccountActivity
            val intent = Intent(activity, AccountActivity::class.java)
            startActivity(intent)
        }

        return rootView
    }
}
