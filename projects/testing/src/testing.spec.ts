import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { configureTestSuite } from "./testing";

describe('ng bullet tests', () => {

    const noConfigureActionSuite = describe('when using configureTestSuite, no configure action specified', () => {
        const originResetTestBed = TestBed.resetTestingModule;
        let compileComponentsSpy: jasmine.Spy;

        beforeEach(() => {
            compileComponentsSpy = spyOn(TestBed, "compileComponents");
        });

        configureTestSuite();

        it(`original reset function is being replaces with fake`, () => {
            expect(TestBed.resetTestingModule).not.toEqual(originResetTestBed);
        });

        it(`compileComponents function is not being called automatically`, () => {
            expect(compileComponentsSpy).not.toHaveBeenCalled();
        });

        it(`jasmine callback functions are being set`, () => {
            const currentSuite = <any>noConfigureActionSuite;
            expect(currentSuite.beforeAllFns.length).toBe(1, 'configureTestSuite should register beforeAll callback');
            expect(currentSuite.afterAllFns.length).toBe(1, 'configureTestSuite should register afterAll callback');
            expect(currentSuite.afterFns.length).toBe(1, 'configureTestSuite should register afterEach callback');

            // there is one beforeEach in current suite, configureTestSuite should not add more
            expect(currentSuite.beforeFns.length - 1).toBe(0, 'configureTestSuite should not register beforeEach callback');
        });
    });
});

@Component({
    template: `<h1>Hello from ng-bullet</h1>`
})
class TestComponent {
}
