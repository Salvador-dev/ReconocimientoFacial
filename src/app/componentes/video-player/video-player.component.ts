import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { values } from 'lodash';
import { FaceApiService } from 'src/app/servicios/face-api.service';
import { VideoPlayerService } from 'src/app/servicios/video-player.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']

})
export class VideoPlayerComponent implements OnInit, OnDestroy{

  @ViewChild('videoElement')
  videoElement!: ElementRef;
  @Input() stream: any;
  @Input()
  width!: number;
  @Input()
  height!: number;
  modelsReady: boolean = false;
  listEvents: Array<any> = [];
  overCanvas: any;


  constructor(private renderer: Renderer2, private elementRef: ElementRef, private faceApiService: FaceApiService, private videoPlayerService: VideoPlayerService) { }

  ngOnInit(): void {

    this.listenerEvents();

  }

  ngOnDestroy(): void {
    
    this.listEvents.forEach((event: any) => event.unsubscribe);

  }

  listenerEvents = () => {

    const observer1$ = this.faceApiService.cbModels.subscribe(res => {

      this.modelsReady = true;
      // this.checkFace();

    });

    const observer2$ = this.videoPlayerService.cbAi.subscribe(({ resizedDetections, displaySize, expressions, eyes
    }) => {

      resizedDetections = resizedDetections[0] || null;

      if(resizedDetections){

        this.drawFace(resizedDetections, displaySize, eyes);

      }

    });

    this.listEvents = [observer1$, observer2$];

  };

  readDatos = async () => {

    await this.videoPlayerService.getLandMark(this.videoElement);

  }

  drawFace = (resizedDetections: any , displaySize: any, eyes: any) => {

    const {globalFace} = this.faceApiService;
    globalFace.matchDimensions(this.overCanvas, displaySize);
    this.overCanvas.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height);
    globalFace.draw.drawDetections(this.overCanvas, resizedDetections);
    globalFace.draw.drawFaceLandmarks(this.overCanvas, resizedDetections);




  }

  checkFace =  () => {

    setInterval(async () => {

      await this.videoPlayerService.getLandMark(this.videoElement)

    }, 250);


  }

  loadedMetaData() {

    this.videoElement?.nativeElement.play();
    this.listenerPlay();


  }

  listenerPlay(): void{

    const {globalFace} = this.faceApiService;
    this.overCanvas = globalFace.createCanvasFromMedia(this.videoElement.nativeElement);
    this.renderer.setProperty(this.overCanvas, 'id', 'new-canvas-over');
    this.renderer.setStyle(this.overCanvas, 'width', `${this.width}px`);
    this.renderer.setStyle(this.overCanvas, 'height', `${this.height}px`);
    


    this.renderer.appendChild(this.elementRef.nativeElement, this.overCanvas);


  
    
  }

}


