package com.sena.libreriaapi

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.sena.libreriaapi.adapter.Liquidation
import com.sena.libreriaapi.adapter.LiquidationAdapter
import com.sena.libreriaapi.config.Url
import okhttp3.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException

class ListLiquidationsFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: LiquidationAdapter
    private val client = OkHttpClient()
    private val liquidationList = mutableListOf<Liquidation>() // Cambiado a lista mutable

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_list_liquidations, container, false)

        // Inicializa el RecyclerView
        recyclerView = view.findViewById(R.id.recycler_liquidations)
        recyclerView.layoutManager = LinearLayoutManager(context)

        // Cargar las liquidaciones
        loadLiquidations()

        return view
    }

    private fun loadLiquidations() {
        val request = Request.Builder()
            .url(Url.LIQUIDATION_URL) // URL de Liquidation
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al cargar liquidaciones", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    response.body?.let { responseBody ->
                        val liquidationsJson = JSONArray(responseBody.string())
                        val personIds = mutableSetOf<Int>()

                        for (i in 0 until liquidationsJson.length()) {
                            val liquidationJson = liquidationsJson.getJSONObject(i)
                            val id = liquidationJson.getInt("id") // Obtén el id
                            val totalKilo = liquidationJson.getDouble("totalKilo")
                            val totalBenefit = liquidationJson.getDouble("totalBenefit")
                            val totalPay = liquidationJson.getDouble("totalPay")
                            val personId = liquidationJson.getInt("personId")

                            personIds.add(personId)
                            liquidationList.add(
                                Liquidation(
                                    id = id, // Asigna el id
                                    totalKilo = totalKilo,
                                    totalBenefit = totalBenefit,
                                    totalPay = totalPay,
                                    personId = personId
                                )
                            )
                        }

                        // Cargar los nombres de las personas una vez que tenemos las liquidaciones
                        loadPersonNames(personIds.toList()) { personNames ->
                            activity?.runOnUiThread {
                                adapter = LiquidationAdapter(liquidationList, personNames) { liquidation ->
                                    deleteLiquidation(liquidation) // Pasamos la liquidación a eliminar
                                }
                                recyclerView.adapter = adapter
                            }
                        }
                    }
                }
            }
        })
    }

    private fun loadPersonNames(personIds: List<Int>, callback: (Map<Int, String>) -> Unit) {
        val personNames = mutableMapOf<Int, String>()

        personIds.forEach { personId ->
            val request = Request.Builder()
                .url("${Url.PERSON_URL}/$personId") // URL de Person
                .build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    activity?.runOnUiThread {
                        Toast.makeText(context, "Error al cargar personas", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onResponse(call: Call, response: Response) {
                    if (response.isSuccessful) {
                        response.body?.let { responseBody ->
                            val personJson = JSONObject(responseBody.string())
                            val personName = "${personJson.getString("firstName")} ${personJson.getString("firstLastName")}"
                            personNames[personId] = personName
                        }
                    }

                    if (personNames.size == personIds.size) {
                        callback(personNames)
                    }
                }
            })
        }
    }

    // Función para eliminar una liquidación
    private fun deleteLiquidation(liquidation: Liquidation) {
        val builder = androidx.appcompat.app.AlertDialog.Builder(requireContext())
        builder.setTitle("¿Estás seguro?")
            .setMessage("¡Esta acción no se puede deshacer!")
            .setPositiveButton("Sí, eliminar") { _, _ ->

                // Ejecutar la solicitud DELETE
                val request = Request.Builder()
                    .delete()
                    .url("${Url.LIQUIDATION_URL}/${liquidation.id}") // Cambiar a liquidation.id
                    .build()

                client.newCall(request).enqueue(object : Callback {
                    override fun onFailure(call: Call, e: IOException) {
                        activity?.runOnUiThread {
                            Toast.makeText(context, "Error al eliminar liquidación", Toast.LENGTH_SHORT).show()
                        }
                    }

                    override fun onResponse(call: Call, response: Response) {
                        if (response.isSuccessful) {
                            activity?.runOnUiThread {
                                adapter.removeLiquidation(liquidation)
                                Toast.makeText(context, "Liquidación eliminada", Toast.LENGTH_SHORT).show()
                            }
                        }
                    }
                })
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }
}
