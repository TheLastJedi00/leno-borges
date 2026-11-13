import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

/** Largura e altura lógicas do slide; tudo dentro do palco é desenhado nessa escala. */
export const STAGE_W = 1280;
export const STAGE_H = 720;

/**
 * Palco 16:9: desenha o conteúdo em 1280×720 e escala para caber na largura do host.
 * O mesmo slide fica idêntico no projetor, no notebook e na miniatura do apresentador.
 */
@Component({
  selector: 'kit-stage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="relative aspect-video w-full overflow-hidden rounded-2xl bg-surface shadow-raised-lg">
      <div
        class="absolute top-0 left-0 origin-top-left"
        [style.width.px]="w"
        [style.height.px]="h"
        [style.transform]="'scale(' + scale() + ')'"
      >
        <ng-content />
      </div>
    </div>
  `,
})
export class Stage {
  readonly w = STAGE_W;
  readonly h = STAGE_H;
  readonly scale = signal(0);

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const update = () => this.scale.set(host.clientWidth / STAGE_W);
      update();
      const observer = new ResizeObserver(update);
      observer.observe(host);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
