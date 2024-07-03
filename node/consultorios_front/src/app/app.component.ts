import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import {ReactiveFormsModule} from '@angular/forms';
import {FormControl} from '@angular/forms';
declare const L:any


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'consultorios_front';
 
  consultorios:any=[]
  urlbackend:string = 'http://192.168.68.2:3000/api';

  localidades:any = []
  upl:any = []
  upz:any = []
  geojsonLayer:any
  map:any;

  identify = new FormControl('');
  code = new FormControl('');
  name = new FormControl('');
  tel = new FormControl('');
  address = new FormControl('');
  email = new FormControl('');
  inst_type = new FormControl('');
  lon = new FormControl('');
  lat = new FormControl('');

  ngOnInit(){
    console.log('works')

    this.fetchLocData()
    this.fetchUplData()
    this.fetchUpzData()
    this.createMap()
  }

  createMap(){
    this.map = L.map('map').setView([4.644, -74.116], 12);

    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    const div_admin_layers = L.tileLayer.wms('http://192.168.68.2:8080/geoserver/Realtix/wms?', {
        layers: 'Realtix:IPS_pediatria',
        format: 'image/svg',
        transparent: true,
        version: '1.1.0',
        attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // const con_pediatria = L.tileLayer.wms('http://192.168.68.2:8080/geoserver/Realtix/wms?', {
    //     layers: 'Realtix:Consultorios_pediatria',
    //     format: 'image/svg',
    //     transparent: true,
    //     version: '1.1.0',
    //     attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //     // CQL_FILTER: "clasep='Privada'"
    // }).addTo(this.map);

    const geoJsonUrl = 'http://192.168.68.2:8080/geoserver/Realtix/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=Realtix:Consultorios_pediatria&outputFormat=application/json';

    fetch(geoJsonUrl
    )
    .then(response => response.json())
    .then(data => {

    this.consultorios = data

    let geojsonMarkerOptions = {
      radius: 8,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
  };
  

    this.geojsonLayer = L.geoJSON(this.consultorios, {
            onEachFeature: function (feature:any, layer:any) {
                if (feature.properties && feature.properties.nombre) {
                    layer.bindPopup(feature.properties.nombre);
                }
            }
        }, 
        
      );
    this.geojsonLayer.addTo(this.map);

    })
  }

  async fetchLocData(){
    let res = await fetch(`${this.urlbackend}/localidades`)
    let data = await res.json()

    this.localidades = data.body;

    console.log(data)
  }

  onCLickLoc(e:any){
    console.log(e)

    this.fetchConsultorios(e, undefined, undefined, undefined)
  }

  async fetchUplData(){
    let res = await fetch(`${this.urlbackend}/UPL`)
    let data = await res.json()
  
    this.upl = data.body;
  
    console.log(data)
  }

  onCLickUPL(e:any){
    console.log(e)
    this.fetchConsultorios(undefined, e, undefined, undefined)

  }

  async fetchUpzData(){
    let res = await fetch(`${this.urlbackend}/UPZ`)
    let data = await res.json()
  
    this.upz = data.body;
  
    console.log(data)
  }

  onCLickUPZ(e:any){
    console.log(e)
    this.fetchConsultorios(undefined, undefined, e, undefined)
  }

  

  onCLickSector(e:any){
    console.log(e)
    this.fetchConsultorios(undefined, undefined, undefined, e)
  }


  async fetchConsultorios(loccodigo:string|undefined=undefined, codigo_upl:string|undefined=undefined, codigo_upz:string|undefined=undefined, clasep:string|undefined=undefined){
    //let query = `?loccodigo=${(loccodigo=undefined ? '' : loccodigo)}&codigo_upl=${(codigo_upl=undefined ? '' : codigo_upl)}&codigo_upz=${(codigo_upz=undefined ? '' : codigo_upz)}&clasep=${clasep}`
    
    let query = ''

    if(loccodigo){
      query += `${query.length === 0 ? '?' : '&'}loccodigo=${loccodigo}`
    }

    if(codigo_upl){
      query += `${query.length === 0 ? '?' : '&'}codigo_upl=${codigo_upl}`
    }
    if(codigo_upz){
      query += `${query.length === 0 ? '?' : '&'}codigo_upz=${codigo_upz}`
    }
    if(clasep){
      query += `${query.length === 0 ? '?' : '&'}clasep=${clasep}`
    }

    let res = await fetch(`${this.urlbackend}/GetPediatriaIPS${query}`)
    let data = await res.json()
  
    //this.upz = data.body;

    this.map.removeLayer(this.geojsonLayer)

    console.log(this.consultorios)



    let newDataFiltered = this.consultorios.features.filter((feat:any)=>{

      let find= data.body.find((ele:any)=> ele.identifica == feat.properties.identifica)

      if(find) return feat
    })
    

    
    this.geojsonLayer = L.geoJSON(newDataFiltered, {
            onEachFeature: function (feature:any, layer:any) {
                if (feature.properties && feature.properties.nombre) {
                    layer.bindPopup(feature.properties.nombre);
                }
            }
        });
   this.geojsonLayer.addTo(this.map);

  
    console.log(data.body)

    console.log(this.geojsonLayer)
  }

  async submitForm(){

    let form_data:any={}
    
    form_data.identify= this.identify.value
    form_data.code=this.code.value
    form_data.name=this.name.value
    form_data.tel=this.tel.value
    form_data.address=this.address.value
    form_data.email=this.email.value
    form_data.inst_type=this.inst_type.value
    form_data.lon=this.lon.value
    form_data.lat=this.lat.value

    let res = await fetch(`${this.urlbackend}/NewIPS`, {
      method: "post", body: JSON.stringify(form_data),
      headers: {
        'Content-type':'application/json'
      }
    })
    let data = await res.json()
    console.log(data)
  }
}
