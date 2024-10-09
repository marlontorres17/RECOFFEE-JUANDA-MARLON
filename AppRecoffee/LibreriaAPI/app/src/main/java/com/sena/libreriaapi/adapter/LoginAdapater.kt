package com.sena.libreriaapi.adapter

import android.content.Context
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley

import com.sena.libreriaapi.config.Url
import org.json.JSONObject

class LoginAdapter(context: Context) {

    private var requestQueue: RequestQueue = Volley.newRequestQueue(context)

    fun login(username: String, password: String, successCallback: (response: JSONObject) -> Unit, errorCallback: (error: String) -> Unit) {
        val url = Url.LOGIN_URL

        val params = JSONObject()
        params.put("userName", username)
        params.put("password", password)

        val jsonObjectRequest = JsonObjectRequest(Request.Method.POST, url, params,
            Response.Listener { response ->
                successCallback(response)
            },
            Response.ErrorListener { error ->
                errorCallback(error.toString())
            }
        )

        requestQueue.add(jsonObjectRequest)
    }
}