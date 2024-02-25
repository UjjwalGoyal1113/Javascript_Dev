import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { GameConstants, GamePins } from './Models/Game-Enums';
import { Subscription, subscribeOn } from 'rxjs';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit, OnDestroy {

  isImageDropped = false;
  isMatched = false;
  showGame = false;
  showEntryForm = true;
  score: number = 0
  attempt: number = 0
  isGameOver = false
  timeStamp: string = ''
  isLoading = false;
  dropedImage = false;
  PinValueToValidate: any
  result: string = ''
  userName: any = ''
  randomImage: string = ''
  lastImageIndex: number[] = []
  draggedImageName: string = ''
  folder_CurrentImages: any[] = ['101.jpg', '102.jpg', '103.jpg', '104.jpg', '105.jpg', '106.jpg', '107.jpg', '108.jpg', '109.jpg', '110.jpg']
  folder_OldImages: any[] = ['101.jpg', '102.jpg', '103.jpg', '104.jpg', '105.jpg', '106.jpg', '107.jpg', '108.jpg', '109.jpg', '110.jpg',]
  TeamEntryForm: FormGroup
  countdownValue: number = 10
  private countDownTimer: any
  unsubscribe$: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder) {
    this.TeamEntryForm = this.formBuilder.group({
      Team: '',
      Pin: ''
    });
  }
  ngOnDestroy(): void {
    clearInterval(this.countDownTimer)
  }

  ngOnInit(): void {
    this.dropedImage = false;
  }

  onSubmit(): void {
    this.PinValueToValidate = this.TeamEntryForm.value.Pin;
    if (GamePins.includes(Number(this.PinValueToValidate))) {
      alert(GameConstants.AlertMessage)
      this.getRandomImage();
    }
    else {
      this.getRandomImage();
    }
    this.showGame = true;
    this.showEntryForm = false;
  }

  loadImages(): void {
    this.getRandomImage();
    this.isImageDropped = false;
  }

  getRandomImage(): void {
    if (this.folder_CurrentImages.length > 0 && this.attempt < 10) {
      let randomIndex: number;
      do {
        randomIndex = Math.floor(Math.random() * this.folder_OldImages.length);
      } while (this.lastImageIndex.includes(randomIndex));
      this.lastImageIndex.push(randomIndex);
      this.randomImage = this.folder_OldImages[randomIndex];
      this.countdownValue = 10;
      this.startCountdown();
      if (this.attempt > 10) {
        this.attempt = 1;
        this.isGameOver = true
        clearInterval(this.countDownTimer)
      }
      this.attempt++;
    } else {
      this.isGameOver = true;
      this.result = '';
      this.attempt = 0;
      clearInterval(this.countDownTimer)
    }
  }

  startCountdown(): void {
    let seconds = this.countdownValue;
    this.countDownTimer = setInterval(() => {
      this.countdownValue = seconds
      seconds--
      if (seconds < 0) {
        clearInterval(this.countDownTimer);
        this.getRandomImage();
      }
    }, 1000)
  }

  allowDrop(event: any): void {
    event.preventDefault();
  }

  drag(event: any, index: number): void {
    this.draggedImageName = this.folder_CurrentImages[index];
    event.dataTransfer.setData('text', index);
  }

  drop(event: any): void {
    event.preventDefault();
    const index = event.dataTransfer.getData('text');
    const draggedImage = document.querySelector(`img[data-index="${index}"]`) as HTMLImageElement;
    const draggedImageParentDiv = document.querySelector('.matching-image-box') as HTMLDivElement;
    const draggedAndDefaultImageParentDiv = document.querySelector('#div1') as HTMLDivElement;
    const clonedImage = draggedImage.cloneNode(true) as HTMLImageElement;
    draggedImageParentDiv.innerHTML = '';

    if (draggedImageParentDiv) {
      draggedImageParentDiv.style.border = 'none';
    }
    draggedImageParentDiv.appendChild(clonedImage);
    this.dropedImage = true;
    clearInterval(this.countDownTimer)

    if (this.draggedImageName === this.randomImage) {
      this.isMatched = true;
      this.result = GameConstants.MatchedResult;
      if (draggedImageParentDiv) {
        draggedAndDefaultImageParentDiv.style.border = '7px dotted #25ee00';
        this.score = this.score + 10;
      }
    } else {
      this.isMatched = false;
      this.result = GameConstants.UnMatchedResult;
      if (draggedImageParentDiv) {
        draggedAndDefaultImageParentDiv.style.border = '7px dotted #ff0000';
        this.score = this.score - 10;
      }
    }
    setTimeout(() => {
      clonedImage.remove();
      draggedAndDefaultImageParentDiv.style.border = 'none';
      draggedImageParentDiv.style.border = "4px dashed #1FB264";
      this.timeStamp = new Date().toLocaleString();
      this.userName = this.authService.getUname();
      this.result = ''
      this.getRandomImage()
    }, 3000);
  }
  restartGame(): void {
    clearInterval(this.countDownTimer);
    this.isGameOver = false;
    this.attempt = 0;
    this.score = 0;
    this.result = '';
    this.timeStamp = '';
    this.userName = '';
    this.getRandomImage();
  }

}