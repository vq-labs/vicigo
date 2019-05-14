import { NgModule } from '@angular/core';
import { FontAwesomeModule as OriginalFontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
  faEnvelope,
  faUser,
  faPaperPlane,
} from '@fortawesome/free-regular-svg-icons';
import {
  faComments,
  faKey,
  faGlobe,
  faHeart,
  faPenAlt,
  faRetweet,
  faShareAlt,
  faSpinner,
  faTerminal,
  faExclamationCircle,
  faWindowClose,
} from '@fortawesome/free-solid-svg-icons';
import {faBitcoin} from '@fortawesome/free-brands-svg-icons';

@NgModule({
  declarations: [],
  imports: [
    OriginalFontAwesomeModule,
  ],
  providers: [],
  exports: [OriginalFontAwesomeModule],
})
export class FontAwesomeModule {
  constructor() {
    library.add(faComments);
    library.add(faTerminal);
    library.add(faGlobe);
    library.add(faRetweet);
    library.add(faBitcoin);
    library.add(faShareAlt);
    library.add(faHeart);
    library.add(faSpinner);
    library.add(faEnvelope);
    library.add(faUser);
    library.add(faKey);
    library.add(faExclamationCircle);
    library.add(faPenAlt);
    library.add(faPaperPlane);
    library.add(faWindowClose);
  }
}
