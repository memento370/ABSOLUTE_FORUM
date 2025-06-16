import { NgModule, isDevMode } from '@angular/core';
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
import { Cabinet } from './components/cabinet/cabinet';
import { ModalModule } from 'ngx-bootstrap/modal';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { ForumTopic } from './components/forum-topic/forum-topic';
import { ForumTopicComments } from './components/forum-topic/forum-topic-comments/forum-topic-comments';
import { ForumBreadcrumbComponent } from './components/ForumBreadcrumbComponent/forum-breadcrumb.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    ForumSections,
    Login,
    TopicSections,
    Cabinet,
    ForumTopic,
    ForumTopicComments,
    ForumBreadcrumbComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgbModule,
    ModalModule.forRoot(),
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    StoreRouterConnectingModule.forRoot(), 

    
    

  ],
  providers: [], 
  bootstrap: [AppComponent] 
})
export class AppModule { }
