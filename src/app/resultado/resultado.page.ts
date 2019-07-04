import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.page.html',
  styleUrls: ['./resultado.page.scss'],
})
export class ResultadoPage implements OnInit {
  //puntaje:any
  usuario:any = {}
  //puntaje:Observable<any>

  constructor(public afDB:AngularFireDatabase, public navController:NavController,
    public activated:ActivatedRoute, public route:Router) { 
    this.activated.queryParams.subscribe(valor=>{
      if(this.route.getCurrentNavigation().extras.state){
        this.usuario = this.route.getCurrentNavigation().extras.state.user
      }
    })
    /*this.afDB.object(`registro/${this.usuario}/Preguntas`).valueChanges().subscribe(punta=>{
      this.puntaje = punta['puntaje']
      console.log(punta['puntaje']);
    })*/
  }

  ngOnInit() {
  }
  volverJugar(){
    this.navController.navigateBack('/tabs/tab2', {animated:true})
  }

}
