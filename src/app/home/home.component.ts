import {Component, OnInit, AfterViewInit} from '@angular/core';
import {CompactType, GridsterConfig, GridType} from 'angular-gridster2';

import * as WatchStyleKit from 'assets/js/WatchStyleKit.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../../../node_modules/nvd3/build/nv.d3.css']
})
export class HomeComponent implements OnInit, AfterViewInit {


  options: GridsterConfig;
  personalData;
  contactInfo;
  tumInfo;
  epnInfo;
  langs;
  jobs;

  constructor() {
    this.setPersonalData();
    this.setContactInfo();
    this.setTUMInfo();
    this.setEPNInfo();
    this.setLanguages();
    this.setJobs();
  }

  ngOnInit() {
    this.setGridsterOptions();
  }

  ngAfterViewInit() {

    WatchStyleKit.drawBasicRGBCanvas('mainCanvas', 0, 0, 0, '', 'aspectfit');

    setInterval(function () {
      let date = new Date;
      let seconds = -6 * date.getSeconds();
      let minutes = -6 * date.getMinutes();
      let hour = -30 * date.getHours();

      WatchStyleKit.clearCanvas('mainCanvas')
      WatchStyleKit.drawBasicRGBCanvas('mainCanvas', seconds, minutes, hour);
    }, 1000);

  }

  private setPersonalData() {
    this.personalData = {
      fullname: 'Paul Gualotuna',
      birthdate: new Date(1987, 3, 20),
      nationality: 'Ecuadorian',
      placeOfBirth: 'Quito, Ecuador',
      placeOfResidence: 'Munich, Germany',
      maritalStatus: 'Single',
      gender: 'Masculine'
    };
  }

  private setContactInfo() {
    this.contactInfo = {
      emailString: 'paul.gualotuna.dev(at)gmail.com',
      email: 'paul.gualotuna.dev@gmail.com',
      mobilePhone: '+49 (172) 4529 452',
      phone: '01724529452',
      facebook: 'https://www.facebook.com/paul.gualotuna',
      linkedin: 'https://www.linkedin.com/in/paul-gualotuna/?locale=en_US',
      github: 'https://github.com/poulzinho'
    };
  }

  private setTUMInfo() {
    this.tumInfo = {
      university: 'Technical University of Munich',
      faculty: 'Informatics',
      place: 'Munich, Germany',
      major: 'Software Engineering',
      minor: 'Graphics & Vision'
    };
  }

  private setEPNInfo() {
    this.epnInfo = {
      university: 'National Polytechnic School of Ecuador',
      faculty: 'Systems Engineering',
      place: 'Quito, Ecuador',
      major: 'Software Engineering',
      minor: 'Computer Science'
    };
  }

  private setLanguages() {
    this.langs = {
      spanish: 'Native',
      english: 'Professional competence',
      german: 'Beginner'
    };
  }

  private setJobs() {
    this.jobs = {
      netlight: {
        dates: '2018',
        company: 'Netlight',
        place: 'Munich, Germany',
        position: 'Working Student',
        description: 'Graphics, illustration, UX Design',
        tech: ['Illustrator', 'Photoshop', 'JavaScript', 'HTML', 'CSS']
      },
      TUM: {
        dates: '2016 - 2017',
        company: 'Technical University of Munich',
        place: 'Munich, Germany',
        position: 'Research assistant (Hiwi)',
        description: 'Software and web development',
        tech: ['Javascript', 'Angular2', 'Material Design', 'Sockets']
      },
      EPN: {
        dates: '2014 - 2015',
        company: 'National Polytechnic School of Ecuador',
        place: 'Quito, Ecuador',
        position: 'IT Specialist',
        description: 'Software and web development',
        tech: ['Java', 'Javascript', 'AngularJS', 'JEE6']
      },
      WFT: {
        dates: '2012 - 2013',
        company: 'Weatherford',
        place: 'Quito, Ecuador',
        position: 'Application Developer',
        description: 'Software and web development',
        tech: ['C#', '.NET4', 'ASP']
      },
      insumedical: {
        dates: '2010 - 2012',
        company: 'Insumedical',
        place: 'Quito, Ecuador',
        position: 'Junior Application Developer',
        description: 'Software and web development',
        tech: ['Java', 'JEE6', 'HTML', 'CSS', 'JavaScript']
      }
    };
  }

  private setGridsterOptions() {
    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.None,
      pushItems: true,
      draggable: {enabled: true},
      resizable: {enabled: true},
      disableWindowResize: false,
      mobileBreakpoint: 960,
      minCols: 25,
      maxCols: 25,
      minRows: 10,
      maxRows: 10,
      minItemCols: 5,
      minItemRows: 8,
      displayGrid: 'none'
    };
  }

}

