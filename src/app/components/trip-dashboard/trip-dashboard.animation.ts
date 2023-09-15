import {
  trigger,
  transition,
  style,
  query,
  stagger,
  animate,
  animateChild,
  group, state
} from '@angular/animations';

export const staggeredFadeIn = trigger('staggeredFadeIn', [
  transition('* <=> *', [ // You can change this to ':enter' if you just want it on entering the view
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(-20px)' }),
      stagger('400ms', [
        group([
          animate('1000ms ease-out', style({ opacity: 1 })),
          animate('1000ms ease-out', style({ transform: 'translateY(0)' }))
        ])
      ])
    ], { optional: true }),
    query(':enter', animateChild(), { optional: true })
  ])
]);

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('600ms', style({ opacity: 1 })),
  ])
]);

export const disabledFadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('1000ms', style({ opacity: 1 }))
  ])
]);

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [  // this is equivalent to 'void => *'
    style({ opacity: 0 }),
    animate('600ms', style({ opacity: 1 }))
  ]),
  transition(':leave', [  // this is equivalent to '* => void'
    animate('600ms', style({ opacity: 0 }))
  ])
]);

export const flyInOut = trigger('flyInOut', [
  state('in', style({ transform: 'translateX(0)' })),
  transition('void => *', [
    style({ transform: 'translateX(100%)' }),
    animate('200ms 100ms ease-out')  // 200ms duration, 100ms delay
  ]),
  transition('* => void', [
    animate('100ms ease-in', style({ transform: 'translateX(100%)' }))
  ])
])
