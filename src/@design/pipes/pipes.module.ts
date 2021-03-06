import { NgModule } from '@angular/core';

import { KeysPipe } from './keys.pipe';
import { GetByIdPipe } from './getById.pipe';
import { HtmlToPlaintextPipe } from './htmlToPlaintext.pipe';
import { FilterPipe } from './filter.pipe';
import { CamelCaseToDashPipe } from './camelCaseToDash.pipe';
import { DiaDeLaSemanaPipe } from './diaDeLaSemana.pipe';
import { FechaADiaPipe } from './fechaADia.pipe';

@NgModule({
  declarations: [KeysPipe, GetByIdPipe, HtmlToPlaintextPipe, FilterPipe, CamelCaseToDashPipe, DiaDeLaSemanaPipe, FechaADiaPipe],
  imports: [],
  exports: [KeysPipe, GetByIdPipe, HtmlToPlaintextPipe, FilterPipe, CamelCaseToDashPipe, DiaDeLaSemanaPipe, FechaADiaPipe],
})
export class DesignPipesModule {}
