package com.sena.libreriaapi

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.sena.libreriaapi.adapter.Lot
import com.sena.libreriaapi.adapter.LotAdapter
import com.sena.libreriaapi.config.Url
import okhttp3.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException

class ListLotsFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: LotAdapter
    private val client = OkHttpClient()
    private val lotList = mutableListOf<Lot>()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_list_lots, container, false)

        recyclerView = view.findViewById(R.id.recycler_lots)
        recyclerView.layoutManager = LinearLayoutManager(context)

        loadLots()

        return view
    }

    private fun loadLots() {
        val request = Request.Builder()
            .url(Url.LOT_URL)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al cargar los lotes", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    response.body?.let { responseBody ->
                        val lotsJson = JSONArray(responseBody.string())
                        val farmIds = mutableSetOf<Int>()

                        for (i in 0 until lotsJson.length()) {
                            val lotJson = lotsJson.getJSONObject(i)
                            val id = lotJson.getInt("id")
                            val name = lotJson.getString("name")
                            val description = lotJson.getString("description")
                            val sizeMeters = lotJson.getInt("sizeMeters")
                            val farmId = lotJson.getInt("farmId")
                            val state = lotJson.getBoolean("state")

                            farmIds.add(farmId)
                            lotList.add(
                                Lot(
                                    id = id,
                                    name = name,
                                    description = description,
                                    sizeMeters = sizeMeters,
                                    farmId = farmId,
                                    state = state
                                )
                            )
                        }

                        loadFarmNames(farmIds.toList()) { farmNames ->
                            activity?.runOnUiThread {
                                adapter = LotAdapter(lotList, farmNames)
                                recyclerView.adapter = adapter
                            }
                        }
                    }
                }
            }
        })
    }

    private fun loadFarmNames(farmIds: List<Int>, callback: (Map<Int, String>) -> Unit) {
        val farmNames = mutableMapOf<Int, String>()

        farmIds.forEach { farmId ->
            val request = Request.Builder()
                .url("${Url.FARM_URL}/$farmId")
                .build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    activity?.runOnUiThread {
                        Toast.makeText(context, "Error al cargar las fincas", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onResponse(call: Call, response: Response) {
                    if (response.isSuccessful) {
                        response.body?.let { responseBody ->
                            val farmJson = JSONObject(responseBody.string())
                            val farmName = farmJson.getString("name")
                            farmNames[farmId] = farmName
                        }
                    }

                    if (farmNames.size == farmIds.size) {
                        callback(farmNames)
                    }
                }
            })
        }
    }
}
