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

class CreateLiquidationFragment : Fragment() {

    private lateinit var spinnerPerson: Spinner
    private lateinit var spinnerFarm: Spinner // Nuevo spinner para farms
    private lateinit var btnCreateLiquidation: Button

    private val client = OkHttpClient()
    private val persons = mutableListOf<Pair<String, Int>>() // Lista para almacenar nombres e IDs de personas
    private val farms = mutableListOf<Pair<String, Int>>()   // Lista para almacenar nombres e IDs de fincas

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_create_liquidation, container, false)

        // Inicializa los campos
        spinnerPerson = view.findViewById(R.id.spinner_person)
        spinnerFarm = view.findViewById(R.id.spinner_farm) // Inicializa el nuevo spinner
        btnCreateLiquidation = view.findViewById(R.id.btn_create_liquidation)

        // Cargar las personas y las fincas
        loadPersons()
        loadFarms() // Llama al método para cargar las fincas

        // Acciones de los elementos
        btnCreateLiquidation.setOnClickListener { createLiquidation() }

        return view
    }

    private fun loadPersons() {
        val request = Request.Builder()
            .url(Url.PERSON_URL) // Cambia la URL si es necesario
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al cargar las personas", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                response.body?.let { responseBody ->
                    val personsJson = JSONArray(responseBody.string())
                    persons.clear()
                    val personsList = mutableListOf<String>()
                    for (i in 0 until personsJson.length()) {
                        val person = personsJson.getJSONObject(i)
                        val id = person.getInt("id")
                        val fullName = "${person.getString("firstName")} ${person.getString("firstLastName")}"
                        persons.add(Pair(fullName, id))
                        personsList.add(fullName)
                    }
                    activity?.runOnUiThread {
                        val adapter = ArrayAdapter(
                            requireContext(),
                            android.R.layout.simple_spinner_item,
                            personsList
                        )
                        spinnerPerson.adapter = adapter
                    }
                }
            }
        })
    }

    private fun loadFarms() {
        val request = Request.Builder()
            .url(Url.FARM_URL) // Cambia la URL si es necesario
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al cargar las fincas", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                response.body?.let { responseBody ->
                    val farmsJson = JSONArray(responseBody.string())
                    farms.clear()
                    val farmsList = mutableListOf<String>()
                    for (i in 0 until farmsJson.length()) {
                        val farm = farmsJson.getJSONObject(i)
                        val id = farm.getInt("id")
                        val farmName = farm.getString("name")
                        farms.add(Pair(farmName, id))
                        farmsList.add(farmName)
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

    private fun createLiquidation() {
        val selectedPersonId = persons[spinnerPerson.selectedItemPosition].second
        val selectedFarmId = farms[spinnerFarm.selectedItemPosition].second // Obtén la finca seleccionada

        val jsonObject = JSONObject()
        jsonObject.put("personId", selectedPersonId)
        jsonObject.put("farmId", selectedFarmId) // Añade el ID de la finca seleccionada
        jsonObject.put("totalKilo", JSONObject.NULL) // Estos campos los calculará el backend
        jsonObject.put("totalBenefit", JSONObject.NULL)
        jsonObject.put("totalPay", JSONObject.NULL)
        jsonObject.put("state", true)

        val body = jsonObject.toString().toRequestBody("application/json".toMediaType())

        val request = Request.Builder()
            .url(Url.LIQUIDATION_URL)
            .post(body)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al crear la liquidación", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    activity?.runOnUiThread {
                        Toast.makeText(context, "Liquidación creada exitosamente", Toast.LENGTH_SHORT).show()
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
        spinnerPerson.setSelection(0)
        spinnerFarm.setSelection(0) // Reinicia el spinner de fincas
    }
}
