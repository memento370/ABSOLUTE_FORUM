import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumSections } from './components/forum-sections/forum-sections';
import { TopicSections } from './components/topic-sections/topic-sections';


const routes: Routes = [
  { path: '', component: ForumSections },
  { path: 'topic-type/:type', component: TopicSections },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
