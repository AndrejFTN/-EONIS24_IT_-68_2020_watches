import {Component, Input, OnInit} from '@angular/core';
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'content-wrapper',
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.css']
})
export class ContentWrapperComponent implements OnInit {

  @Input() offset?: string;
  @Input() size?: string;
  @Input() columns?: string;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

}
