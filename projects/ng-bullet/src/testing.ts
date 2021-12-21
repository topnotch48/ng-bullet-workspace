import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { Type } from '@angular/core';

/**
 * Reconfigures current test suit to prevent angular components re-compilation after every test run.
 * Forces angular test bed to re-create zone and all injectable services by directly
 * setting _instantiated variable to false after every test run.
 * Cleanups all the changes and reverts test bed configuration after suite has finished.
 *
 * @param configureAction an optional delegate which can be used to configure test bed for the current test suite
 * directly in the configureTestSuite call (you don't need extra BeforeAll in this case)
 */
export const configureTestSuite = (configureAction?: () => void) => {
    const testBedApi: any = getTestBed();
    const originReset = TestBed.resetTestingModule;

    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.resetTestingModule = () => TestBed;
    });

    // https://github.com/topnotch48/ng-bullet-workspace/issues/38
    if (configureAction) {
        beforeAll((done: DoneFn) => {
          (async function() {
            configureAction();
            await TestBed.compileComponents();
          }().then(done).catch(done.fail));
        });
      }

    afterEach(() => {
        testBedApi._activeFixtures.forEach((fixture: ComponentFixture<any>) => fixture.destroy());
        // reset ViewEngine TestBed
        testBedApi._instantiated = false;
        // reset Ivy TestBed
        testBedApi._testModuleRef = null;
    });

    afterAll(() => {
        TestBed.resetTestingModule = originReset;
        TestBed.resetTestingModule();
    });
};

/**
 * A wrapper class around ComponentFixture, which provides useful accessros:
 * component - to access component instance of current the fixture
 * element - to access underlying native element of the current component
 * detectChanges - to run change detections using current fixture
 * resolve - to resolve a type using current fixture's injector
 */
export class TestCtx<T> {
    constructor(public fixture: ComponentFixture<T>) { }

    public get component() { return this.fixture.componentInstance; }

    public get element(): HTMLElement { return this.fixture.debugElement.nativeElement; }

    public detectChanges() { this.fixture.detectChanges(); }

    public resolve(component: Type<any>) { return this.fixture.debugElement.injector.get(component); }
}

/**
 * Creates TestCtx instance for the Angular Component which is not initialized yet (no ngOnInit called)
 * Use case: you can override Component's providers before hooks are called.
 *
 * @param component - type of component to create instance of
 * **/
export const createTestContext = <T>(component: Type<T>) => {
    const fixture = TestBed.createComponent<T>(component);
    const testCtx = new TestCtx<T>(fixture);
    return testCtx;
};

/**Same as @function createTestContext, but waits till fixture becomes stable */
export const createStableTestContext = async <T>(component: Type<T>) => {
    const testCtx = createTestContext(component);
    testCtx.detectChanges();
    await testCtx.fixture.whenStable();
    testCtx.detectChanges();
    return testCtx;
};
