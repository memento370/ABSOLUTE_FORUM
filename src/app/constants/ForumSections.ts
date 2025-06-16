
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
    name: 'Тех.поддержка',
    subsections: [
      { name: 'Новости разработки', link: 'dev-news' },
      { name: 'Описание сервера', link: 'server-info' },
      { name: 'Баги и фиксы', link: 'bugs-fixes' },
      { name: 'Пожелания и предложения', link: 'suggestions' },
    ]
  },
  {
    name: 'Общее',
    subsections: [
      { name: 'Новости', link: 'news' },
      { name: 'Рекрутинг', link: 'discussions' },
      { name: 'Общение', link: 'speaking' }
    ]
  }
];
