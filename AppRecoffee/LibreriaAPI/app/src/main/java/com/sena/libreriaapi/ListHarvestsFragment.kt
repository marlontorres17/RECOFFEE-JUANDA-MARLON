package com.sena.libreriaapi

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.sena.libreriaapi.adapter.Harvest
import com.sena.libreriaapi.adapter.HarvestAdapter
import com.sena.libreriaapi.config.Url
import okhttp3.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException

class ListHarvestsFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: HarvestAdapter
    private val client = OkHttpClient()
    private val harvestList = mutableListOf<Harvest>()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_list_harvests, container, false)

        recyclerView = view.findViewById(R.id.recycler_harvests)
        recyclerView.layoutManager = LinearLayoutManager(context)

        loadHarvests()

        return view
    }

    private fun loadHarvests() {
        val request = Request.Builder()
            .url(Url.HARVEST_URL)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al cargar cosechas", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    response.body?.let { responseBody ->
                        val harvestsJson = JSONArray(responseBody.string())
                        val lotIds = mutableSetOf<Int>()

                        for (i in 0 until harvestsJson.length()) {
                            val harvestJson = harvestsJson.getJSONObject(i)
                            val id = harvestJson.getInt("id")
                            val date = harvestJson.getString("date")
                            val kiloPrice = harvestJson.getDouble("kiloPrice")
                            val lotId = harvestJson.getInt("lotId")
                            val state = harvestJson.getBoolean("state")

                            lotIds.add(lotId)
                            harvestList.add(
                                Harvest(
                                    id = id,
                                    date = date,
                                    kiloPrice = kiloPrice,
                                    lotId = lotId,
                                    state = state
                                )
                            )
                        }

                        loadLotNames(lotIds.toList()) { lotNames ->
                            activity?.runOnUiThread {
                                adapter = HarvestAdapter(harvestList, lotNames) { harvest ->
                                    deleteHarvest(harvest)
                                }
                                recyclerView.adapter = adapter
                            }
                        }
                    }
                }
            }
        })
    }

    private fun loadLotNames(lotIds: List<Int>, callback: (Map<Int, String>) -> Unit) {
        val lotNames = mutableMapOf<Int, String>()

        lotIds.forEach { lotId ->
            val request = Request.Builder()
                .url("${Url.LOT_URL}/$lotId")
                .build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    activity?.runOnUiThread {
                        Toast.makeText(context, "Error al cargar lotes", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onResponse(call: Call, response: Response) {
                    if (response.isSuccessful) {
                        response.body?.let { responseBody ->
                            val lotJson = JSONObject(responseBody.string())
                            val lotName = lotJson.getString("name")
                            lotNames[lotId] = lotName
                        }
                    }

                    if (lotNames.size == lotIds.size) {
                        callback(lotNames)
                    }
                }
            })
        }
    }

    private fun deleteHarvest(harvest: Harvest) {
        val builder = androidx.appcompat.app.AlertDialog.Builder(requireContext())
        builder.setTitle("¿Estás seguro?")
            .setMessage("¡Esta acción no se puede deshacer!")
            .setPositiveButton("Sí, eliminar") { _, _ ->

                val request = Request.Builder()
                    .delete()
                    .url("${Url.HARVEST_URL}/${harvest.id}")
                    .build()

                client.newCall(request).enqueue(object : Callback {
                    override fun onFailure(call: Call, e: IOException) {
                        activity?.runOnUiThread {
                            Toast.makeText(context, "Error al eliminar cosecha", Toast.LENGTH_SHORT).show()
                        }
                    }

                    override fun onResponse(call: Call, response: Response) {
                        if (response.isSuccessful) {
                            activity?.runOnUiThread {
                                adapter.removeHarvest(harvest)
                                Toast.makeText(context, "Cosecha eliminada", Toast.LENGTH_SHORT).show()
                            }
                        }
                    }
                })
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }
}
