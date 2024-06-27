import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-enable',
  templateUrl: './enable.component.html',
  styleUrl: './enable.component.scss'
})
export class EnableComponent {

  constructor(
    private route: ActivatedRoute,
    private authSvc:AuthService,
    private router:Router
  ){
  }


  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      const token = params.k
        console.log(token);

      this.authSvc.enable(token).subscribe(response => {
        this.router.navigate(['/auth/login'])
      })
    })

    }

}
