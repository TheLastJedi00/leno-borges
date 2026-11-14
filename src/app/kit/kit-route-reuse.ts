import { Injectable } from '@angular/core';
import { type ActivatedRouteSnapshot, BaseRouteReuseStrategy } from '@angular/router';

/**
 * Reaproveita o componente quando só o slide muda (o player troca de slide sem recarregar),
 * mas recria quando a trilha ou a aula mudam: o player e o apresentador leem a aula uma vez,
 * ao nascer, então seguir para a próxima aula precisa de um componente novo.
 */
@Injectable()
export class KitRouteReuseStrategy extends BaseRouteReuseStrategy {
  override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return (
      future.routeConfig === curr.routeConfig &&
      future.paramMap.get('trilha') === curr.paramMap.get('trilha') &&
      future.paramMap.get('aula') === curr.paramMap.get('aula')
    );
  }
}
