import {Component, ErrorHandler, OnInit} from '@angular/core';
import {AuthService} from "../../seguranca/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  exibindoMenu: boolean;

  constructor(private auth: AuthService,
              private errorHandler: ErrorHandler,
              private router: Router) { }

  ngOnInit() {
  }

  criarNovoAccessToken() {
    this.auth.obterNovoAcessToken();
  }

  logout() {
    this.auth.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(erro => {
        this.errorHandler.handleError(erro);
      });
  }

}
