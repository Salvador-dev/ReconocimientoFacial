import { Injectable } from '@angular/core';
import { FaceApiService } from './face-api.service';


@Injectable({
  providedIn: 'root'
})
export class VideoPlayerService {

  constructor(private faceApiService: FaceApiService) { 


  }

  getLandMark = async (videoElement: any) => {

    const {globalFace} = this.faceApiService;
    const {videoWidth, videoHeight} = videoElement.nativeElement;
    const displaySize = {width: videoWidth, height: videoHeight};

    const detectionFaces = await globalFace.detectAllFaces(videoElement.nativeElement).withFaceLandmarks().withFaceDescriptors();

    const landmark = detectionFaces[0].landmarks || null;
    const expressions = detectionFaces[0].expressions || null;


    const resizedDetections = globalFace.resizeResults(detectionFaces, displaySize);

    //canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        
    //     // Se guarda en un array los resultados de las coincidencias entre los rostros guardados y los que se estan registrando en camara
    //     const results = resizedDetections.map((d) => {
    //         return faceMatcher.findBestMatch(d.descriptor)
    //     });

    //     // Para cada rostro registrado en camara se dibuja el canvas junto con el nombre del rostro reconocido 
    //     results.forEach( (result, i) => {
    //         const box = resizedDetections[i].detection.box
    //         const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
    //         drawBox.draw(canvas)
    //     })
    // }, 500)

  }
}
