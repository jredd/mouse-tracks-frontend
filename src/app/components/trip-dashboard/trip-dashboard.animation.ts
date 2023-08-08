import {
  trigger,
  transition,
  style,
  query,
  stagger,
  animate,
  animateChild,
  group, keyframes
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

