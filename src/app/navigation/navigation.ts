import { DesignNavigation } from '@design/types';

export const navigation: DesignNavigation[] = [
    {
        id       : 'applications',
        title    : 'MENU',
        type     : 'group',
        children : [
            {
                id       : 'home',
                title    : 'Home',
                type     : 'item',
                icon     : 'home',
                url      : '/',
                
            }
        ]
    }
];
