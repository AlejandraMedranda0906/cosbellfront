import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './footer.component';
import { WhatsAppFloatComponent } from './whatsapp-float.component';
import { NavbarComponent } from './navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    WhatsAppFloatComponent, // <-- agrega la coma aquí
    NavbarComponent,
    HttpClient
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }