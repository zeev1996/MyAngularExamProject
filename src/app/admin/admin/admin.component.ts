import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TopicService } from 'src/app/Repository/topicService';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isLoading=false;
  constructor(private topicService:TopicService) { }

  ngOnInit(): void {

  }
  onAdd(form: NgForm)
  {
    if (form.invalid) {
      return;
    }
    console.log(form.value.topic)
    this.isLoading = true;
    this.topicService.addTopic(form.value.topic).subscribe({
      next:()=>this.isLoading = false,

    }



    );
  }
}
