import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { configureTestSuite } from "./testing";

@Component({
    template: `<h1>Hello from ng-bullet</h1>`
})
class TestComponent {
}


describe('ng bullet tests', () => {
    const configureActionSuite = describe('when using configureTestSuite and configure action specified', () => {
        const originResetTestBed = TestBed.resetTestingModule;
        let compileComponentsSpy: jasmine.Spy;

        configureTestSuite(() => {
            TestBed.configureTestingModule({
                declarations: [ TestComponent ]
            });
        });

        beforeEach(() => {
            compileComponentsSpy = spyOn(TestBed, "compileComponents");
        });

        it(`original reset function is being replaces with fake`, () => {
            expect(TestBed.resetTestingModule).not.toEqual(originResetTestBed);
        });

        it(`compileComponents function is being called automatically and only once`, () => {
            expect(compileComponentsSpy).not.toHaveBeenCalledTimes(1);
        });

        it(`jasmine callback functions are being set`, () => {
            const currentSuite = <any>configureActionSuite;
            expect(currentSuite.beforeAllFns.length).toBe(2, 'should register beforeAll callback and extra callback for compilation');
            expect(currentSuite.afterAllFns.length).toBe(1, 'should register afterAll callback');
            expect(currentSuite.afterFns.length).toBe(1, 'should register afterEach callback');

            // there is one beforeEach in current suite, configureTestSuite should not add more
            expect(currentSuite.beforeFns.length - 1).toBe(0, 'should not register beforeEach callback');
        });
    });

    const noConfigureActionSuite = describe('when using configureTestSuite, no configure action specified', () => {
        const originResetTestBed = TestBed.resetTestingModule;
        let compileComponentsSpy: jasmine.Spy;

        configureTestSuite();

        beforeEach(() => {
            compileComponentsSpy = spyOn(TestBed, "compileComponents");
        });

        it(`original reset function is being replaces with fake`, () => {
            expect(TestBed.resetTestingModule).not.toEqual(originResetTestBed);
        });

        it(`compileComponents function is not being called automatically`, () => {
            expect(compileComponentsSpy).not.toHaveBeenCalled();
        });

        it(`jasmine callback functions are being set`, () => {
            const currentSuite = <any>noConfigureActionSuite;
            expect(currentSuite.beforeAllFns.length).toBe(1, 'should register beforeAll callback');
            expect(currentSuite.afterAllFns.length).toBe(1, 'should register afterAll callback');
            expect(currentSuite.afterFns.length).toBe(1, 'should register afterEach callback');

            // there is one beforeEach in current suite, configureTestSuite should not add more
            expect(currentSuite.beforeFns.length - 1).toBe(0, 'should not register beforeEach callback');
        });
    });
});
