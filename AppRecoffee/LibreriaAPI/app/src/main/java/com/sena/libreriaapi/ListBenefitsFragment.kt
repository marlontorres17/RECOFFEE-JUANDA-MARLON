package com.sena.libreriaapi

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.sena.libreriaapi.adapter.Benefit
import com.sena.libreriaapi.adapter.BenefitAdapter
import com.sena.libreriaapi.config.Url
import okhttp3.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException

class ListBenefitsFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: BenefitAdapter
    private val client = OkHttpClient()
    private val benefitList = mutableListOf<Benefit>()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_list_benefits, container, false)

        recyclerView = view.findViewById(R.id.recycler_benefits)
        recyclerView.layoutManager = LinearLayoutManager(context)

        loadBenefits()

        return view
    }

    private fun loadBenefits() {
        val request = Request.Builder()
            .url(Url.BENEFIT_URL)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al cargar los beneficios", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    response.body?.let { responseBody ->
                        val benefitsJson = JSONArray(responseBody.string())
                        val farmIds = mutableSetOf<Int>()

                        for (i in 0 until benefitsJson.length()) {
                            val benefitJson = benefitsJson.getJSONObject(i)
                            val id = benefitJson.getInt("id")
                            val name = benefitJson.getString("name")
                            val description = benefitJson.getString("description")
                            val cost = benefitJson.getDouble("cost")
                            val farmId = benefitJson.getInt("farmId")
                            val state = benefitJson.getBoolean("state")

                            farmIds.add(farmId)
                            benefitList.add(
                                Benefit(
                                    id = id,
                                    name = name,
                                    description = description,
                                    cost = cost,
                                    farmId = farmId,
                                    state = state
                                )
                            )
                        }

                        loadFarmNames(farmIds.toList()) { farmNames ->
                            activity?.runOnUiThread {
                                adapter = BenefitAdapter(benefitList, farmNames)
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
                        Toast.makeText(context, "Error al cargar las granjas", Toast.LENGTH_SHORT).show()
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
