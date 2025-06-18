import { Component, OnInit } from '@angular/core';
import { Topic } from '../../models/topic';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from '../../service/AuthService';
import { SECTIONS } from '../../constants/ForumSections';

@Component({
  selector: 'app-topic-sections',
  templateUrl: './topic-sections.html',
  styleUrls: ['./topic-sections.css'],
  standalone: false
})
export class TopicSections implements OnInit {
  typeTopic: string = '';
  topicList: Topic[] = [];
  searchTerm: string = '';
  filteredTopics: Topic[] = [];

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    public bsModalRef: BsModalRef,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.typeTopic = params.get('type') || '';
      this.loadTopicsBySection(this.typeTopic);
    });
    this.typeTopic = this.route.snapshot.paramMap.get('type') || '';
    const subName = this.getSubsectionName(this.typeTopic);
    if (!subName) {
      this.toastr.error('Такої підсекції не існує!');
      this.router.navigate(['/']);
      return;
    }
  }

  loadTopicsBySection(section: string) {
    const decodedSection = decodeURIComponent(section);
    this.http.get<Topic[]>(`http://l2-absolute.com/api/forum/topic/by-section/${decodedSection}`).subscribe({
      next: topics => {
        this.topicList = topics;
        this.filteredTopics = topics;
      },
      error: (err) => {
        this.toastr.error(err.error,'Помилка!');
      }
    });
  }

  filterTopics() {
    this.filteredTopics = this.topicList.filter(topic =>
      topic.title?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openTopic(id: number,subSection:string) {
    this.router.navigate(['topic-type', subSection, 'topic', id]);
  }

  createTopic() {
    this.router.navigate(['topic-type', this.typeTopic, 'topic', 'create'], { 
      state: { subSection: this.typeTopic } 
    });
  }
  getSubsectionName(typeTopic: string): string | null {
    for (const section of SECTIONS) {
      const found = section.subsections.find(sub => sub.link === typeTopic);
      if (found) return found.name;
    }
    return null;
  }
}
