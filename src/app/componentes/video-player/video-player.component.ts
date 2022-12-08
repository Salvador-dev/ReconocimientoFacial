import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FaceApiService } from 'src/app/servicios/face-api.service';
import { VideoPlayerService } from 'src/app/servicios/video-player.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit, OnDestroy{

  @ViewChild('videoElement') videoElement: ElementRef | undefined;
  @Input() stream: any;
  @Input() width: number | undefined;
  @Input() height: number | undefined;
  modelsReady: boolean = false;

  listEvents: Array<any> = [];


  constructor(private renderer: Renderer2, private elementRef: ElementRef, private faceApiService: FaceApiService, private videoPlayerService: VideoPlayerService) { }

  ngOnInit(): void {

    this.listenerEvents();

  }

  ngOnDestroy(): void {
    
    this.listEvents.forEach((event: any) => event.unsubscribe);

  }

  listenerEvents = () => {

    const observer1 = this.faceApiService.cbModels.subscribe(res => {

      this.modelsReady = true;
      this.checkFace();

    })

    this.listEvents = [observer1]

  };

  checkFace =  () => {

    setInterval(async () => {

      await this.videoPlayerService.getLandMark(this.videoElement)

    }, 500);


  }

  loadedMetaData() {

    this.videoElement?.nativeElement.play();

  }

  listenerPlay() {
    
  }

}
