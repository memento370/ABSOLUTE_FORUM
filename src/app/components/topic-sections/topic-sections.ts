import { Component, Input } from '@angular/core';
import { Topic } from '../../models/topic';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topic-sections',
  templateUrl: './topic-sections.html',
  styleUrls: ['./topic-sections.css'],
  standalone:false
})
export class TopicSections {
  typeTopic: string = '';
  
  topicList : Topic[] = [];

  topics = [
    { id: 1, name: 'Перша тема' },
    { id: 2, name: 'Друга тема' },
    { id: 3, name: 'Третя тема' }
  ];

  searchTerm: string = '';
  filteredTopics = [...this.topics];

  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.typeTopic = this.route.snapshot.paramMap.get('type') || '';
    // Можеш тепер підвантажити теми відповідно до типу
  }

  createTopic() {
    console.log('Натиснуто "Створити тему"');
  }

  filterTopics() {
    this.filteredTopics = this.topics.filter(topic =>
      topic.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
