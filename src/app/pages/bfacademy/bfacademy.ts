import { Component } from '@angular/core';
import { Header } from "../../shared/header/header";
import { Gradient } from "../../shared/gradient/gradient";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: 'app-bfacademy',
  imports: [ Header, Gradient, NgOptimizedImage],
  templateUrl: './bfacademy.html',
})
export class Bfacademy {

}
