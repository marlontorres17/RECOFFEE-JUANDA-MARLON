package com.sena.libreriaapi

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.sena.libreriaapi.config.Url
import okhttp3.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException

class CollectorFarmFragment : Fragment() {

    private lateinit var etFarmCode: EditText
    private lateinit var btnFetchCollectors: Button
    private lateinit var collectorsContainer: LinearLayout
    private lateinit var tvNoCollectors: TextView

    private val client = OkHttpClient()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val view = inflater.inflate(R.layout.fragment_collector_farm, container, false)

        etFarmCode = view.findViewById(R.id.etFarmCode)
        btnFetchCollectors = view.findViewById(R.id.btnFetchCollectors)
        collectorsContainer = view.findViewById(R.id.collectorsContainer)
        tvNoCollectors = view.findViewById(R.id.tvNoCollectors)

        btnFetchCollectors.setOnClickListener {
            fetchCollectors()
        }

        return view
    }

    private fun fetchCollectors() {
        val farmCode = etFarmCode.text.toString().trim()

        if (farmCode.isEmpty()) {
            Toast.makeText(requireContext(), "El código de finca es requerido.", Toast.LENGTH_SHORT).show()
            return
        }

        val url = "${Url.COLLECTOR_FARM_URL}/$farmCode"  // Asegúrate de que la URL esté correcta

        val request = Request.Builder()
            .url(url)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                requireActivity().runOnUiThread {
                    Toast.makeText(requireContext(), "Error al obtener los recolectores.", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                requireActivity().runOnUiThread {
                    collectorsContainer.removeAllViews()
                    tvNoCollectors.visibility = View.GONE

                    if (response.isSuccessful) {
                        val responseBody = response.body?.string()

                        try {
                            val jsonArray = JSONArray(responseBody)
                            if (jsonArray.length() == 0) {
                                tvNoCollectors.visibility = View.VISIBLE
                            } else {
                                for (i in 0 until jsonArray.length()) {
                                    val collector = jsonArray.getJSONObject(i)
                                    addCollectorView(collector)
                                }
                            }
                        } catch (e: Exception) {
                            // Captura posibles errores al procesar el JSON
                            Toast.makeText(requireContext(), "Error procesando datos del servidor.", Toast.LENGTH_SHORT).show()
                            e.printStackTrace()
                        }
                    } else {
                        Toast.makeText(requireContext(), "No se encontraron recolectores.", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }

    private fun addCollectorView(collector: JSONObject) {
        val view = LayoutInflater.from(requireContext()).inflate(R.layout.collector_item, collectorsContainer, false)
        val nameTextView: TextView = view.findViewById(R.id.collectorName)
        val documentTextView: TextView = view.findViewById(R.id.collectorDocument)
        val genderTextView: TextView = view.findViewById(R.id.collectorGender)
        val birthDateTextView: TextView = view.findViewById(R.id.collectorBirthDate)
        val startDateTextView: TextView = view.findViewById(R.id.collectorStartDate)

        nameTextView.text = "${collector.getString("firstName")} ${collector.getString("firstLastName")}"
        documentTextView.text = "Documento: ${collector.getString("numberDocument")}"
        genderTextView.text = "Género: ${collector.getString("gender")}"
        birthDateTextView.text = "Fecha de Nacimiento: ${collector.getString("dateOfBirth")}"
        startDateTextView.text = "Fecha de Inicio: ${collector.getString("dateStart")}"

        collectorsContainer.addView(view)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        // Limpiar la vista de recolectores y otras variables
        collectorsContainer.removeAllViews()
        etFarmCode.text.clear()
        tvNoCollectors.visibility = View.GONE
    }

    override fun onStop() {
        super.onStop()
        // Remover el fragmento para forzar la recreación
        parentFragmentManager.beginTransaction().remove(this).commit()
    }
}
