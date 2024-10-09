package com.sena.libreriaapi

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import com.sena.libreriaapi.config.Url
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException

class CreateLotFragment : Fragment() {

    private lateinit var etName: EditText
    private lateinit var etDescription: EditText
    private lateinit var etSize: EditText
    private lateinit var spinnerFarm: Spinner
    private lateinit var btnCreateLot: Button

    private val client = OkHttpClient()
    private val farms = mutableListOf<Pair<String, Int>>() // Almacena nombre y ID

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_create_lot, container, false)

        // Inicializa los campos
        etName = view.findViewById(R.id.et_name)
        etDescription = view.findViewById(R.id.et_description)
        etSize = view.findViewById(R.id.et_size)
        spinnerFarm = view.findViewById(R.id.spinner_farm)
        btnCreateLot = view.findViewById(R.id.btn_create_lot)

        // Carga de datos en spinners
        loadFarms()

        // Acción del botón
        btnCreateLot.setOnClickListener {
            createLot()
        }

        return view
    }

    private fun loadFarms() {
        val request = Request.Builder()
            .url(Url.FARM_URL) // Cambia la URL si es diferente
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al cargar granjas", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                response.body?.let { responseBody ->
                    val farmsJson = JSONArray(responseBody.string())
                    farms.clear() // Limpiar la lista antes de agregar nuevos elementos
                    val farmsList = mutableListOf<String>()
                    for (i in 0 until farmsJson.length()) {
                        val farm = farmsJson.getJSONObject(i)
                        val id = farm.getInt("id") // Asegúrate de que este campo esté en el JSON
                        farms.add(Pair(farm.getString("name"), id))
                        farmsList.add(farm.getString("name")) // Agrega solo el nombre al spinner
                    }
                    activity?.runOnUiThread {
                        val adapter = ArrayAdapter(
                            requireContext(),
                            android.R.layout.simple_spinner_item,
                            farmsList
                        )
                        spinnerFarm.adapter = adapter
                    }
                }
            }
        })
    }

    private fun createLot() {
        val name = etName.text.toString().trim()
        val description = etDescription.text.toString().trim()
        val size = etSize.text.toString().trim()

        // Validaciones simples
        if (name.isEmpty() || description.isEmpty() || size.isEmpty()) {
            Toast.makeText(context, "Por favor complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        // Obtén el ID real de la granja seleccionada
        val selectedFarm = farms[spinnerFarm.selectedItemPosition]

        val jsonObject = JSONObject().apply {
            put("name", name)
            put("description", description)
            put("sizeMeters", size.toIntOrNull() ?: 0) // Asegúrate de convertirlo a Int
            put("farmId", selectedFarm.second) // ID de granja
            put("state", true) // Ajusta según tu lógica
        }

        val jsonMediaType = "application/json".toMediaType()
        val requestBody = jsonObject.toString().toRequestBody(jsonMediaType)

        val request = Request.Builder()
            .url(Url.LOT_URL) // Cambia la URL si es diferente
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al crear el lote", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    activity?.runOnUiThread {
                        Toast.makeText(context, "Lote creado exitosamente", Toast.LENGTH_SHORT).show()
                        // Opcionalmente, limpia los campos después de la creación
                        clearFields()
                    }
                } else {
                    activity?.runOnUiThread {
                        Toast.makeText(context, "Error: ${response.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }

    private fun clearFields() {
        etName.text.clear()
        etDescription.text.clear()
        etSize.text.clear()
        spinnerFarm.setSelection(0)
    }
}
