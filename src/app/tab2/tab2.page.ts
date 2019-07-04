import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastController, NavController, ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ResultPage } from "../result/result.page";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  usuario:any = {}
  showButtonFin:boolean = false
  mensajeGameOver:string = ""
  gameOverColor:string = ''
  preguntaSeleccionada:any
  presente:number = 1
  categoriaPresente:string = ""
  deportes: Observable<any[]>;
  preguntas:Observable<any[]>
  respuestas:Observable<any[]>
  texto:string = ""
  puntaje:number = 0 
  vida:number = 3
  today = new Date()
  color:string = "light"
  disabled:boolean = false
  constructor(public afDB: AngularFireDatabase, public toastController:ToastController,
    public navController:NavController, public activated:ActivatedRoute, public route:Router,
    public modalController:ModalController, public alertController:AlertController) {
    this.deportes = afDB.list('preguntas/Deportes').valueChanges();
    this.siguiente()
    this.deportes = afDB.list('preguntas/Deportes').valueChanges();
    this.activated.queryParams.subscribe(valor=>{
      if(this.route.getCurrentNavigation().extras.state){
        this.usuario = this.route.getCurrentNavigation().extras.state.usuario
      }
    })
    //this.usuario = this.activated.snapshot.paramMap.get('valor')
  }
  siguiente(){
    /*this.afDB.list("preguntas/Deportes/preguntas").valueChanges().subscribe(pregunta=>{
      //console.log(pregunta[this.presente]);
      this.preguntaSeleccionada = pregunta[this.presente]
      this.presente++
      if(this.presente >= 0 && this.presente <=3){
        //Categoria: Deportes
        this.categoriaPresente = "Deportes"
      }
    })*/
    /*metodo siguiente */ 

    this.preguntas = this.afDB.list(`preguntas/pre${this.presente}/pregunta`).valueChanges()
    this.respuestas = this.afDB.list(`preguntas/pre${this.presente}/respuestas`).valueChanges()
    this.presente++
    this.disabled = false
    this.texto = ""
    if(this.presente > 7){
      //this.presente = 1
      this.mensaje(`Su puntaje es de: ${this.puntaje}`, 4000, 'primary')
      //GUARDAR EN PUNTAJE PERSONAL
      this.afDB.object(`registro/${this.usuario['usuario']}-${this.usuario['clave']}/Preguntas`).update({
        puntaje: this.puntaje
      })
      //GUARDAR EN PUNTAJE GLOBAL (DE TODOS LOS JUGADORES)
      this.afDB.object(`jugadores/${this.usuario['usuario']}-${this.usuario['clave']}`).update({
        Nombre: this.usuario['usuario'],
        Puntaje: this.puntaje,
        Fecha: `${this.getDate()}-${this.getTime()}`
      })
      this.volverJugar()
      //this.showButtonFin = true
      //this.gameOverColor = 'success'
      //this.mensajeGameOver = `Su puntaje es de: ${this.puntaje}`
      /*let navigationExtras:NavigationExtras ={
        state:{ user:this.usuario }
      }
      this.route.navigate(['/resultado'], navigationExtras)*/
      this.verResultado()
      this.puntaje = 0
      this.vida = 3
    }
    else if(this.vida == 0){
      //this.presente = 1
      this.mensaje('Vidas Terminadas', 3000, 'danger')
      //GUARDAR EN PUNTAJE PERSONAL
      this.afDB.object(`registro/${this.usuario['usuario']}-${this.usuario['clave']}/Preguntas`).update({
        puntaje: this.puntaje
      })
      //GUARDAR EN PUNTAJE GLOBAL (DE TODOS LOS JUGADORES)
      this.afDB.object(`jugadores/${this.usuario['usuario']}-${this.usuario['clave']}`).update({
        Nombre: this.usuario['usuario'],
        Puntaje: this.puntaje,
        Fecha: `${this.getDate()}-${this.getTime()}`
      })
      this.volverJugar()
      //this.showButtonFin = true
      //this.gameOverColor = 'danger'
      //this.mensajeGameOver = "Sus 3 Vidas han terminado"
      /*let navigationExtras:NavigationExtras ={
        state:{ user:this.usuario }
      }
      this.route.navigate(['/resultado'], navigationExtras)*/
      this.verResultado()
      this.puntaje = 0
      this.vida = 3
    }
    
  }
  getDate():string {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //Enero es 0
    let yyyy = today.getFullYear()
    let hoy:string = dd + '/' + mm + '/' + yyyy;
    return hoy
  }
  getTime():string{
    let horas = this.today.getHours()
    let minutos = this.today.getMinutes()
    let segundos = this.today.getSeconds()
    let tiempo = horas+":" + minutos+":" +segundos;
    return tiempo
  }
  async verResultado(){
    const modal = await this.modalController.create({
      component: ResultPage,
      componentProps: {
        user: this.usuario,
        puntaje: this.puntaje
      }
    })
    modal.present()
  }
  async mensaje(message, duration, color) {
    const toast = await this.toastController.create({
      message,
      duration,
      color
    });
    toast.present();
  }
  atras(){
    this.preguntas = this.afDB.list(`preguntas/pre${this.presente}/pregunta`).valueChanges()
    this.respuestas = this.afDB.list(`preguntas/pre${this.presente}/respuestas`).valueChanges()
    this.presente--
  }
  volverJugar(){
    this.presente = 1
    //this.puntaje = 0
    //this.showButtonFin = false
    this.preguntas = this.afDB.list(`preguntas/pre${this.presente}/pregunta`).valueChanges()
    this.respuestas = this.afDB.list(`preguntas/pre${this.presente}/respuestas`).valueChanges()
    
  }
  async presentAlert(header:string, message:string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'Terminar',
        handler: ()=>{
          this.presente = 1
        }
      }]
    });
  
    await alert.present();
  }
  contestar(respuesta:string){
    console.log(respuesta);
    this.disabled = true
    if(respuesta == "1990"){
      this.color = "success"
      this.texto = "Correcto"
      this.puntaje= this.puntaje+1
      console.log(this.puntaje);
      

    }
    else if(respuesta== "Neron"){
      this.color = "success"
      this.texto = "Correcto"
      this.puntaje= this.puntaje+1
      console.log(this.puntaje);
    
    }
    else if(respuesta== "12 años"){
      this.color = "success"
      this.texto = "Correcto"
      this.puntaje= this.puntaje+1
      console.log(this.puntaje);
    
    }
    else if(respuesta== "Nayib Bukele"){
      this.color = "success"
      this.texto = "Correcto"
      this.puntaje= this.puntaje+1
      console.log(this.puntaje);
    
    }
    else if(respuesta== "San Salvador"){
      this.color = "success"
      this.texto = "Correcto"
      this.puntaje= this.puntaje+1
      console.log(this.puntaje);
    
    }

    else if(respuesta== "14"){
      this.color = "success"
      this.texto = "Correcto"
      this.puntaje= this.puntaje+1
      console.log(this.puntaje);
    
    }
    
    
    /////para hacer otra contestar las otras preguntas hacer el else if fuera del que ya esta 
    

    else{
      this.color = "danger"
      this.texto = "Incorrecto"
      this.vida= this.vida-1
      console.log(this.vida);
      
    }

  }


  

}