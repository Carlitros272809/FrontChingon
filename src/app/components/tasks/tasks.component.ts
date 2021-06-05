import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  localToken = localStorage.getItem('token')
  idUser = localStorage.getItem('idUser')
  urlSprints =  environment.API_URL 
  idProject: any;
  sprints: any;
  infoProject: any;
  selectedItem: any;
  daily: any;
  beginDate: any;
  endDate: any;
  buttonShown: any;
  buttonBacklog: any;

  public newSprint = {
    name: '',
    daily: '',
    fechaInicio: '',
    fechaFin: ''
  }

  public newTask = {
    name: '',
    description: '',
    status: '',
    priority: ''
  }

  constructor(
    private httpClient : HttpClient,
    private router : Router,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buttonShown = false
    this.buttonBacklog = false
    this.route.params.subscribe(params => {
      this.idProject = params['id'];
    });

    this.getProject(this.idProject);
    this.getSprints(this.idProject);
  }

  private getSprints(id: number) {
    let headers = new HttpHeaders().set('auth', `${this.localToken}`)
    let promiseSprints = this.httpClient.get(this.urlSprints + 'sprints/sprintsProject/?projectId=' + id + '&userId=' + this.idUser, { headers }).toPromise();
    promiseSprints.then((data) => {
      this.sprints = data;
    }).catch((error) => {
      console.log(error);
    })
  }

  private getProject(id:number) {
    let headers = new HttpHeaders().set('auth', `${this.localToken}`)
    let promiseInfoProject = this.httpClient.get(this.urlSprints + 'projects/?userId=' + this.idUser + '&projectId=' + id, { headers }).toPromise();
    promiseInfoProject.then((data) => {
      this.infoProject = data;
    }).catch((error) => {
      console.log(error);
    })
  }

  printSprint(that: any){
    this.buttonBacklog = true
    this.router.navigate(['Backlog/Proyecto/' + this.idProject]);
    this.daily = that.daily;
    this.beginDate = that.fechaInicio;
    this.endDate = that.fechaFin;
    this.selectedItem = that.id;
  }

  seeSprint(that: any) {
    this.router.navigate(['Sprint',that], { relativeTo: this.route });
    this.buttonShown = true
  }

  addNewSprint() {
    let headers = new HttpHeaders().set('auth', `${this.localToken}`);
    this.httpClient.post<any>(this.urlSprints + 'sprints/newSprint/?projectId=' + this.idProject + '&userId=' + this.idUser, this.newSprint, {headers}).subscribe(response => {
      if(response.msg == 'OK') {
        this.getSprints(this.idProject);
        this.newSprint.name = '';
        this.newSprint.daily = '';
        this.newSprint.fechaInicio = '';
        this.newSprint.fechaFin = '';
      } else {
        //handdle errors
      }
    })
  }

  async addNewTask(){
    let headers = new HttpHeaders().set('auth', `${this.localToken}`);
    this.httpClient.post<any>(this.urlSprints + 'tareas/nuevaTarea/?sprintId=' + this.selectedItem + '&projectId=' + this.idProject + '&userId=' + this.idUser, this.newTask , {headers}).subscribe(response => {
      if(response.msg == 'OK') {
        this.router.navigateByUrl('Backlog/Proyecto/' + this.idProject);
      } else {
        //handdle errors
      }
    })
  }

  onChat():void{
    this.router.navigate(['chat'], {queryParams:{
      projectId: this.idProject
    }})
  }
}
