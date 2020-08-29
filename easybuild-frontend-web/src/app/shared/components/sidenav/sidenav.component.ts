import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent {
  minimized: boolean = true;
  
  public readonly navLinks = [
    { title: "Home", icon: "home", route: "home", primary: true },
    { title: "Adverts", icon: "search", route: "/advert/search", primary: true },
    { title: "Create Advert", icon: "post_add", route: "/advert/create", primary: true },
    { title: "Favorite adverts", icon: "favorite", route: "/advert/favorites", primary: true }
  ];

  public readonly primaryNavLinks = this.navLinks.filter(l => l.primary);

  toggle(): void {
    this.minimized = !this.minimized;
  }
}