import { Component } from '@angular/core';
import { WelcomeContentComponent } from '../welcome-content/welcome-content.component';
import { LoginFormComponent } from '../login-form/login-form.component';
import { AxiosService } from '../axios.service';
import { AuthContentComponent } from '../auth-content/auth-content.component';
import { CommonModule } from '@angular/common';
import { ButtonsComponent } from '../buttons/buttons.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [WelcomeContentComponent, LoginFormComponent, AuthContentComponent, ButtonsComponent, CommonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {
  componentToShow: string = "welcome";

  constructor(private axiosService: AxiosService) { }

  showComponent(componentToShow: string): void {
    this.componentToShow = componentToShow;
  }

  onLogin(input: any): void {
    this.axiosService.request(
      "POST",
      "/login",
      {
        login: input.login,
        password: input.password
      }).then(
        response => {
          this.axiosService.setAuthToken(response.data.token);
          this.componentToShow = "messages";
        }).catch(
          error => {
            this.axiosService.setAuthToken(null);
            this.componentToShow = "welcome";
          }
        );

  }

  onRegister(input: any): void {
    this.axiosService.request(
      "POST",
      "/register",
      {
        firstName: input.firstName,
        lastName: input.lastName,
        login: input.login,
        password: input.password
      }).then(
        response => {
          this.axiosService.setAuthToken(response.data.token);
          this.componentToShow = "messages";
        }).catch(
          error => {
            this.axiosService.setAuthToken(null);
            this.componentToShow = "welcome";
          }
        );
  }

}
