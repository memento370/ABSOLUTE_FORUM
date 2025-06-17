import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { SECTIONS } from '../../constants/ForumSections';

@Component({
  selector: 'app-forum-breadcrumb',
  templateUrl: './forum-breadcrumb.component.html',
  styleUrls: ['./forum-breadcrumb.component.css'],
  standalone: false
})
export class ForumBreadcrumbComponent implements OnInit, OnDestroy {
  @Input() topicTitle?: string;
  crumbs: { label: string, link?: string }[] = [];
  private routerSub!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildBreadcrumbs();
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.buildBreadcrumbs());
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  buildBreadcrumbs(): void {
  this.crumbs = [];
  const urlTree = this.router.parseUrl(this.router.url);
  const segments = urlTree.root.children['primary']?.segments || [];

  this.crumbs.push({ label: 'Головна', link: '/' });
  if (segments.length > 1 && segments[0].path === 'topic-type') {
    const type = segments[1].path;
    const sectionObj = SECTIONS.find(section =>
      section.subsections.some(sub => sub.link === type)
    );
    const subSectionObj = sectionObj?.subsections.find(sub => sub.link === type);
    if (sectionObj && subSectionObj) {
      this.crumbs.push({
        label: `${sectionObj.name} > ${subSectionObj.name}`,
        link: `/topic-type/${type}`
      });
    }
  }

  const topicIdx = segments.findIndex(seg => seg.path === 'topic');
  if (topicIdx !== -1 && segments.length > topicIdx + 1) {
    const idOrCreate = segments[topicIdx + 1].path;
    if (idOrCreate === 'create') {
      this.crumbs.push({ label: 'Створення теми' });
    } else {
      this.crumbs.push({
        label: this.topicTitle ?? 'Тема',
      });
      if (segments.length > topicIdx + 2 && segments[topicIdx + 2].path === 'edit') {
        this.crumbs.push({ label: 'Редагування' });
      } else {
        this.crumbs.push({ label: 'Перегляд' });
      }
    }
  }
}

}
