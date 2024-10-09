package com.sena.libreriaapi

import android.os.Bundle
import android.view.MenuItem
import android.widget.PopupMenu
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import com.google.android.material.bottomnavigation.BottomNavigationView

class InicioActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_inicio)

        val navController = findNavController(R.id.fragmentContainer)
        val bottomNavigationView = findViewById<BottomNavigationView>(R.id.bottomNavigationView)

        bottomNavigationView.setOnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.homeFragment -> {
                    navController.navigate(R.id.homeFragment)
                    true
                }
                R.id.gestionFragment -> {
                    showGestionMenu(item)
                    true
                }
                R.id.reportesFragment -> {

                    showReporteMenu(item)
                    true
                }
                else -> false
            }
        }
    }

    private fun showGestionMenu(menuItem: MenuItem) {
        // Crear el PopupMenu
        val popupMenu = PopupMenu(this, findViewById(menuItem.itemId))
        popupMenu.menuInflater.inflate(R.menu.gestion_submenu, popupMenu.menu)

        popupMenu.setOnMenuItemClickListener { subItem ->
            val navController = findNavController(R.id.fragmentContainer)
            when (subItem.itemId) {
                R.id.crearFinca -> {
                    navController.navigate(R.id.crearFincaFragment)
                    true
                }

                R.id.recolecciones -> {
                    navController.navigate(R.id.recoleccionesFragment)
                    true
                }
                R.id.lot -> {
                    navController.navigate(R.id.createLotFragment)
                    true
                }

                R.id.collection -> {
                    navController.navigate(R.id.createCollectionDetailFragment)
                    true
                }

                R.id.benefit -> {
                    navController.navigate(R.id.createBenefitFragment)
                    true
                }

                R.id.personBenefit -> {
                    navController.navigate(R.id.createPersonBenefitFragment)
                    true
                }

                R.id.liquidation -> {
                    navController.navigate(R.id.createLiquidationFragment)
                    true
                }

                R.id.verLiquidation -> {
                    navController.navigate(R.id.listLiquidationsFragment)
                    true
                }

                R.id.verHarvest -> {
                    navController.navigate(R.id.listHarvestsFragment)
                    true
                }
                R.id.verPersonBenefit -> {
                    navController.navigate(R.id.listPersonBenefitsFragment)
                    true
                }

                R.id.verBenefit -> {
                    navController.navigate(R.id.listBenefitsFragment)
                    true
                }
                R.id.verCollectionDetail -> {
                    navController.navigate(R.id.listCollectionDetailsFragment)
                    true
                }
                R.id.verLot -> {
                    navController.navigate(R.id.listLotsFragment)
                    true
                }
                R.id.verFarm -> {
                    navController.navigate(R.id.listFarmsFragment)
                    true
                }
                else -> false
            }
        }
        popupMenu.show()
    }

    private fun showReporteMenu(menuItem: MenuItem) {
        // Crear el PopupMenu
        val popupMenu = PopupMenu(this, findViewById(menuItem.itemId))
        popupMenu.menuInflater.inflate(R.menu.reporte_submenu, popupMenu.menu)

        popupMenu.setOnMenuItemClickListener { subItem ->
            val navController = findNavController(R.id.fragmentContainer)
            when (subItem.itemId) {
                R.id.benefit -> {
                    navController.navigate(R.id.createBenefitFragment)
                    true
                }

                R.id.unirse -> {
                    navController.navigate(R.id.joinFarmFragment)
                    true
                }

                R.id.verCollector -> {
                    navController.navigate(R.id.collectorFarmFragment)
                    true
                }

                else -> false
            }
        }
        popupMenu.show()
    }
}
