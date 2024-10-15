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

class CreateCollectionDetailFragment : Fragment() {

    private lateinit var etKilo: EditText
    private lateinit var spinnerStage: Spinner
    private lateinit var spinnerHarvest: Spinner
    private lateinit var spinnerPerson: Spinner
    private lateinit var btnCreateCollectionDetail: Button

    private val client = OkHttpClient()
    private val harvests = mutableListOf<Pair<String, Int>>() // Almacena nombre y ID de cosechas
    private val persons = mutableListOf<Pair<String, Int>>() // Almacena nombre y ID de personas
    private val stages = listOf("6:00 - 8:00", "8:30 - 12:00", "12:30 - 18:00") // Etapas

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_create_collection_detail, container, false)

        // Inicializa los campos
        etKilo = view.findViewById(R.id.et_kilo)
        spinnerStage = view.findViewById(R.id.spinner_stage)
        spinnerHarvest = view.findViewById(R.id.spinner_harvest)
        spinnerPerson = view.findViewById(R.id.spinner_person)
        btnCreateCollectionDetail = view.findViewById(R.id.btn_create_collection_detail)

        // Configura el spinner de etapas
        setupStageSpinner()

        // Cargar datos en los spinners de cosechas y personas
        loadHarvests()
        loadPersons()

        // Acción del botón
        btnCreateCollectionDetail.setOnClickListener {
            createCollectionDetail()
        }

        return view
    }

    private fun setupStageSpinner() {
        val adapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, stages)
        spinnerStage.adapter = adapter
    }

    private fun loadHarvests() {
        val request = Request.Builder()
            .url(Url.HARVEST_URL) // Cambia la URL si es diferente
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al cargar cosechas", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                response.body?.let { responseBody ->
                    val harvestsJson = JSONArray(responseBody.string())
                    harvests.clear() // Limpiar la lista antes de agregar nuevos elementos
                    val harvestsList = mutableListOf<String>()
                    for (i in 0 until harvestsJson.length()) {
                        val harvest = harvestsJson.getJSONObject(i)
                        val id = harvest.getInt("id") // Asegúrate de que este campo esté en el JSON
                        harvests.add(Pair(harvest.getString("date"), id))
                        harvestsList.add(harvest.getString("date")) // Agrega solo la fecha al spinner
                    }
                    activity?.runOnUiThread {
                        val adapter = ArrayAdapter(
                            requireContext(),
                            android.R.layout.simple_spinner_item,
                            harvestsList
                        )
                        spinnerHarvest.adapter = adapter
                    }
                }
            }
        })
    }

    private fun loadPersons() {
        val request = Request.Builder()
            .url(Url.PERSON_URL) // Cambia la URL si es diferente
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al cargar personas", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                response.body?.let { responseBody ->
                    val personsJson = JSONArray(responseBody.string())
                    persons.clear() // Limpiar la lista antes de agregar nuevos elementos
                    val personsList = mutableListOf<String>()
                    for (i in 0 until personsJson.length()) {
                        val person = personsJson.getJSONObject(i)
                        val id = person.getInt("id") // Asegúrate de que este campo esté en el JSON
                        persons.add(Pair(person.getString("firstName") + " " + person.getString("firstLastName"), id))
                        personsList.add(person.getString("firstName") + " " + person.getString("firstLastName")) // Agrega solo el nombre al spinner
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

    private fun createCollectionDetail() {
        val kilo = etKilo.text.toString().toIntOrNull()
        val stage = spinnerStage.selectedItem.toString()
        val selectedHarvestIndex = spinnerHarvest.selectedItemPosition
        val selectedPersonIndex = spinnerPerson.selectedItemPosition

        if (kilo == null) {
            Toast.makeText(context, "Por favor ingresa un kilo válido", Toast.LENGTH_SHORT).show()
            return
        }

        val harvestId = harvests[selectedHarvestIndex].second
        val personId = persons[selectedPersonIndex].second

        val jsonObject = JSONObject().apply {
            put("kilo", kilo)
            put("stage", stage)
            put("harvestId", harvestId)
            put("personId", personId)
            put("state", true)
        }

        val requestBody = jsonObject.toString().toRequestBody("application/json".toMediaType())
        val request = Request.Builder()
            .url(Url.COLLECTION_DETAIL_URL)
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al crear el detalle de colección", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    activity?.runOnUiThread {
                        Toast.makeText(context, "Detalle de colección creado exitosamente", Toast.LENGTH_SHORT).show()
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
        etKilo.text.clear()
        spinnerHarvest.setSelection(0)
        spinnerPerson.setSelection(0)
        spinnerStage.setSelection(0)
    }
}
