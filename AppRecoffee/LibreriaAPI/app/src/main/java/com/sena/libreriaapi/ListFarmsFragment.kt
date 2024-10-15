package com.sena.libreriaapi

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.sena.libreriaapi.adapter.Farm
import com.sena.libreriaapi.adapter.FarmAdapter
import com.sena.libreriaapi.config.Url
import okhttp3.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException

class ListFarmsFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: FarmAdapter
    private val client = OkHttpClient()
    private val farmList = mutableListOf<Farm>()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_list_farms, container, false)

        recyclerView = view.findViewById(R.id.recycler_farms)
        recyclerView.layoutManager = LinearLayoutManager(context)

        loadFarms()

        return view
    }

    private fun loadFarms() {
        val request = Request.Builder()
            .url(Url.FARM_URL)
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
                        val farmsJson = JSONArray(responseBody.string())
                        val personIds = mutableSetOf<Int>()
                        val cityIds = mutableSetOf<Int>()

                        for (i in 0 until farmsJson.length()) {
                            val farmJson = farmsJson.getJSONObject(i)
                            val id = farmJson.getInt("id")
                            val name = farmJson.getString("name")
                            val description = farmJson.getString("description")
                            val sizeMeter = farmJson.getInt("sizeMeter")
                            val coordinate = farmJson.getString("coordinate")
                            val codeUnique = farmJson.getString("codeUnique")
                            val personId = farmJson.getInt("personId")
                            val cityId = farmJson.getInt("cityId")
                            val state = farmJson.getBoolean("state")

                            personIds.add(personId)
                            cityIds.add(cityId)

                            farmList.add(
                                Farm(
                                    id = id,
                                    name = name,
                                    description = description,
                                    sizeMeter = sizeMeter,
                                    coordinate = coordinate,
                                    codeUnique = codeUnique,
                                    personId = personId,
                                    cityId = cityId,
                                    state = state
                                )
                            )
                        }

                        loadPersonNames(personIds.toList()) { personNames ->
                            loadCityNames(cityIds.toList()) { cityNames ->
                                activity?.runOnUiThread {
                                    adapter = FarmAdapter(farmList, personNames, cityNames)
                                    recyclerView.adapter = adapter
                                }
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
                .url("${Url.PERSON_URL}/$personId")
                .build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    activity?.runOnUiThread {
                        Toast.makeText(context, "Error al cargar las personas", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onResponse(call: Call, response: Response) {
                    if (response.isSuccessful) {
                        response.body?.let { responseBody ->
                            val personJson = JSONObject(responseBody.string())
                            val personName = "${personJson.getString("firstLastName")} ${personJson.getString("secondLastName")} ${personJson.getString("firstName")} ${personJson.getString("secondName")}"
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

    private fun loadCityNames(cityIds: List<Int>, callback: (Map<Int, String>) -> Unit) {
        val cityNames = mutableMapOf<Int, String>()

        cityIds.forEach { cityId ->
            val request = Request.Builder()
                .url("${Url.CITY_URL}/$cityId")
                .build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    activity?.runOnUiThread {
                        Toast.makeText(context, "Error al cargar las ciudades", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onResponse(call: Call, response: Response) {
                    if (response.isSuccessful) {
                        response.body?.let { responseBody ->
                            val cityJson = JSONObject(responseBody.string())
                            val cityName = cityJson.getString("name")
                            cityNames[cityId] = cityName
                        }
                    }

                    if (cityNames.size == cityIds.size) {
                        callback(cityNames)
                    }
                }
            })
        }
    }
}
