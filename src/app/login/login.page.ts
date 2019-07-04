import { UserService } from './../services/usuario/user.service';
import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
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
    public alertController: AlertController, public router:Router, public _userService:UserService) { }

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
              //let usuario:any = `${text.nombre}-${text.clave}`
              //console.log(usuario);
              
              //console.log(this.getUsuario(usuario));
              
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
            //this.guardarStorage('usuario', `${usuario['usuario']}-${usuario['clave']}`)
            //let user = `${usuario['usuario']}-${usuario['clave']}`
            //this.router.navigate(['/tabs/tab2', user])
            let navigationExtras:NavigationExtras = {
             state: { usuario }
            }
            this._userService.usuario = usuario
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
  verificarLogin(name:string, clave:string){
    /*this.loadingController.create({
      message: 'Verificando...'
    }).then(loading =>{loading.present()})*/
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

  getUsuario(usuario:any):any{
    let user:any
    this.afDB.object(`registro/${usuario}`).valueChanges().subscribe(usuario=>{
      if(usuario){
        user = usuario
        //console.log(user);
        return user
        
      }
      else{
        user = {}
      }
    })
    return user
  }

  saveUser(){
   //name:string, clave:string
    /*let user:any = {
      usuario: this.nombre,
      clave: this.password,
    }*/
    try {
      //this.afDB.object(`/registro/${this.nombre}/DatosPersonales`).update(user)
      if(this.afDB.object(`/registro/${this.nombre}-${this.password}`).update({
        usuario: this.nombre,
        clave: this.password
      })
      ){
        //this.verificarUser(this.nombre, this.password).then(existe=>{})
        this.verificarLogin(this.nombre, this.password)
        /*this.showMsm('¡Bienvenido! \n' + this.nombre , 3000, 'success')
        this.verificarUser(this.nombre, this.password)
        .then((existe)=>{})
        this.nombre = ""
        this.password = ""
        this.navCtrl.navigateBack('/')*/
      }
    } catch (error) {
      console.log(error)
      
    }

  }

}
