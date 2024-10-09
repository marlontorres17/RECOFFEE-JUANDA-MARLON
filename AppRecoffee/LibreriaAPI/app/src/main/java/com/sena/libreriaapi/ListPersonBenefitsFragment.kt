package com.sena.libreriaapi

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.sena.libreriaapi.adapter.PersonBenefit
import com.sena.libreriaapi.adapter.PersonBenefitAdapter
import com.sena.libreriaapi.config.Url
import okhttp3.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException

class ListPersonBenefitsFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: PersonBenefitAdapter
    private val client = OkHttpClient()
    private val personBenefitList = mutableListOf<PersonBenefit>()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_list_person_benefits, container, false)

        recyclerView = view.findViewById(R.id.recycler_person_benefits)
        recyclerView.layoutManager = LinearLayoutManager(context)

        loadPersonBenefits()

        return view
    }

    private fun loadPersonBenefits() {
        val request = Request.Builder()
            .url(Url.PERSON_BENEFIT_URL)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Error al cargar los beneficios de personas", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    response.body?.let { responseBody ->
                        val personBenefitsJson = JSONArray(responseBody.string())
                        val personIds = mutableSetOf<Int>()
                        val benefitIds = mutableSetOf<Int>()

                        for (i in 0 until personBenefitsJson.length()) {
                            val personBenefitJson = personBenefitsJson.getJSONObject(i)
                            val id = personBenefitJson.getInt("id")
                            val date = personBenefitJson.getString("date")
                            val price = personBenefitJson.getDouble("price")
                            val amount = personBenefitJson.getInt("amount")
                            val personId = personBenefitJson.getInt("personId")
                            val benefitId = personBenefitJson.getInt("benefitId")
                            val state = personBenefitJson.getBoolean("state")

                            personIds.add(personId)
                            benefitIds.add(benefitId)
                            personBenefitList.add(
                                PersonBenefit(
                                    id = id,
                                    date = date,
                                    price = price,
                                    amount = amount,
                                    personId = personId,
                                    benefitId = benefitId,
                                    state = state
                                )
                            )
                        }

                        loadPersonAndBenefitNames(personIds.toList(), benefitIds.toList()) { personNames, benefitNames ->
                            activity?.runOnUiThread {
                                adapter = PersonBenefitAdapter(personBenefitList, personNames, benefitNames)
                                recyclerView.adapter = adapter
                            }
                        }
                    }
                }
            }
        })
    }

    private fun loadPersonAndBenefitNames(personIds: List<Int>, benefitIds: List<Int>, callback: (Map<Int, String>, Map<Int, String>) -> Unit) {
        val personNames = mutableMapOf<Int, String>()
        val benefitNames = mutableMapOf<Int, String>()

        // Cargar nombres de personas
        personIds.forEach { personId ->
            val request = Request.Builder()
                .url("${Url.PERSON_URL}/$personId")
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

                    if (personNames.size == personIds.size && benefitNames.size == benefitIds.size) {
                        callback(personNames, benefitNames)
                    }
                }
            })
        }

        // Cargar nombres de beneficios
        benefitIds.forEach { benefitId ->
            val request = Request.Builder()
                .url("${Url.BENEFIT_URL}/$benefitId")
                .build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    activity?.runOnUiThread {
                        Toast.makeText(context, "Error al cargar beneficios", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onResponse(call: Call, response: Response) {
                    if (response.isSuccessful) {
                        response.body?.let { responseBody ->
                            val benefitJson = JSONObject(responseBody.string())
                            val benefitName = benefitJson.getString("name")
                            benefitNames[benefitId] = benefitName
                        }
                    }

                    if (personNames.size == personIds.size && benefitNames.size == benefitIds.size) {
                        callback(personNames, benefitNames)
                    }
                }
            })
        }
    }
}
