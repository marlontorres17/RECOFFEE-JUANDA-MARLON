package com.sena.libreriaapi

import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Switch
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.sena.libreriaapi.adapter.LoginAdapter

class LoginActivity : AppCompatActivity() {

    private lateinit var usernameField: EditText
    private lateinit var passwordField: EditText
    private lateinit var loginButton: Button
    private lateinit var rememberMeSwitch: Switch
    private lateinit var loginAdapter: LoginAdapter
    private lateinit var sharedPreferences: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // Referenciar los campos y el botón
        usernameField = findViewById(R.id.username)
        passwordField = findViewById(R.id.password)
        loginButton = findViewById(R.id.login_button)
        rememberMeSwitch = findViewById(R.id.remember_me)

        loginAdapter = LoginAdapter(this)

        // Inicializar SharedPreferences
        sharedPreferences = getSharedPreferences("LoginPrefs", MODE_PRIVATE)

        // Verificar si las credenciales están guardadas
        checkSavedCredentials()

        // Listeners para registro y restablecimiento de contraseña
        val registerTextView: TextView = findViewById(R.id.register_text_view)
        registerTextView.setOnClickListener {
            startActivity(Intent(this, RegistroActivity::class.java))
        }

        val resetPassword: TextView = findViewById(R.id.reset_password)
        resetPassword.setOnClickListener {
            startActivity(Intent(this, ResetPasswordActivity::class.java))
        }

        // Listener para crear un usuario
        val btnCrearUsuario = findViewById<Button>(R.id.crear)
        btnCrearUsuario.setOnClickListener {
            startActivity(Intent(this, CreateUserActivity::class.java))
        }

        // Listener para el botón de login
        loginButton.setOnClickListener {
            val username = usernameField.text.toString().trim()
            val password = passwordField.text.toString().trim()

            if (username.isNotEmpty() && password.isNotEmpty()) {
                loginAdapter.login(username, password, { response ->
                    // Verificar si la respuesta tiene userId, personId, y roles
                    val userId = response.getString("userId")
                    val personId = response.getString("personId")
                    val roles = response.getJSONArray("roles")

                    if (userId != null && personId != null && roles.length() > 0) {
                        val roleId = roles.getString(0) // Obtener el primer rol

                        // Guardar datos en SharedPreferences
                        saveLoginData(userId, personId, roleId)

                        // Verificar el rol y redirigir
                        when (roleId) {
                            "recolector" -> {
                                val farmId = sharedPreferences.getString("farmId", null)
                                if (farmId != null) {
                                    startActivity(Intent(this, InicioActivity::class.java))
                                } else {
                                    startActivity(Intent(this, JoinFarmFragment::class.java))
                                }
                            }
                            "admin" -> {
                                startActivity(Intent(this, InicioActivity::class.java))
                            }
                            else -> {
                                startActivity(Intent(this, InicioActivity::class.java))
                            }
                        }
                        finish() // Cerrar la actividad de login
                    } else {
                        Toast.makeText(this, "Error de autenticación. Intenta nuevamente.", Toast.LENGTH_LONG).show()
                    }

                }, { error ->
                    Toast.makeText(this, "Error en el login. Verifica tus credenciales.", Toast.LENGTH_LONG).show()
                })
            } else {
                Toast.makeText(this, "Por favor, llena todos los campos", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun saveLoginData(userId: String, personId: String, roleId: String) {
        val sharedPreferences = getSharedPreferences("APP_PREFS", MODE_PRIVATE)
        with(sharedPreferences.edit()) {
            putString("userId", userId)
            putString("personId", personId)
            putString("roleId", roleId)
            if (rememberMeSwitch.isChecked) {
                putString("username", usernameField.text.toString().trim())
                putString("password", passwordField.text.toString().trim())
                putBoolean("isLogged", true) // Marcar como logueado
            } else {
                clearSavedCredentials() // Limpiar credenciales si no se seleccionó
            }
            apply()
        }
        Log.d("LoginActivity", "Login data saved: userId = $userId, personId = $personId")
    }

    private fun clearSavedCredentials() {
        val editor = sharedPreferences.edit()
        editor.clear() // Limpia todas las credenciales guardadas
        editor.apply()
    }


    private fun checkSavedCredentials() {
        // Obtener credenciales guardadas
        val savedUsername = sharedPreferences.getString("username", null)
        val savedPassword = sharedPreferences.getString("password", null)

        if (!savedUsername.isNullOrEmpty() && !savedPassword.isNullOrEmpty()) {
            usernameField.setText(savedUsername)
            passwordField.setText(savedPassword)
            rememberMeSwitch.isChecked = true // Mantener el switch activado
        }

        // Verificar si el usuario ya está logueado y redirigir según su rol
        val isLogged = sharedPreferences.getBoolean("isLogged", false)
        val roleId = sharedPreferences.getString("roleId", null)

        if (isLogged && roleId != null) {
            when (roleId) {
                "recolector" -> {
                    val farmId = sharedPreferences.getString("farmId", null)
                    if (farmId != null) {
                        startActivity(Intent(this, InicioActivity::class.java))
                    } else {
                        startActivity(Intent(this, JoinFarmFragment::class.java))
                    }
                }
                "admin" -> {
                    startActivity(Intent(this, InicioActivity::class.java))
                }
                else -> {
                    startActivity(Intent(this, InicioActivity::class.java))
                }
            }
            finish() // Cerrar la actividad de login
        }
    }


}
