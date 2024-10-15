package com.sena.libreriaapi

import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.snackbar.Snackbar
import com.sena.libreriaapi.config.Url
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.*

class AccountActivity : AppCompatActivity() {

    private lateinit var user: JSONObject
    private lateinit var person: JSONObject
    private var cities: JSONArray = JSONArray()
    private lateinit var sharedPreferences: SharedPreferences

    private val userApiUrl = "http://192.168.100.19:9191/api/User"
    private val personApiUrl = "http://192.168.100.19:9191/api/Person"
    private val cityApiUrl = "http://192.168.100.19:9191/api/City"

    private lateinit var userNameEditText: EditText
    private lateinit var firstNameEditText: EditText
    private lateinit var secondNameEditText: EditText
    private lateinit var firstLastNameEditText: EditText
    private lateinit var secondLastNameEditText: EditText
    private lateinit var emailEditText: EditText
    private lateinit var dateOfBirthEditText: EditText
    private lateinit var genderEditText: EditText
    private lateinit var typeDocumentEditText: EditText
    private lateinit var numberDocumentEditText: EditText
    private lateinit var citySpinner: Spinner
    private lateinit var stateSwitch: Switch
    private lateinit var saveButton: Button
    private lateinit var dateErrorMessageTextView: TextView

    private val client = OkHttpClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_account)
        sharedPreferences = getSharedPreferences("APP_PREFS", MODE_PRIVATE)


        userNameEditText = findViewById(R.id.editTextUserName)
        firstNameEditText = findViewById(R.id.editTextFirstName)
        secondNameEditText = findViewById(R.id.editTextSecondName)
        firstLastNameEditText = findViewById(R.id.editTextFirstLastName)
        secondLastNameEditText = findViewById(R.id.editTextSecondLastName)
        emailEditText = findViewById(R.id.editTextEmail)
        dateOfBirthEditText = findViewById(R.id.editTextDateOfBirth)
        genderEditText = findViewById(R.id.editTextGender)
        typeDocumentEditText = findViewById(R.id.editTextTypeDocument)
        numberDocumentEditText = findViewById(R.id.editTextNumberDocument)
        citySpinner = findViewById(R.id.spinnerCity)
        stateSwitch = findViewById(R.id.switchState)
        saveButton = findViewById(R.id.buttonSave)
        dateErrorMessageTextView = findViewById(R.id.textViewDateErrorMessage)

        // Recuperar userId de SharedPreferences
        val userId = getSharedPreferences("APP_PREFS", MODE_PRIVATE).getString("userId", "")
        Log.d("AccountActivity", "Retrieved userId: $userId") // Log para verificar el userId

        if (userId.isNullOrEmpty()) {
            showSnackbar("User not logged in") // Mensaje si no hay userId
        } else {
            getCities()
            getUserData(userId) // Llama a la función para obtener datos del usuario
        }

        // Botón para cerrar sesión
        val logoutButton: Button = findViewById(R.id.logout_button)
        logoutButton.setOnClickListener {
            clearSavedCredentials()
            // Regresar a la pantalla de login
            startActivity(Intent(this, LoginActivity::class.java))
            finish() // Cerrar esta actividad
        }

        saveButton.setOnClickListener {
            updateUserData()
            updatePersonData()
        }


    }

    private fun clearSavedCredentials() {
        val editor = sharedPreferences.edit()
        editor.clear() // Limpia todas las credenciales guardadas
        editor.apply()
    }

    private fun getUserData(userId: String) {
        Log.d("AccountActivity", "Fetching data for userId: $userId") // Log para verificar el userId

        val request = Request.Builder().url("${Url.USER_URL}/$userId").build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    showSnackbar("Error fetching user data: ${e.message}")
                }
            }

            override fun onResponse(call: Call, response: Response) {
                val responseData = response.body?.string()
                Log.d("AccountActivity", "Response: $responseData") // Log de la respuesta

                responseData?.let {
                    user = JSONObject(it)
                    runOnUiThread {
                        userNameEditText.setText(user.getString("userName"))
                        stateSwitch.isChecked = user.getBoolean("state")
                        getPersonData(user.getInt("personId"))
                    }
                } ?: run {
                    runOnUiThread { showSnackbar("No data received") }
                }
            }
        })
    }

    private fun getPersonData(personId: Int) {
        val request = Request.Builder().url("${Url.PERSON_URL}/$personId").build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread { showSnackbar("Error fetching person data") }
            }

            override fun onResponse(call: Call, response: Response) {
                response.body?.string()?.let {
                    person = JSONObject(it)
                    runOnUiThread {
                        firstNameEditText.setText(person.getString("firstName"))
                        secondNameEditText.setText(person.getString("secondName"))
                        firstLastNameEditText.setText(person.getString("firstLastName"))
                        secondLastNameEditText.setText(person.getString("secondLastName"))
                        emailEditText.setText(person.getString("email"))
                        genderEditText.setText(person.getString("gender"))
                        typeDocumentEditText.setText(person.getString("typeDocument"))
                        numberDocumentEditText.setText(person.getString("numberDocument"))
                        stateSwitch.isChecked = person.getBoolean("state")

                        val dateOfBirth = person.getString("dateOfBirth").split("T")[0]
                        dateOfBirthEditText.setText(dateOfBirth)

                        // Establecer la ciudad en el spinner
                        val cityId = person.getInt("cityId")
                        setCityInSpinner(cityId)
                    }
                }
            }
        })
    }

    private fun setCityInSpinner(cityId: Int) {
        for (i in 0 until cities.length()) {
            val city = cities.getJSONObject(i)
            if (city.getInt("id") == cityId) {
                citySpinner.setSelection(i)
                break
            }
        }
    }

    private fun getCities() {
        val request = Request.Builder().url(Url.CITY_URL).build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread { showSnackbar("Error fetching cities") }
            }

            override fun onResponse(call: Call, response: Response) {
                response.body?.string()?.let {
                    cities = JSONArray(it)
                    val cityNames = (0 until cities.length()).map { i -> cities.getJSONObject(i).getString("name") }
                    runOnUiThread {
                        val adapter = ArrayAdapter(this@AccountActivity, android.R.layout.simple_spinner_item, cityNames)
                        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                        citySpinner.adapter = adapter
                    }
                }
            }
        })
    }

    private fun validateDateOfBirth(): Boolean {
        val birthDateStr = dateOfBirthEditText.text.toString()
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        return try {
            val birthDate = sdf.parse(birthDateStr)
            val currentDate = Date()
            val age = currentDate.year - birthDate.year

            when {
                birthDate.after(currentDate) -> {
                    showSnackbar("La fecha de nacimiento no puede ser en el futuro.")
                    false
                }
                age < 14 -> {
                    showSnackbar("La edad mínima es de 14 años.")
                    false
                }
                age > 85 -> {
                    showSnackbar("La edad máxima es de 85 años.")
                    false
                }
                else -> {
                    true
                }
            }
        } catch (e: Exception) {
            showSnackbar("Fecha inválida")
            false
        }
    }

    private fun updateUserData() {
        if (validateDateOfBirth()) {
            // Crear un objeto JSON con toda la información del usuario
            val updatedUser = JSONObject().apply {
                put("id", user.getInt("id")) // Mantener el ID
                put("userName", userNameEditText.text.toString()) // Modificar solo el userName
                put("password", user.getString("password")) // Mantener el password existente
                put("personId", user.getInt("personId")) // Mantener el personId
                put("state", stateSwitch.isChecked) // Mantener el estado
            }

            // Log para ver el cuerpo de la solicitud
            Log.d("AccountActivity", "Updating user with data: $updatedUser")

            val body = RequestBody.create("application/json; charset=utf-8".toMediaTypeOrNull(), updatedUser.toString())
            val request = Request.Builder().url("${Url.USER_URL}/${user.getInt("id")}").put(body).build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    runOnUiThread { showSnackbar("Error updating user") }
                }

                override fun onResponse(call: Call, response: Response) {
                    if (!response.isSuccessful) {
                        runOnUiThread { showSnackbar("Error updating user: ${response.message}") }
                    } else {
                        Log.d("AccountActivity", "User updated successfully")
                        runOnUiThread {
                            showSnackbar("Usuario actualizado exitosamente")
                        }
                    }
                }
            })
        }
    }

    private fun updatePersonData() {
        if (validateDateOfBirth()) {
            // Crear un objeto JSON con toda la información de la persona
            val updatedPerson = JSONObject().apply {
                put("id", person.getInt("id")) // Mantener el ID
                put("firstName", firstNameEditText.text.toString())
                put("secondName", secondNameEditText.text.toString())
                put("firstLastName", firstLastNameEditText.text.toString())
                put("secondLastName", secondLastNameEditText.text.toString())
                put("email", emailEditText.text.toString())
                put("dateOfBirth", dateOfBirthEditText.text.toString())
                put("gender", genderEditText.text.toString())
                put("typeDocument", typeDocumentEditText.text.toString())
                put("numberDocument", numberDocumentEditText.text.toString())
                put("cityId", (citySpinner.selectedItemPosition + 1)) // Suponiendo que el ID de la ciudad es igual a la posición + 1
                put("state", stateSwitch.isChecked) // Mantener el estado
            }

            // Log para ver el cuerpo de la solicitud
            Log.d("AccountActivity", "Updating person with data: $updatedPerson")

            val body = RequestBody.create("application/json; charset=utf-8".toMediaTypeOrNull(), updatedPerson.toString())
            val request = Request.Builder().url("${Url.PERSON_URL}/${person.getInt("id")}").put(body).build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    runOnUiThread { showSnackbar("Error updating person") }
                }

                override fun onResponse(call: Call, response: Response) {
                    if (!response.isSuccessful) {
                        runOnUiThread { showSnackbar("Error updating person: ${response.message}") }
                    } else {
                        Log.d("AccountActivity", "Person updated successfully")
                        runOnUiThread {
                            showSnackbar("Persona actualizada exitosamente")
                        }
                    }
                }
            })
        }
    }

    private fun showSnackbar(message: String) {
        Snackbar.make(findViewById(android.R.id.content), message, Snackbar.LENGTH_SHORT).show()
    }
}
