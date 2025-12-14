import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar';
import { AuthService } from '../../services/auth';
import { Router, ActivatedRoute, UrlTree, NavigationEnd } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { User } from '../../models';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let currentUserSubject: BehaviorSubject<User | null>;

  const mockUser: User = { id: 1, username: 'admin', email: 'admin@test.com', password: '', rol: 'admin' };

  beforeEach(async () => {
    currentUserSubject = new BehaviorSubject<User | null>(mockUser);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser: currentUserSubject.asObservable()
    });

    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl']);
    routerSpy.createUrlTree.and.returnValue({} as UrlTree);
    routerSpy.serializeUrl.and.returnValue('fake-url');
    (routerSpy as any).events = of(new NavigationEnd(0, 'url', 'url'));

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have currentUser$ observable', () => {
    component.currentUser$.subscribe(user => {
      expect(user?.username).toBe('admin');
    });
  });

  it('should call logout on authService', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should emit null when user logs out', () => {
    currentUserSubject.next(null);
    component.currentUser$.subscribe(user => {
      expect(user).toBeNull();
    });
  });
});
