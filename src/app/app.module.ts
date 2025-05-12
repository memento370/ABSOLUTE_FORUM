import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForumSections } from './components/forum-sections/forum-sections';
import { Login } from './components/login/login';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TopicSections } from './components/topic-sections/topic-sections';

@NgModule({
  declarations: [
    AppComponent,
    ForumSections,
    Login,
    TopicSections
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgbModule
    

  ],
  providers: [], 
  bootstrap: [AppComponent] 
})
export class AppModule { }
