package com.sena.libreriaapi

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.sena.libreriaapi.adapter.CollectionDetail
import com.sena.libreriaapi.adapter.CollectionDetailAdapter
import com.sena.libreriaapi.config.Url
import okhttp3.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException

class ListCollectionDetailsFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: CollectionDetailAdapter
    private val client = OkHttpClient()
    private val collectionDetailList = mutableListOf<CollectionDetail>()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_list_collection_details, container, false)

        recyclerView = view.findViewById(R.id.recycler_collection_details)
        recyclerView.layoutManager = LinearLayoutManager(context)

        loadCollectionDetails()

        return view
    }

    private fun loadCollectionDetails() {
        val request = Request.Builder()
            .url(Url.COLLECTION_DETAIL_URL)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al cargar los detalles de recolección", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    response.body?.let { responseBody ->
                        val collectionDetailsJson = JSONArray(responseBody.string())
                        val personIds = mutableSetOf<Int>()
                        val harvestIds = mutableSetOf<Int>()

                        for (i in 0 until collectionDetailsJson.length()) {
                            val collectionDetailJson = collectionDetailsJson.getJSONObject(i)
                            val id = collectionDetailJson.getInt("id")
                            val kilo = collectionDetailJson.getInt("kilo")
                            val stage = collectionDetailJson.getString("stage")
                            val personId = collectionDetailJson.getInt("personId")
                            val harvestId = collectionDetailJson.getInt("harvestId")
                            val state = collectionDetailJson.getBoolean("state")

                            personIds.add(personId)
                            harvestIds.add(harvestId)
                            collectionDetailList.add(
                                CollectionDetail(
                                    id = id,
                                    kilo = kilo,
                                    stage = stage,
                                    personId = personId,
                                    harvestId = harvestId,
                                    state = state
                                )
                            )
                        }

                        loadPersonNames(personIds.toList()) { personNames ->
                            loadHarvestDates(harvestIds.toList()) { harvestDates ->
                                activity?.runOnUiThread {
                                    adapter = CollectionDetailAdapter(collectionDetailList, personNames, harvestDates)
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

    private fun loadHarvestDates(harvestIds: List<Int>, callback: (Map<Int, String>) -> Unit) {
        val harvestDates = mutableMapOf<Int, String>()

        harvestIds.forEach { harvestId ->
            val request = Request.Builder()
                .url("${Url.HARVEST_URL}/$harvestId")
                .build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    activity?.runOnUiThread {
                        Toast.makeText(context, "Error al cargar las cosechas", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onResponse(call: Call, response: Response) {
                    if (response.isSuccessful) {
                        response.body?.let { responseBody ->
                            val harvestJson = JSONObject(responseBody.string())
                            val harvestDate = harvestJson.getString("date")
                            harvestDates[harvestId] = harvestDate
                        }
                    }

                    if (harvestDates.size == harvestIds.size) {
                        callback(harvestDates)
                    }
                }
            })
        }
    }
}
