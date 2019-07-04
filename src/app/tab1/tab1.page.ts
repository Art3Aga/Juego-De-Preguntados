import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Storage } from "@ionic/storage";
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  usuarios:Observable<any[]>
  nombre:string = ""
  usuarioLogin:any
  username:string = ""
  password:string = ""
  btnSocials:any[] = []
  //edad:number = 18
  //lugar:string = ""
  habilitar:boolean = false

  constructor(public afDB: AngularFireDatabase, public toastController: ToastController,
    public navCtrl: NavController, public loadingController: LoadingController, 
    public alertController: AlertController, public storage:Storage, public router:Router) { }

  ngOnInit() {
    this.usuarios = this.afDB.list('registro').valueChanges()
    this.btnSocials = [
      {
        icon: 'logo-facebook',
        color: 'primary'
      },
      {
        icon: 'logo-googleplus',
        color: 'danger'
      },
      {
        icon: 'logo-twitter',
        color: 'secondary'
      }
    ]
    if(this.nombre.length == 0 || this.password.length == 0){
      this.habilitar = true
      console.log(this.habilitar)
      
    }
    else if(this.nombre.length > 0 || this.password.length > 0){
      this.habilitar = false
      console.log(this.habilitar)
      
    }
  }
  async presentAlert(header, subHeader, message) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async showMsm(message, duration, color) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position: 'top',
    });
    toast.present();
  }
  async iniciarSesion() {
    const alert = await this.alertController.create({
      header: 'Iniciar Sesion',
      cssClass: 'alertLogin',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre'
        },
        {
          name: 'clave',
          type: 'password',
          placeholder: 'Contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
          }
        }, {
          text: 'Aceptar',
          handler: (text) => { 
            if(text['nombre'] == "" && text['clave'] == ""){
              this.presentAlert('Error', '', 'Falta Nombre o Contraseña')
              //console.log(text);
            }
            else{
              //console.log(text);
              this.verificarLogin(text.nombre, text.clave)
            }
          }
        }
      ]
    });

    await alert.present();
  }
  async presentLoading(message:string, duration:number) {
    const loading = await this.loadingController.create({
      message,
      duration,
      spinner: 'lines-small'
    });
    await loading.present();
  }
  verificarUser(name:string, clave:string){
    clave = clave.toLocaleLowerCase();
    return new Promise((resolve, reject)=>{
      this.afDB.object(`registro/${name}-${clave}`).valueChanges().subscribe(
        (usuario)=>{
          //this.presentLoading('Verificando...', 600)
          if(usuario){
            clave = usuario['clave']
            name = usuario['usuario']
            console.log(usuario);
            this.guardarStorage('usuario', `${usuario['usuario']}-${usuario['clave']}`)
            let user = `${usuario['usuario']}-${usuario['clave']}`
            //this.router.navigate(['/tabs/tab2', user])
            let navigationExtras:NavigationExtras ={
              state:{ user }
            }
            this.router.navigate(['tabs/tab2'], navigationExtras)
            //localStorage.setItem('usuario', `${usuario['nombre']}-${usuario['password']}`)
            resolve(true);
          }
          else{
            resolve(false);
          }
        });
    });
  }
  getUsuario(usuario:any):string{
    let user:any
    this.afDB.object(`registro/${usuario}`).valueChanges().subscribe(usuario=>{
      if(usuario){
        user = usuario
      }
      else{
        return null
      }
    })
    return user
  }
  verificarLogin(name:string, clave:string){
    this.loadingController.create({
      message: 'Verificando...'
    }).then(loading =>{loading.present()})
    this.verificarUser(name, clave).then((existe)=>{
      this.loadingController.dismiss()
      if(existe){
        this.showMsm(`Bienvenido ${name}`, 2500, 'success')
      }
      else{
        this.presentAlert('Error', '', 'Usuario/Clave Incorrecto')
      }
    })

  }
  async guardarStorage(key:string ,valor:any){
    await this.storage.set(key, valor)
  }

  saveUser(){
    let user:any = {
      usuario: this.nombre,
      clave: this.password,
    }
    try {
      //this.afDB.object(`/registro/${this.nombre}/DatosPersonales`).update(user)
      if(this.afDB.object(`/registro/${this.nombre}-${this.password}`).update(user)){
        //this.showMsm('¡Bienvenido! \n' + this.nombre , 3000, 'success')
        this.verificarLogin(this.nombre, this.password)
        this.nombre = ""
        this.password = ""
        this.navCtrl.navigateBack('/')
      }
    } catch (error) {
      console.log(error)
      
    }

  }

}
