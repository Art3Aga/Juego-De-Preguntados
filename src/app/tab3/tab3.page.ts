import { UserService } from './../services/usuario/user.service';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  usuarioStorage:any
  puntajesJugadores:Observable<any[]>
  constructor(public afDB:AngularFireDatabase, public storage:Storage, 
    public _userService:UserService, public navController: NavController, 
    public loadingController:LoadingController) {
    this.puntajesJugadores = this.afDB.list(`jugadores`).valueChanges()
    this.usuarioStorage = this._userService.usuario
    //console.log(this.usuarioStorage);
    
  }
  salir(){
    this.loadingController.create({
      message: 'Adios',
      spinner: 'lines-small',
      duration: 1500
    }).then((loading)=>{loading.present()})
    this.usuarioStorage = {}
    this.navController.navigateBack('/login')
  }

}
