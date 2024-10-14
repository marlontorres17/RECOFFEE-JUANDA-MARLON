package com.sena.libreriaapi

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.sena.libreriaapi.config.Url
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.TimeUnit

class ResetPasswordActivity : AppCompatActivity() {

    private lateinit var emailInput: EditText
    private lateinit var resetCodeInput: EditText
    private lateinit var newPasswordInput: EditText
    private lateinit var requestCodeButton: Button
    private lateinit var resetPasswordButton: Button
    private lateinit var progressBar: ProgressBar

    // Ajusta los tiempos de espera aquí
    private val client = OkHttpClient.Builder()
        .connectTimeout(55, TimeUnit.SECONDS) // Aumenta el tiempo de espera de conexión
        .readTimeout(55, TimeUnit.SECONDS) // Aumenta el tiempo de espera de lectura
        .writeTimeout(55, TimeUnit.SECONDS) // Aumenta el tiempo de espera de escritura
        .build()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_reset_password)

        // Inicializar vistas
        emailInput = findViewById(R.id.emailInput)
        resetCodeInput = findViewById(R.id.resetCodeInput)
        newPasswordInput = findViewById(R.id.newPasswordInput)
        requestCodeButton = findViewById(R.id.requestCodeButton)
        resetPasswordButton = findViewById(R.id.resetPasswordButton)
        progressBar = findViewById(R.id.progressBar)

        resetPasswordButton.visibility = View.GONE
        resetCodeInput.visibility = View.GONE
        newPasswordInput.visibility = View.GONE

        // Listener para solicitar código de restablecimiento
        requestCodeButton.setOnClickListener {
            requestResetCode()
        }

        // Listener para restablecer la contraseña
        resetPasswordButton.setOnClickListener {
            resetPassword()
        }

        // Deshabilitar botón de solicitar código si el campo email está vacío
        emailInput.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                requestCodeButton.isEnabled = s.toString().isNotEmpty()
            }

            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
        })
    }

    // Método para solicitar el código de restablecimiento
    private fun requestResetCode() {
        val email = emailInput.text.toString().trim()

        if (email.isEmpty()) {
            Toast.makeText(this, "Por favor ingresa un correo electrónico válido", Toast.LENGTH_SHORT).show()
            return
        }

        showProgress(true)

        val jsonBody = JSONObject()
        jsonBody.put("email", email)

        val requestBody = RequestBody.create("application/json; charset=utf-8".toMediaTypeOrNull(), jsonBody.toString())

        val request = Request.Builder()
            .url(Url.FORGOT_PASSWORD_URL)
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    showProgress(false)
                    Toast.makeText(this@ResetPasswordActivity, "Error de conexión. Inténtalo de nuevo: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                runOnUiThread {
                    showProgress(false)
                    if (response.isSuccessful) {
                        // Si el código fue enviado correctamente
                        emailInput.isEnabled = false
                        resetCodeInput.visibility = View.VISIBLE
                        newPasswordInput.visibility = View.VISIBLE
                        resetPasswordButton.visibility = View.VISIBLE
                        requestCodeButton.visibility = View.GONE
                        Toast.makeText(this@ResetPasswordActivity, "Código de restablecimiento enviado.", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(this@ResetPasswordActivity, "Error al enviar el código. Verifica el correo ingresado.", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }

    // Método para restablecer la contraseña
    private fun resetPassword() {
        val resetCode = resetCodeInput.text.toString().trim()
        val newPassword = newPasswordInput.text.toString().trim()

        if (resetCode.isEmpty() || newPassword.isEmpty()) {
            Toast.makeText(this, "Por favor completa todos los campos.", Toast.LENGTH_SHORT).show()
            return
        }

        // Validación de la contraseña
        if (!isValidPassword(newPassword)) {
            Toast.makeText(this, "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.", Toast.LENGTH_SHORT).show()
            return
        }

        showProgress(true)

        val jsonBody = JSONObject()
        jsonBody.put("email", emailInput.text.toString())
        jsonBody.put("resetCode", resetCode)
        jsonBody.put("newPassword", newPassword)

        val requestBody = RequestBody.create("application/json; charset=utf-8".toMediaTypeOrNull(), jsonBody.toString())

        val request = Request.Builder()
            .url(Url.RESET_PASSWORD_URL)
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    showProgress(false)
                    Toast.makeText(this@ResetPasswordActivity, "Error de conexión: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                runOnUiThread {
                    showProgress(false)
                    if (response.isSuccessful) {
                        Toast.makeText(this@ResetPasswordActivity, "Contraseña restablecida con éxito.", Toast.LENGTH_SHORT).show()
                        finish() // Cierra la actividad o navega a otra pantalla
                    } else {
                        Toast.makeText(this@ResetPasswordActivity, "Código de restablecimiento incorrecto o expirado.", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }

    // Método para validar la contraseña
    private fun isValidPassword(password: String): Boolean {
        return password.length >= 8 &&
                password.any { it.isUpperCase() } &&
                password.any { it.isDigit() } &&
                password.any { !it.isLetterOrDigit() }
    }

    // Método para mostrar/ocultar el ProgressBar
    private fun showProgress(show: Boolean) {
        progressBar.visibility = if (show) View.VISIBLE else View.GONE
        requestCodeButton.isEnabled = !show
        resetPasswordButton.isEnabled = !show
    }
}
