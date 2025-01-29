import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { HeaderComponent } from './layout/header/header.component';
import { RouterModule } from '@angular/router';
import { GeneralModule } from './pages/general/general.module';
import { AuthModule } from './pages/auth/auth.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AdminModule } from './admin/admin/admin.module';
import { DoctorModule } from './doctor/doctor.module';
import { provideToastr, ToastrModule } from 'ngx-toastr'; 

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule ,
    AuthModule,
    GeneralModule,  
    AdminModule,
    DoctorModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,      
    ToastrModule.forRoot(),
  ],
  providers: [
    provideClientHydration(),  
    provideAnimationsAsync(), 
    provideToastr(),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


