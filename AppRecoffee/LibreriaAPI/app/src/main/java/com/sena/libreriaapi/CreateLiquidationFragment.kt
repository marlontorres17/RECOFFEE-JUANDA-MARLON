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
    private lateinit var btnCreateLiquidation: Button

    private val client = OkHttpClient()
    private val persons = mutableListOf<Pair<String, Int>>() // Lista para almacenar nombres e IDs de personas

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_create_liquidation, container, false)

        // Inicializa los campos
        spinnerPerson = view.findViewById(R.id.spinner_person)
        btnCreateLiquidation = view.findViewById(R.id.btn_create_liquidation)

        // Cargar las personas
        loadPersons()

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

    private fun createLiquidation() {
        val selectedPersonId = persons[spinnerPerson.selectedItemPosition].second

        val jsonObject = JSONObject()
        jsonObject.put("personId", selectedPersonId)
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
    }
}
