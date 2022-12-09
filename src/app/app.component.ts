import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { FaceApiService } from './servicios/face-api.service';
import { VideoPlayerService } from './servicios/video-player.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent implements OnInit, OnDestroy {

 

  public currentStream: any;
  public dimensionsVideo: any;
  listEvents: Array<any> = [];
  overCanvas: any;
  listaExpresiones: any = [];

  constructor(private videoPlayerService: VideoPlayerService, private faceApiService: FaceApiService, private renderer: Renderer2, private elementRef: ElementRef) { }


  ngOnInit() {

    this.listenerEvents();
    this.checkMediaSource();
    this.getSize();

  }

  ngOnDestroy(): void {

    this.listEvents.forEach((event: any) => event.unsubscribe);

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

  listenerEvents = () => {

    const observer2$ = this.videoPlayerService.cbAi.subscribe(({ resizedDetections, displaySize, expressions, videoElement
    }) => {

      resizedDetections = resizedDetections[0] || null;

      if(resizedDetections){

        this.listaExpresiones = _.map(expressions, (value, name) => {

          return { name, value};

        });

        this.createCanvasPreview(videoElement);
        this.drawFace(resizedDetections, displaySize);

      }

    });

    this.listEvents = [observer2$];

  };

  drawFace = (resizedDetections: any, displaySize: any) => {

    if(this.overCanvas) {

      const {globalFace} = this.faceApiService;

      this.overCanvas.getContext("2d").clearRect(0, 0, displaySize.width, displaySize.height);

      globalFace.draw.drawFaceLandmarks(this.overCanvas, resizedDetections);

    }


  }


  getSize() {

    const elementCam: HTMLElement = document.getElementById("cam")!;

    const {width, height} = elementCam.getBoundingClientRect();

    console.log(width, height);
    this.dimensionsVideo = {width, height};

  };

  createCanvasPreview = (videoElement: any) => {

    if(!this.overCanvas) {

      const {globalFace} = this.faceApiService;
      this.overCanvas = globalFace.createCanvasFromMedia(videoElement.nativeElement);
      this.renderer.setProperty(this.overCanvas, 'id', ' new-canvas-preview');
      const elementPreview = document.querySelector(".canvas-preview");
      this.renderer.appendChild(elementPreview, this.overCanvas);


    }



  }

 

  

}
