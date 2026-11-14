import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Code } from './code';

describe('kit-code', () => {
  it('apaga as linhas que não rodam (skip)', async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(Code);
    fixture.componentRef.setInput('markup', `{k:if} (ok) {\n  {f:console.log}({v:"sim"});\n}`);
    fixture.componentRef.setInput('syntax', 'js');
    fixture.componentRef.setInput('skipped', [2]);
    await fixture.whenStable();

    const lines = [...(fixture.nativeElement as HTMLElement).querySelectorAll('code > span')];
    expect(lines.length).toBe(3);
    expect(lines.map((l) => l.classList.contains('kit-line-skip'))).toEqual([false, true, false]);
  });
});
