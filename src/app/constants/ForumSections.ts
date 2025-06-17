
export interface Subsection {
  name: string;
  link?: string;
}

export interface Section {
  name: string;
  subsections: Subsection[];
}

export const SECTIONS: Section[] = [
  {
    name: 'Тех.підтримка',
    subsections: [
      { name: 'Новини розробки', link: 'dev-news' },
      { name: 'Опис серверу', link: 'server-info' },
      { name: 'Баги та фікси', link: 'bugs-fixes' },
      { name: 'Побажання та пропозиції', link: 'suggestions' },
    ]
  },
  {
    name: 'Общее',
    subsections: [
      { name: 'Новини', link: 'news' },
      { name: 'Рекрутинг', link: 'discussions' },
      { name: 'Спілкування', link: 'speaking' }
    ]
  }
];
