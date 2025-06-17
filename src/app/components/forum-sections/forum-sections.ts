import { Component } from '@angular/core';
import { Section, SECTIONS } from '../../constants/ForumSections';


@Component({
  selector: 'app-forum-sections',
  templateUrl: './forum-sections.html',
  styleUrls: ['./forum-sections.css'],
  standalone: false, 
})
export class ForumSections {
  
  sections: Section[] = SECTIONS;

  expandedSection: string | null = null;

  toggleSection(sectionName: string): void {
    this.expandedSection = this.expandedSection === sectionName ? null : sectionName;
  }
}