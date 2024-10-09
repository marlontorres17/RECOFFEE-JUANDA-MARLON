package com.sena.libreriaapi

import android.os.Bundle
import android.text.InputType
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.sena.libreriaapi.config.Url
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.util.regex.Pattern

class RegistroActivity : AppCompatActivity() {

    private lateinit var etFirstName: EditText
    private lateinit var etSecondName: EditText
    private lateinit var etFirstLastName: EditText
    private lateinit var etSecondLastName: EditText
    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var etDateOfBirth: EditText
    private lateinit var etNumberDocument: EditText
    private lateinit var spCity: Spinner
    private lateinit var spTypeDocument: Spinner
    private lateinit var btnRegister: Button
    private lateinit var progressBar: ProgressBar

    private val client = OkHttpClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_registro)

        etFirstName = findViewById(R.id.etFirstName)
        etSecondName = findViewById(R.id.etSecondName)
        etFirstLastName = findViewById(R.id.etFirstLastName)
        etSecondLastName = findViewById(R.id.etSecondLastName)
        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)
        etDateOfBirth = findViewById(R.id.etDateOfBirth)
        etNumberDocument = findViewById(R.id.etNumberDocument)
        spCity = findViewById(R.id.spCity)
        spTypeDocument = findViewById(R.id.spTypeDocument)
        btnRegister = findViewById(R.id.btnRegister)
        progressBar = findViewById(R.id.progressBar)

        loadCities()

        val documentTypes = arrayOf("DNI", "Pasaporte", "Cédula")
        spTypeDocument.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, documentTypes)

        btnRegister.setOnClickListener {
            registerUser()
        }
    }

    private fun loadCities() {
        val request = Request.Builder()
            .url(Url.CITY_URL)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    Toast.makeText(this@RegistroActivity, "Error al cargar ciudades", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    val jsonArray = JSONArray(response.body?.string())
                    val cityList = ArrayList<String>()
                    for (i in 0 until jsonArray.length()) {
                        val city = jsonArray.getJSONObject(i)
                        cityList.add(city.getString("name"))
                    }

                    runOnUiThread {
                        val adapter = ArrayAdapter(this@RegistroActivity, android.R.layout.simple_spinner_dropdown_item, cityList)
                        spCity.adapter = adapter
                    }
                } else {
                    runOnUiThread {
                        Toast.makeText(this@RegistroActivity, "Error al cargar ciudades", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }

    private fun registerUser() {
        val firstName = etFirstName.text.toString().trim()
        val secondName = etSecondName.text.toString().trim()
        val firstLastName = etFirstLastName.text.toString().trim()
        val secondLastName = etSecondLastName.text.toString().trim()
        val email = etEmail.text.toString().trim()
        val password = etPassword.text.toString().trim()

        val dateOfBirth = etDateOfBirth.text.toString().trim()
        val numberDocument = etNumberDocument.text.toString().trim()
        val cityId = spCity.selectedItemPosition + 1 // Mapeo básico del índice al ID de ciudad
        val typeDocument = spTypeDocument.selectedItem.toString()






        // Validaciones
        if (firstName.isEmpty() || firstLastName.isEmpty() || email.isEmpty() || password.isEmpty() || dateOfBirth.isEmpty() || numberDocument.isEmpty() || typeDocument.isEmpty() || cityId == 0) {
            Toast.makeText(this, "Por favor complete todos los campos obligatorios", Toast.LENGTH_SHORT).show()
            return
        }

        if (!isPasswordValid(password)) {
            Toast.makeText(this, "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.", Toast.LENGTH_LONG).show()
            return
        }

        progressBar.visibility = View.VISIBLE

        val json = JSONObject().apply {
            put("user", JSONObject().apply {
                put("state", true)
                put("userName", email)
                put("password", password)
                put("personId", 0)
            })
            put("person", JSONObject().apply {
                put("state", true)
                put("firstName", firstName)
                put("secondName", secondName)
                put("firstLastName", firstLastName)
                put("secondLastName", secondLastName)
                put("email", email)
                put("dateOfBirth", dateOfBirth)
                put("gender", "M")  // Puedes ajustar esto si necesitas que sea dinámico
                put("cityId", cityId) // Ajustar ID de ciudad
                put("typeDocument", typeDocument)
                put("numberDocument", numberDocument)
            })
            put("roleName", "usuario") // Campo oculto
        }

        val body = RequestBody.create("application/json; charset=utf-8".toMediaType(), json.toString())
        val request = Request.Builder()
            .url(Url.USER_REGISTER_URL)
            .post(body)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    progressBar.visibility = View.GONE
                    Toast.makeText(this@RegistroActivity, "Error en el registro", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                runOnUiThread {
                    progressBar.visibility = View.GONE
                    if (response.isSuccessful) {
                        Toast.makeText(this@RegistroActivity, "Registro exitoso", Toast.LENGTH_SHORT).show()
                        finish() // Cierra la actividad si el registro fue exitoso
                    } else {
                        Toast.makeText(this@RegistroActivity, "Error: ${response.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }

    // Validar contraseña
    private fun isPasswordValid(password: String): Boolean {
        val passwordPattern = Pattern.compile(
            "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$"
        )
        return passwordPattern.matcher(password).matches()
    }




}
