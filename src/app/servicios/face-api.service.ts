 import { EventEmitter, Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

const MODEL_URL = 'assets/models';

@Injectable({
  providedIn: 'root'
})

export class FaceApiService {

  public globalFace: any;

  private modelsForLoad = [

    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    // faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)

  ];

  cbModels: EventEmitter<any> = new EventEmitter<any>();

  constructor() { 

    this.globalFace = faceapi;
    this.loadModels();

  }

  public loadModels = () => {

    Promise.all(this.modelsForLoad).then(() => {

      console.log("Models loaded");
      this.cbModels.emit(true);

    });

  }



}
