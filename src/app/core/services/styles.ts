import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Styles {
  get violet() {
    return '#6947C5'
  }
  get blue() {
    return '#3986FF'
  }
  get green() {
    return '#00BCB8'
  }
}
