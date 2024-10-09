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

class CreateBenefitFragment : Fragment() {

    private lateinit var etName: EditText
    private lateinit var etDescription: EditText
    private lateinit var etCost: EditText
    private lateinit var spinnerFarm: Spinner
    private lateinit var btnCreateBenefit: Button

    private val client = OkHttpClient()
    private val farms = mutableListOf<Pair<String, Int>>() // Lista para almacenar nombres e IDs de granjas

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_create_benefit, container, false)

        // Inicializa los campos
        etName = view.findViewById(R.id.et_name)
        etDescription = view.findViewById(R.id.et_description)
        etCost = view.findViewById(R.id.et_cost)
        spinnerFarm = view.findViewById(R.id.spinner_farm)
        btnCreateBenefit = view.findViewById(R.id.btn_create_benefit)

        // Cargar las fincas
        loadFarms()

        // Acción del botón para crear un beneficio
        btnCreateBenefit.setOnClickListener {
            createBenefit()
        }

        return view
    }

    private fun loadFarms() {
        val request = Request.Builder()
            .url(Url.FARM_URL) // Cambia la URL si es necesario
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al cargar las granjas", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                response.body?.let { responseBody ->
                    val farmsJson = JSONArray(responseBody.string())
                    farms.clear() // Limpiar la lista antes de agregar nuevos elementos
                    val farmsList = mutableListOf<String>()
                    for (i in 0 until farmsJson.length()) {
                        val farm = farmsJson.getJSONObject(i)
                        val id = farm.getInt("id") // Asegúrate de que el campo id exista en el JSON
                        farms.add(Pair(farm.getString("name"), id))
                        farmsList.add(farm.getString("name")) // Agrega solo el nombre de la granja al spinner
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


    private fun createBenefit() {
        val name = etName.text.toString()
        val description = etDescription.text.toString()
        val cost = etCost.text.toString() // Ahora es String directamente
        val selectedFarmIndex = spinnerFarm.selectedItemPosition

        if (name.isEmpty() || description.isEmpty() || cost.isEmpty()) {
            Toast.makeText(context, "Por favor complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        val farmId = farms[selectedFarmIndex].second

        // Crear el objeto JSON para enviar
        val jsonObject = JSONObject().apply {
            put("name", name)
            put("description", description)
            put("cost", cost) // Aquí el costo es String
            put("farmId", farmId)
            put("id", 0) // Especifica un valor por defecto para "id"
            put("state", true)
        }

        val requestBody = jsonObject.toString().toRequestBody("application/json".toMediaType())
        val request = Request.Builder()
            .url(Url.BENEFIT_URL) // Cambia la URL si es necesario
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al crear el beneficio", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    activity?.runOnUiThread {
                        Toast.makeText(context, "Beneficio creado exitosamente", Toast.LENGTH_SHORT).show()
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
        etCost.text.clear()
        spinnerFarm.setSelection(0)
    }
}
