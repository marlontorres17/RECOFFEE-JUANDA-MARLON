package com.sena.libreriaapi

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.sena.libreriaapi.config.Url
import org.json.JSONArray
import org.json.JSONObject
import java.util.regex.Pattern

class CreateUserActivity : AppCompatActivity() {

    private lateinit var spPerson: Spinner
    private lateinit var etUserName: EditText
    private lateinit var etPassword: EditText
    private lateinit var btnCreateUser: Button
    private lateinit var tvSuccessMessage: TextView
    private lateinit var btnLogin: Button
    private var persons: List<Person> = listOf() // Lista para almacenar los objetos Person

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_user)

        spPerson = findViewById(R.id.spPerson)
        etUserName = findViewById(R.id.etUserName)
        etPassword = findViewById(R.id.etPassword)
        btnCreateUser = findViewById(R.id.btnCreateUser)
        tvSuccessMessage = findViewById(R.id.tvSuccessMessage)
        btnLogin = findViewById(R.id.btnLogin)

        loadPersons() // Cargar personas al iniciar la actividad

        btnCreateUser.setOnClickListener {
            createUser()
        }

        btnLogin.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
        }
    }

    private fun loadPersons() {
        val url = Url.PERSON_URL // Ajusta la URL según sea necesario
        val queue = Volley.newRequestQueue(this)

        val jsonArrayRequest = JsonArrayRequest(Request.Method.GET, url, null,
            Response.Listener { response ->
                persons = parsePersons(response) // Procesa el JSON para obtener las personas
                val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, persons.map { "${it.firstName} ${it.firstLastName} (${it.numberDocument})" })
                adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                spPerson.adapter = adapter
            },
            Response.ErrorListener { error ->
                Toast.makeText(this, "Error al cargar personas: ${error.message}", Toast.LENGTH_SHORT).show()
            })

        queue.add(jsonArrayRequest)
    }

    private fun parsePersons(response: JSONArray): List<Person> {
        val personList = mutableListOf<Person>()
        for (i in 0 until response.length()) {
            val personObject = response.getJSONObject(i)
            val person = Person(
                personObject.getString("firstName"),
                personObject.getString("firstLastName"),
                personObject.getString("numberDocument"),
                personObject.getInt("id")
            )
            personList.add(person)
        }
        return personList
    }

    private fun createUser() {
        val userName = etUserName.text.toString().trim()
        val password = etPassword.text.toString().trim()
        val selectedPerson = spPerson.selectedItem

        // Validaciones
        if (!isValidUserName(userName)) {
            Toast.makeText(this, "El nombre de usuario no debe contener mayúsculas ni espacios.", Toast.LENGTH_SHORT).show()
            return
        }

        if (!isValidPassword(password)) {
            Toast.makeText(this, "La contraseña debe tener al menos 8 caracteres y un número.", Toast.LENGTH_SHORT).show()
            return
        }

        if (selectedPerson == null) {
            Toast.makeText(this, "Por favor, seleccione una persona.", Toast.LENGTH_SHORT).show()
            return
        }

        val selectedPersonId = persons[spPerson.selectedItemPosition].id // Obtener el ID de la persona seleccionada
        checkIfPasswordExists(password) { exists ->
            if (!exists) {
                sendCreateUserRequest(selectedPersonId, userName, password)
            } else {
                Toast.makeText(this, "La contraseña ya está en uso. Elija otra.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun isValidUserName(userName: String): Boolean {
        return userName.isNotEmpty() && !userName.contains(" ") && userName == userName.lowercase()
    }

    private fun isValidPassword(password: String): Boolean {
        val passwordPattern = Pattern.compile("^(?=.*[0-9]).{8,}$")
        return passwordPattern.matcher(password).matches()
    }

    private fun checkIfPasswordExists(password: String, callback: (Boolean) -> Unit) {
        val url = "http://10.192.89.146:9191/api/User/checkPassword" // Ajusta según tu API
        val queue = Volley.newRequestQueue(this)

        val jsonBody = JSONObject().apply {
            put("password", password)
        }

        val jsonObjectRequest = JsonObjectRequest(Request.Method.POST, url, jsonBody,
            Response.Listener { response ->
                val exists = response.getBoolean("exists")
                callback(exists)
            },
            Response.ErrorListener { error ->

                callback(false)
            })

        queue.add(jsonObjectRequest)
    }

    private fun sendCreateUserRequest(personId: Int, userName: String, password: String) {
        val url = Url.USER_URL
        val queue = Volley.newRequestQueue(this)

        val jsonBody = JSONObject().apply {
            put("userName", userName)
            put("password", password)
            put("personId", personId)
        }

        val jsonObjectRequest = JsonObjectRequest(Request.Method.POST, url, jsonBody,
            Response.Listener {
                tvSuccessMessage.visibility = View.VISIBLE
                btnLogin.visibility = View.VISIBLE

            },
            Response.ErrorListener {

            })

        queue.add(jsonObjectRequest)
    }
}

// Clase de datos Person
data class Person(
    val firstName: String,
    val firstLastName: String,
    val numberDocument: String,
    val id: Int
)
