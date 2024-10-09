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
import java.text.SimpleDateFormat
import java.util.*

class CreateHarvestFragment : Fragment() {

    private lateinit var etDate: EditText
    private lateinit var etKiloPrice: EditText
    private lateinit var spinnerLot: Spinner
    private lateinit var btnCreateHarvest: Button

    private val client = OkHttpClient()
    private val lots = mutableListOf<Pair<String, Int>>() // Almacena nombre y ID

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_recolecciones, container, false)

        // Inicializa los campos
        etDate = view.findViewById(R.id.et_date)
        etKiloPrice = view.findViewById(R.id.et_kilo_price)
        spinnerLot = view.findViewById(R.id.spinner_lot)
        btnCreateHarvest = view.findViewById(R.id.btn_create_harvest)

        // Configurar DatePicker
        setupDatePicker()

        // Cargar datos en el spinner de lotes
        loadLots()

        // Acción del botón
        btnCreateHarvest.setOnClickListener {
            createHarvest()
        }

        return view
    }

    private fun setupDatePicker() {
        val calendar = Calendar.getInstance()
        val year = calendar.get(Calendar.YEAR)
        val month = calendar.get(Calendar.MONTH)
        val day = calendar.get(Calendar.DAY_OF_MONTH)

        etDate.setOnClickListener {
            val datePickerDialog = DatePickerDialog(
                requireContext(),
                { _, selectedYear, selectedMonth, selectedDay ->
                    // Formato YYYY-MM-DD con ceros a la izquierda
                    val formattedMonth = String.format("%02d", selectedMonth + 1)
                    val formattedDay = String.format("%02d", selectedDay)
                    etDate.setText("$selectedYear-$formattedMonth-$formattedDay")
                },
                year,
                month,
                day
            )
            // No permitir fechas futuras
            datePickerDialog.datePicker.maxDate = System.currentTimeMillis()
            datePickerDialog.show()
        }
    }

    private fun loadLots() {
        val request = Request.Builder()
            .url(Url.LOT_URL) // Cambia la URL si es diferente
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al cargar lotes", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                response.body?.let { responseBody ->
                    val lotsJson = JSONArray(responseBody.string())
                    lots.clear() // Limpiar la lista antes de agregar nuevos elementos
                    val lotsList = mutableListOf<String>()
                    for (i in 0 until lotsJson.length()) {
                        val lot = lotsJson.getJSONObject(i)
                        val id = lot.getInt("id") // Asegúrate de que este campo esté en el JSON
                        lots.add(Pair(lot.getString("name"), id))
                        lotsList.add(lot.getString("name")) // Agrega solo el nombre al spinner
                    }
                    activity?.runOnUiThread {
                        val adapter = ArrayAdapter(
                            requireContext(),
                            android.R.layout.simple_spinner_item,
                            lotsList
                        )
                        spinnerLot.adapter = adapter
                    }
                }
            }
        })
    }

    private fun createHarvest() {
        val date = etDate.text.toString().trim()
        val kiloPrice = etKiloPrice.text.toString().trim()

        // Validaciones simples
        if (date.isEmpty() || kiloPrice.isEmpty()) {
            Toast.makeText(context, "Por favor complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        // Formatear la fecha al formato esperado "YYYY-MM-DDTHH:MM:SS"
        val formattedDate = formatDate(date)

        // Obtén el ID real del lote seleccionado
        val selectedLot = lots[spinnerLot.selectedItemPosition]

        // Crear un objeto JSON que contenga los campos requeridos
        val jsonObject = JSONObject().apply {
            put("date", formattedDate) // Usar la fecha formateada
            put("kiloPrice", kiloPrice.toIntOrNull() ?: 0) // Asegúrate de convertirlo a Int
            put("lotId", selectedLot.second) // ID del lote
            put("id", 0) // Asegúrate de que este campo esté presente
            put("state", true) // Ajusta según tu lógica
        }

        val jsonMediaType = "application/json".toMediaType()
        val requestBody = jsonObject.toString().toRequestBody(jsonMediaType)

        val request = Request.Builder()
            .url(Url.HARVEST_URL) // Cambia la URL si es diferente
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al crear la cosecha", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    activity?.runOnUiThread {
                        Toast.makeText(context, "Cosecha creada exitosamente", Toast.LENGTH_SHORT).show()
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

    private fun formatDate(dateString: String): String {
        // Convertir la fecha a formato "YYYY-MM-DDTHH:MM:SS"
        val parts = dateString.split("-")
        return if (parts.size == 3) {
            String.format("%04d-%02d-%02dT00:00:00", parts[0].toInt(), parts[1].toInt(), parts[2].toInt())
        } else {
            dateString // Devolver la fecha original si no es válida
        }
    }

    private fun clearFields() {
        etDate.text.clear()
        etKiloPrice.text.clear()
        spinnerLot.setSelection(0)
    }
}
