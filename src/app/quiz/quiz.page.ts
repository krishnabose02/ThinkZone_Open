import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { IonSlides, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
})
export class QuizPage implements OnInit {
quiz;
qno = 1;
submitButton;
submitButtonText;
score;
totalScore;

  @ViewChild('slides') slides;
  constructor(public dataServ: DataService, public modalCtrl: ModalController) {
    this.quiz = dataServ.getData('quiz');
    let count = 1;
    this.quiz.forEach(element => {
      element.index = count++;
      element.selectedOption = 0;
    });
   }

  ngOnInit() {
    // this.slides.lockSwipes(true);
  }

  move(n: number) {
    if (this.slides == null) {
      alert('null');
    } else {
      console.log('moving slides...', n);
      if (n > 0 && this.qno !== this.quiz.length) {
        this.slides.lockSwipes(false);
        this.slides.slideNext();
        this.slides.lockSwipes(true);
        this.qno++;
      } else if (n < 0 && this.qno !== 1) {
        this.slides.lockSwipes(false);
        this.slides.slidePrev();
        this.slides.lockSwipes(true);
        this.qno--;
      } else {
        console.log('nothing happening');
      }
    }
  }

  logData(data) {
    console.log(data);
    let count = 0;
    this.quiz.forEach(element => {
      if (element.selectedOption !== 0) {
        count++;
      }
    });

    if (count === this.quiz.length) {
        this.submitButton = true;
        this.submitButtonText = 'Complete Quiz';
    }
  }

  closeQuiz() {
    this.modalCtrl.dismiss({isComplete: false, totalScore: 0, score: 0});
  }

  finishQuiz() {
    this.totalScore = 0;
    this.score = 0;

    this.quiz.forEach(element => {
      this.totalScore += 10;
      if (element.selectedOption === element.answer) {
        this.score += 10;
      }
    });
    this.modalCtrl.dismiss({isComplete: true, score: this.score, totalScore: this.totalScore});
  }
}
