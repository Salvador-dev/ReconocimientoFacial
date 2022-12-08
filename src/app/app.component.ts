import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public currentStream: any;
  public dimensionsVideo: any;

  title = 'reconocimientoFacial';

  ngOnInit() {

    this.checkMediaSource();
    this.getSize();

  }

  checkMediaSource = () => {
    
    if(navigator && navigator.mediaDevices) {

      navigator.mediaDevices.getUserMedia({

        audio: false,
        video: true

      }).then(stream => {

        this.currentStream = stream;

      }).catch(() => {

        console.log("ERROR, NO PERMISSION");

      });

    } else {

      console.log("ERROR, NO MEDIA FOUND!");

    }

  }

  getSize() {

    const elementCam: HTMLElement = document.getElementById("cam")!;

    const {width, height} = elementCam.getBoundingClientRect();

    console.log(width, height);
    this.dimensionsVideo = {width, height};

  }


}
