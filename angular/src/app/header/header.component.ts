import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: true,
})
export class HeaderComponent {
    @Input() pageTitle!: string;
    @Input() logoSrc!: string;
}
