package com.sena.libreriaapi

import android.app.DatePickerDialog
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
import java.util.*

class CreatePersonBenefitFragment : Fragment() {

    private lateinit var etDate: EditText
    private lateinit var etAmount: EditText
    private lateinit var spinnerPerson: Spinner
    private lateinit var spinnerBenefit: Spinner
    private lateinit var btnAssignBenefit: Button

    private val client = OkHttpClient()
    private val persons = mutableListOf<Pair<String, Int>>() // Lista para almacenar nombres e IDs de personas
    private val benefits = mutableListOf<Pair<String, Int>>() // Lista para almacenar nombres e IDs de beneficios

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_create_person_benefit, container, false)

        // Inicializa los campos
        etDate = view.findViewById(R.id.et_date)
        etAmount = view.findViewById(R.id.et_amount)
        spinnerPerson = view.findViewById(R.id.spinner_person)
        spinnerBenefit = view.findViewById(R.id.spinner_benefit)
        btnAssignBenefit = view.findViewById(R.id.btn_assign_benefit)

        // Cargar las personas y los beneficios
        loadPersons()
        loadBenefits()

        // Acciones de los elementos
        etDate.setOnClickListener { showDatePicker() }
        btnAssignBenefit.setOnClickListener { assignBenefit() }

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

    private fun loadBenefits() {
        val request = Request.Builder()
            .url(Url.BENEFIT_URL) // Cambia la URL si es necesario
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al cargar los beneficios", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                response.body?.let { responseBody ->
                    val benefitsJson = JSONArray(responseBody.string())
                    benefits.clear()
                    val benefitsList = mutableListOf<String>()
                    for (i in 0 until benefitsJson.length()) {
                        val benefit = benefitsJson.getJSONObject(i)
                        val id = benefit.getInt("id")
                        benefits.add(Pair(benefit.getString("name"), id))
                        benefitsList.add(benefit.getString("name"))
                    }
                    activity?.runOnUiThread {
                        val adapter = ArrayAdapter(
                            requireContext(),
                            android.R.layout.simple_spinner_item,
                            benefitsList
                        )
                        spinnerBenefit.adapter = adapter
                    }
                }
            }
        })
    }

    private fun showDatePicker() {
        val calendar = Calendar.getInstance()
        val year = calendar.get(Calendar.YEAR)
        val month = calendar.get(Calendar.MONTH)
        val day = calendar.get(Calendar.DAY_OF_MONTH)

        val datePickerDialog = DatePickerDialog(
            requireContext(),
            { _, selectedYear, selectedMonth, selectedDay ->
                // Formato de fecha con hora incluida
                val dateString = String.format("%04d-%02d-%02dT00:00:00", selectedYear, selectedMonth + 1, selectedDay)
                etDate.setText(dateString)
            },
            year, month, day
        )
        datePickerDialog.show()
    }

    private fun assignBenefit() {
        val date = etDate.text.toString()
        val amount = etAmount.text.toString().toIntOrNull()
        val selectedPersonId = persons[spinnerPerson.selectedItemPosition].second
        val selectedBenefitId = benefits[spinnerBenefit.selectedItemPosition].second

        if (date.isEmpty() || amount == null) {
            Toast.makeText(context, "Complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        val jsonObject = JSONObject()
        jsonObject.put("date", date)
        jsonObject.put("amount", amount)
        jsonObject.put("personId", selectedPersonId)
        jsonObject.put("benefitId", selectedBenefitId)
        // Omitir el campo 'price'

        val body = jsonObject.toString().toRequestBody("application/json".toMediaType())

        val request = Request.Builder()
            .url(Url.PERSON_BENEFIT_URL) // Cambia la URL si es necesario
            .post(body)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al asignar el beneficio", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    activity?.runOnUiThread {
                        Toast.makeText(context, "Beneficio asignado exitosamente", Toast.LENGTH_SHORT).show()
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
        etDate.text.clear()
        etAmount.text.clear()
        spinnerPerson.setSelection(0)
        spinnerBenefit.setSelection(0)
    }
}
