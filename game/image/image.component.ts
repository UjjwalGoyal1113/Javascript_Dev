import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})

export class ImageComponent {
  @Input() imagePath: string = '';
  @Input() isMatched: boolean = false;
  onDragStart(event: DragEvent): void {
    event.dataTransfer?.setData('text/plain', JSON.stringify(this.imagePath))
  }
}
