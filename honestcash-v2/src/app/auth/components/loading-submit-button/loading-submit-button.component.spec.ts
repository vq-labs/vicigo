import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AuthLoadingSubmitButtonComponent} from './loading-submit-button.component';
import {By} from '@angular/platform-browser';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

describe('AuthLoadingSubmitButtonComponent', () => {
  let component: AuthLoadingSubmitButtonComponent;
  let fixture: ComponentFixture<AuthLoadingSubmitButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FontAwesomeModule
      ],
      declarations: [
        AuthLoadingSubmitButtonComponent
      ],
    }).compileComponents().then(() => {
      library.add(faSpinner);
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthLoadingSubmitButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no initial state of @Inputs', () => {
    expect(component.btnClass).toBeUndefined();
    expect(component.isLoading).toBeUndefined();
    expect(component.text).toBeUndefined();
    expect(component.loadingText).toBeUndefined();
  });

  it('should correctly render the passed @Input text value and NOT loadingText value when isLoading is set to false', () => {
    // there shouldn't be any value initially
    const button = fixture.debugElement.query(By.css('button'));
    const text = button.query(By.css('#text'));
    const loadingText = button.query(By.css('#loading-text'));
    expect(text.nativeElement.innerHTML).toBe('');

    // let's set the @Input value and then verify again
    component.text = 'Sign Up';

    fixture.detectChanges();
    expect(text.nativeElement.innerHTML).toBe('Sign Up');
    expect(loadingText).toBeNull(); // due to *ngIf
  });

  it('should correctly render the passed @Input loadingText value and NOT text value, when isLoading is set to true', () => {
    // there shouldn't be any value initially
    const button = fixture.debugElement.query(By.css('button'));

    // let's set the @Input value and then verify again
    component.isLoading = true;
    fixture.detectChanges();

    const text = button.query(By.css('#text'));
    const loadingText = button.query(By.css('#loading-text'));
    expect(loadingText.nativeElement.innerHTML).toBe('');
    component.text = 'Sign Up';
    component.loadingText = 'Signing Up';

    fixture.detectChanges();
    expect(loadingText.nativeElement.innerHTML).toBe('Signing Up');
    expect(text).toBeNull();
  });
});
