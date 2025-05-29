export const MENU = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: 'fas fa-tachometer-alt'
    },
    {
      title: 'Appointment',
      path: '/admin/appointments',
      icon: 'fas fa-calendar-check',
      badge: '0'
    },
    {
      title: 'Doctors',
      path: '/admin/doctors',
      icon: 'fas fa-user-md'
    },
    {
      title: 'Patients',
      path: '/admin/patients',
      icon: 'fas fa-user-injured'
    },
    {
      title: 'Sign Out',
      path: '#',
      toggle:'modal',
      target:'#logoutModal',
      icon: 'fas fa-sign-out-alt'
    }
  ];


  export const DoctorMENU = [
    {
      title: 'Appointment',
      path: '/doctor/doctor-appointments',
      icon: 'fas fa-tachometer-alt'
    },
    {
      title: 'Patients Review',
      path: '/doctor/patient-reviews',
      icon: 'fa fa-comments'
    },
    {
      title: 'Profile',
      path: '/doctor/doctor-profile',
      icon: 'fa fa-user'
    },
    {
      title: 'Sign Out',
      path: '#',
      toggle:'modal',
      target:'#logoutModal',
      icon: 'fas fa-sign-out-alt'
    }
  ];
