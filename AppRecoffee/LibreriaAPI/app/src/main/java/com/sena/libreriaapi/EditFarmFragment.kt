package com.sena.libreriaapi

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Spinner
import androidx.fragment.app.Fragment
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.VolleyError
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.sena.libreriaapi.config.Url
import org.json.JSONException
import org.json.JSONObject

class EditFarmFragment : Fragment() {

    private lateinit var etName: EditText
    private lateinit var etDescription: EditText
    private lateinit var etSize: EditText
    private lateinit var etCoordinate: EditText
    private lateinit var spinnerPerson: Spinner
    private lateinit var spinnerCity: Spinner
    private lateinit var btnSaveFarm: Button

    private var farmId: Int = 0

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.fragment_edit_farm, container, false)

        etName = view.findViewById(R.id.et_name)
        etDescription = view.findViewById(R.id.et_description)
        etSize = view.findViewById(R.id.et_size)
        etCoordinate = view.findViewById(R.id.et_coordinate)
        spinnerPerson = view.findViewById(R.id.spinner_persona)
        spinnerCity = view.findViewById(R.id.spinner_ciudad)
        btnSaveFarm = view.findViewById(R.id.btn_save_farm)

        // Obtén el ID de la finca desde los argumentos
        farmId = arguments?.getInt("farmId") ?: 0

        // Cargar datos de la finca
        loadFarmData()

        btnSaveFarm.setOnClickListener {
            updateFarm()
        }

        return view
    }

    private fun loadFarmData() {
        val url = "${Url.FARM_URL}/$farmId"

        val queue: RequestQueue = Volley.newRequestQueue(activity)
        val jsonObjectRequest = JsonObjectRequest(Request.Method.GET, url, null,
            Response.Listener { response ->
                try {
                    etName.setText(response.getString("name"))
                    etDescription.setText(response.getString("description"))
                    etSize.setText(response.getInt("sizeMeter").toString())
                    etCoordinate.setText(response.getString("coordinate"))
                    // Aquí puedes establecer los valores para los spinners
                } catch (e: JSONException) {
                    e.printStackTrace()
                }
            }, Response.ErrorListener { error: VolleyError ->
                error.printStackTrace()
            })

        queue.add(jsonObjectRequest)
    }

    private fun updateFarm() {
        val url = "${Url.FARM_URL}/$farmId"

        val farmData = JSONObject()
        try {
            farmData.put("name", etName.text.toString())
            farmData.put("description", etDescription.text.toString())
            farmData.put("sizeMeter", etSize.text.toString().toInt())
            farmData.put("coordinate", etCoordinate.text.toString())
            // Agrega los valores seleccionados de los spinners aquí

            val queue: RequestQueue = Volley.newRequestQueue(activity)
            val jsonObjectRequest = JsonObjectRequest(Request.Method.PUT, url, farmData,
                Response.Listener { response ->
                    // Manejo de la respuesta después de actualizar
                }, Response.ErrorListener { error: VolleyError ->
                    error.printStackTrace()
                })

            queue.add(jsonObjectRequest)
        } catch (e: JSONException) {
            e.printStackTrace()
        }
    }
}
