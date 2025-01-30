import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  galleryItems = [
    {
      image: '/images/gallery/gallery-01.jpg',
      title: 'Modern Operating Room',
      description: 'Equipped with state-of-the-art surgical tools to ensure precision and patient safety during operations.',
    },
    {
      image: '/images/gallery/gallery-02.jpg',
      title: 'Advanced Diagnostic Center',
      description: 'Our diagnostic center features MRI, CT scan, and X-ray facilities for accurate medical assessments.',
    },
    {
      image: '/images/gallery/gallery-03.jpg',
      title: 'Emergency Care Unit',
      description: '24/7 emergency response team with modern life-saving equipment to handle critical cases efficiently.',
    },
    {
      image: '/images/gallery/gallery-04.jpg',
      title: 'Pediatric Ward',
      description: 'A child-friendly environment with specialized pediatricians ensuring quality care for young patients.',
    },
    {
      image: '/images/gallery/gallery-05.jpg',
      title: 'Intensive Care Unit (ICU)',
      description: 'A high-tech ICU with advanced monitoring systems for critically ill patients needing constant care.',
    },
    {
      image: '/images/gallery/gallery-06.jpg',
      title: 'Pharmacy & Medication Center',
      description: 'Fully stocked with essential medicines and professional pharmacists to provide proper guidance.',
    },
  ];


  videoGallery = [
    {
      thumbnail: '/images/gallery/video-thumb-01.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=h-h5Mhlt6O0',
      title: 'Medical Innovations Conference 2024',
    },
    {
      thumbnail: '/images/gallery/video-thumb-02.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=h-h5Mhlt6O0',
      title: 'Surgical Advancements Summit 2023',
    },
    {
      thumbnail: '/images/gallery/video-thumb-03.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=h-h5Mhlt6O0',
      title: 'Emergency Medicine Symposium 2022',
    },
    {
      thumbnail: '/images/gallery/video-thumb-04.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=h-h5Mhlt6O0',
      title: 'Healthcare Technology Forum 2021',
    },
  ];

}
