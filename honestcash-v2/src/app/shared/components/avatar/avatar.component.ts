import {Component, Input} from '@angular/core';

@Component({
   selector: 'app-avatar',
   templateUrl: `./avatar.component.html`,
   styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  private _src = '';
  @Input() public large = false;
  @Input()
  public set src(src: string) {
    this._src = (src && src.trim()) || 'https://png.pngtree.com/svg/20161027/631929649c.svg';
  }

  public get src(): string { return this._src; }
}