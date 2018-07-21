import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { configureTestSuite } from 'ng-bullet';

const generateSpecs = (settings: { description: string, numOfIterations: number, configureSuite: () => void}) => () => {
    const { description, numOfIterations, configureSuite } = settings;

    let start: number;

    beforeAll(() => {
       start = Date.now();
    });

    configureSuite();
    // generate more specs (just to keep jasmine busy)
    // to showcase the difference with ng-bullet and without it
    Array.from(Array(numOfIterations)).forEach(() => {
        it('should create the app', async(() => {
            const fixture = TestBed.createComponent(AppComponent);
            const app = fixture.debugElement.componentInstance;
            expect(app).toBeTruthy();
        }));

        it(`should have as title 'app'`, async(() => {
            const fixture = TestBed.createComponent(AppComponent);
            const app = fixture.debugElement.componentInstance;
            expect(app.title).toEqual('app');
        }));

        it('should render title in a h1 tag', async(() => {
            const fixture = TestBed.createComponent(AppComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement;
            expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
        }));
    });

    afterAll(() => {
        // tslint:disable-next-line:no-console
        console.info(`#time ${description} ${(Date.now() - start)} ms`);
    });
};

describe('AppComponent tests without ng-bullet', generateSpecs({
    description: "without ng-bullet",
    numOfIterations: 100,
    configureSuite: () => {
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [
                    AppComponent
                ],
            }).compileComponents();
        }));
    }
}));

describe('AppComponent tests with ng-bullet', generateSpecs({
    description: "with ng-bullet",
    numOfIterations: 100,
    configureSuite: () => {
        configureTestSuite(() => {
            TestBed.configureTestingModule({
                declarations: [
                    AppComponent
                ],
            });
        });
    }
}));
