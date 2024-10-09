package com.sena.libreriaapi

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.sena.libreriaapi.config.Url
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import org.json.JSONObject
import java.io.IOException

class JoinFarmFragment : Fragment() {

    private lateinit var identificationNumberEditText: EditText
    private lateinit var uniqueCodeEditText: EditText
    private lateinit var joinFarmButton: Button
    private val client = OkHttpClient()

    private val apiUrl = Url.JOIN_FARM_URL

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflar el diseño del fragmento
        val view = inflater.inflate(R.layout.fragment_join_farm, container, false)

        // Obtener referencias a los elementos de la UI
        identificationNumberEditText = view.findViewById(R.id.editText_identification_number)
        uniqueCodeEditText = view.findViewById(R.id.editText_unique_code)
        joinFarmButton = view.findViewById(R.id.button_join_farm)

        // Establecer el listener para el botón
        joinFarmButton.setOnClickListener {
            onSubmit()
        }

        return view
    }

    // Método que maneja la lógica cuando se envía el formulario
    private fun onSubmit() {
        val identificationNumber = identificationNumberEditText.text.toString().trim()
        val uniqueCode = uniqueCodeEditText.text.toString().trim()

        // Validar campos
        if (identificationNumber.isEmpty() || uniqueCode.isEmpty()) {
            Toast.makeText(context, "Número de identificación y código de finca son requeridos.", Toast.LENGTH_SHORT).show()
            return
        }

        // Crear el JSON del cuerpo de la solicitud
        val formData = JSONObject()
        formData.put("identificationNumber", identificationNumber)
        formData.put("codigoUnico", uniqueCode)

        // Realizar la solicitud POST
        val requestBody = RequestBody.create("application/json; charset=utf-8".toMediaType(), formData.toString())
        val request = Request.Builder()
            .url(apiUrl)
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                // Ejecutar en el hilo principal para mostrar el Toast
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error: Ocurrió un error inesperado.", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                // Ejecutar en el hilo principal para interactuar con la UI
                activity?.runOnUiThread {
                    val responseBody = response.body?.string() // Asignar el body de la respuesta a una constante
                    when (response.code) { // Usar 'response.code' en lugar de 'response.code()'
                        200 -> Toast.makeText(context, responseBody ?: "Te has unido a la finca exitosamente.", Toast.LENGTH_LONG).show()
                        204 -> Toast.makeText(context, "Te has unido a la finca exitosamente pero sin contenido adicional.", Toast.LENGTH_LONG).show()
                        400 -> Toast.makeText(context, "Error: Los datos proporcionados son incorrectos.", Toast.LENGTH_LONG).show()
                        404 -> Toast.makeText(context, "Error: No se encontró la finca o la persona.", Toast.LENGTH_LONG).show()
                        409 -> Toast.makeText(context, "Error: Ya estás unido a esta finca.", Toast.LENGTH_LONG).show()
                        else -> Toast.makeText(context, "Error: Respuesta inesperada del servidor.", Toast.LENGTH_LONG).show()
                    }
                }
            }
        })
    }
}
