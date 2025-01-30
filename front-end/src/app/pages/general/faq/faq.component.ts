import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  faqList = [
    {
      question: 'Why Should I choose Medical Health?',
      answer: `Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                richardson ad squid.`
    },
    {
      question: 'What are the Centre’s visiting hours?',
      answer: `Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                richardson ad squid.`
    },
    {
      question: 'How many visitors are allowed?',
      answer: `Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                richardson ad squid.`
    }
  ];


}
