// forum-sections.component.ts
import { Component } from '@angular/core';

interface Subsection {
  name: string;
  link?: string; // Можна додати посилання для навігації
}

interface Section {
  name: string;
  subsections: Subsection[];
}

@Component({
  selector: 'app-forum-sections',
  templateUrl: './forum-sections.html',
  styleUrls: ['./forum-sections.css'],
  standalone: false, 
})
export class ForumSections {
  sections: Section[] = [
    {
      name: 'Тех.поддержка',
      subsections: [
        { name: 'Новости разработки', link: '/dev-news' },
        { name: 'Описание сервера', link: '/server-info' },
        { name: 'Баги и фиксы', link: '/bugs-fixes' },
        { name: 'Пожелания и предложения', link: '/suggestions' },

      ]
    },
    // Тут можна додати інші розділи, наприклад:
    {
      name: 'Общее',
      subsections: [
        { name: 'Новости', link: '/news' },
        { name: 'Рекрутинг', link: '/discussions' },
        { name: 'Общение', link: '/speaking' }
      ]
    }
  ];

  // Логіка для розгортання/згортання розділів (опціонально)
  expandedSection: string | null = null;

  toggleSection(sectionName: string): void {
    this.expandedSection = this.expandedSection === sectionName ? null : sectionName;
  }
}