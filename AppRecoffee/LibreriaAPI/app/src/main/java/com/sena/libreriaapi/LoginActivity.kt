package com.sena.libreriaapi

import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
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

        val registerTextView: TextView = findViewById(R.id.register_text_view) // Asegúrate de que el ID sea correcto

        registerTextView.setOnClickListener {
            val intent = Intent(this, RegistroActivity::class.java)
            startActivity(intent)
        }

        val btnCrearUsuario = findViewById<Button>(R.id.crear)

        // Listener para el botón
        btnCrearUsuario.setOnClickListener {
            // Iniciar CreateUserActivity cuando se haga clic en el botón
            val intent = Intent(this, CreateUserActivity::class.java)
            startActivity(intent)
        }




        loginButton.setOnClickListener {
            val username = usernameField.text.toString().trim()
            val password = passwordField.text.toString().trim()

            if (username.isNotEmpty() && password.isNotEmpty()) {
                loginAdapter.login(username, password, { response ->
                    // Login exitoso, redirigir a la actividad de inicio
                    Toast.makeText(this, "Login exitoso", Toast.LENGTH_LONG).show()

                    // Guardar las credenciales si el usuario selecciona "Recordarme"
                    if (rememberMeSwitch.isChecked) {
                        saveCredentials(username, password)
                    } else {
                        clearSavedCredentials() // Limpiar si no selecciona "Recordarme"
                    }

                    val intent = Intent(this, InicioActivity::class.java)
                    startActivity(intent)
                    finish()
                }, { error ->
                    // Mostrar mensaje de error
                    Toast.makeText(this, "Registrese para continuar", Toast.LENGTH_LONG).show()
                })
            } else {
                Toast.makeText(this, "Por favor, llena todos los campos", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun checkSavedCredentials() {
        // Obtener credenciales guardadas
        val savedUsername = sharedPreferences.getString("username", null)
        val savedPassword = sharedPreferences.getString("password", null)

        if (!savedUsername.isNullOrEmpty() && !savedPassword.isNullOrEmpty()) {
            // Autocompletar los campos si las credenciales están guardadas
            usernameField.setText(savedUsername)
            passwordField.setText(savedPassword)
            rememberMeSwitch.isChecked = true // Mantener el switch activado
        }
    }

    private fun saveCredentials(username: String, password: String) {
        // Guardar credenciales en SharedPreferences
        val editor = sharedPreferences.edit()
        editor.putString("username", username)
        editor.putString("password", password)
        editor.apply()
    }

    private fun clearSavedCredentials() {
        // Limpiar las credenciales guardadas
        val editor = sharedPreferences.edit()
        editor.remove("username")
        editor.remove("password")
        editor.apply()
    }
}
