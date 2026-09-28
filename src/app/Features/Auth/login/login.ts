import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { AuthService } from '../../../Core/Services/auth.service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  loading = false;
  errorMessage = '';

  loginForm = this.fb.group({

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required
      ]
    ]

  });


  login(): void {

    if (this.loading) {
      return;
    }

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const request = {

      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!

    };


    this.authService.login(request)
      .subscribe({

        next: (response) => {

          console.log(
            'LOGIN RESPONSE:',
            response
          );

          this.loading = false;


          if (response.statusCode === 200) {

            console.log(
              'LOGIN SUCCESS'
            );


            this.authService.saveLogin(
              response.data
            );


            console.log(
              'TOKEN:',
              this.authService.getToken()
            );

            console.log(
              'IS LOGGED IN:',
              this.authService.isLoggedIn()
            );

            console.log(
              'USER TYPE:',
              response.data.userTypeId
            );


            const returnUrl =
              this.route.snapshot
                .queryParamMap
                .get('returnUrl');


            console.log(
              'RETURN URL:',
              returnUrl
            );


            if (returnUrl) {

              console.log(
                'NAVIGATING TO:',
                returnUrl
              );

              this.router
                .navigateByUrl(returnUrl)
                .then(success => {

                  console.log(
                    'NAVIGATION RESULT:',
                    success
                  );

                })
                .catch(error => {

                  console.error(
                    'NAVIGATION ERROR:',
                    error
                  );

                });

            }
            else {

              this.redirectUser(
                response.data.userTypeId
              );

            }

          }
          else {

            this.errorMessage =
              response.message ||
              'Login failed.';

          }

        },


        error: (error) => {

          console.error(
            'LOGIN API ERROR:',
            error
          );

          this.loading = false;

          this.errorMessage =
            error?.error?.message ||
            'Invalid email or password.';

        }

      });
  }


  private redirectUser(
    userTypeId: number
  ): void {

    console.log(
      'REDIRECT USER TYPE:',
      userTypeId
    );


    switch (Number(userTypeId)) {

      case 1:

        this.router.navigateByUrl(
          '/SuperAdminDashboard'
        );

        break;


      case 2:

        this.router.navigateByUrl(
          '/AdminDashboard'
        );

        break;


       case 3:
      this.router.navigateByUrl('/SharedTickets');
      break;

    default:
      this.errorMessage = 'Invalid user type.';
      this.authService.logout();
      this.router.navigateByUrl('/login');
      break;
  }

  }

}