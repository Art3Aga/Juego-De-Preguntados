
import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {
  usuario:any
  puntaje:number
  constructor(public navParams: NavParams, public modalController:ModalController,
    public navController:NavController) { }

  ngOnInit() {
    this.usuario = this.navParams.get('user')
    this.puntaje = this.navParams.get('puntaje')
    
  }
  play_denuevo(){
    this.modalController.dismiss()
    //this.tab2.presente = 1
  }
  verPerfil(){
    this.modalController.dismiss()
    this.navController.navigateBack('/tabs/tab3', {animated: true, animationDirection: 'back'})
  }

}
