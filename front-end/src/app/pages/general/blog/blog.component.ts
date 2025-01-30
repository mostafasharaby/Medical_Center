import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  blogPosts = [
    {
      image: '/images/blog/5.jpg',
      title: 'A LESSON IN SURGERY PREPAREDNESS - FROM HURRICANE SEASON',
      author: 'Donult Trum',
      date: '02 January 2018',
      description:
        'Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Sed porttitor lectus nibh...',
      link: 'single-blog.html',
    },
    {
      image: '/images/blog/6.jpg',
      title: 'PATIENT ENGAGEMENT AND THE IMPROVEMENT OF CARE AND RECOVERY',
      author: 'James Anderson',
      date: '08 January 2018',
      description:
        'Quisque velit nisi, pretium ut lacinia in, elementum id enim. Donec sollicitudin molestie malesuada...',
      link: 'single-blog.html',
    },
    {
      image: '/images/blog/7.jpg',
      title: 'HOW TO MAKE YOUR MEDICAL TRAINING EVENT OVER THE TOP',
      author: 'Garry Moe',
      date: '12 January 2018',
      description:
        'Sed porttitor lectus nibh. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi...',
      link: 'single-blog.html',
    },
    {
      image: '/images/blog/8.jpg',
      title: 'WHAT DOES THE FLEXDEX BRING TO LAPAROSCOPY?',
      author: 'Luis Morris',
      date: '25 January 2018',
      description:
        'Proin eget tortor risus. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus...',
      link: 'single-blog.html',
    },
  ];
}
