import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumSections } from './components/forum-sections/forum-sections';
import { TopicSections } from './components/topic-sections/topic-sections';
import { Cabinet } from './components/cabinet/cabinet';
import { ForumTopic } from './components/forum-topic/forum-topic';


const routes: Routes = [
  { path: '', component: ForumSections },
  { path: 'topic-type/:type', component: TopicSections },
  { path: 'cabinet', component: Cabinet },
  { path: 'topic-type/:type/topic/:id', component: ForumTopic },
  { path: 'topic-type/:type/topic/:id/edit', component: ForumTopic }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
