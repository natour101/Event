import { EventCardData } from '../components/EventCard';

export const featuredEvents: EventCardData[] = [
  {
    id: 'featured-1',
    title: 'مهرجان الرياض للموسيقى',
    subtitle: '12 أكتوبر • بوليفارد الرياض',
    date: '13 أكتوبر',
    tag: 'موسيقى',
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
  },
];

export const nearbyEvents: EventCardData[] = [
  {
    id: 'nearby-1',
    title: 'نادي القراءة المسائي',
    subtitle: 'مكتبة الملك فهد',
    date: '3 كم',
    tag: 'آداب',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'nearby-2',
    title: 'ورشة القهوة المختصة',
    subtitle: 'حي العليا، الرياض',
    date: '5 كم',
    tag: 'طعام',
    image:
      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=1200&q=80',
  },
];

export const newestEvents: EventCardData[] = [
  {
    id: 'new-1',
    title: 'مؤتمر التقنية 2024',
    subtitle: 'اكتشف أحدث التقنيات في العالم الرقمي',
    date: '20 ديسمبر • 4:00 م',
    tag: 'جديد',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'new-2',
    title: 'ورشة الرسم الزيتي',
    subtitle: 'تعلم أساسيات الرسم للمبتدئين',
    date: '23 ديسمبر • 6:00 م',
    tag: 'مجاني',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
  },
];

export const exploreEvents: EventCardData[] = [
  {
    id: 'explore-1',
    title: 'مهرجان الصيف الموسيقي',
    subtitle: 'الرياض بارك، الرياض',
    date: '24 أغسطس',
    tag: '50 ريال',
    image:
      'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'explore-2',
    title: 'ملتقى الشركات الناشئة',
    subtitle: 'المدينة الرقمية، الرياض',
    date: '2 سبتمبر',
    tag: 'مجاني',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'explore-3',
    title: 'معرض الفنون الحديثة',
    subtitle: 'حي جاكس، الدرعية',
    date: '5 سبتمبر',
    tag: '15 ريال',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
  },
];

export const tournamentItems = [
  {
    id: 'tour-1',
    title: 'كأس الصيف فيفا 24',
    subtitle: 'نهائيات الشرق الأوسط • الرياض',
    prize: '5000 ر.س',
    teams: '32 فريق',
    image:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'tour-2',
    title: 'دوري روكيت ليج',
    subtitle: 'بطولة فيفا العرب',
    prize: '3000 ر.س',
    teams: '24 فريق',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
  },
];

export const detailData = {
  title: 'مؤتمر مستقبل التقنية 2024',
  rating: '4.8 (٢k مراجعة)',
  attendees: '120 مسجل',
  host: 'مجتمع تقنية الرياض',
  date: 'الأحد 12 نوفمبر 2024',
  time: '9:00 صباحاً - 5:00 مساءً',
  location: 'واجهة الرياض، مركز المعارض والمؤتمرات',
  description:
    'الحدث التقني الأكبر في المنطقة! يجمع مؤتمر مستقبل التقنية 2024 نخبة من المتحدثين والخبراء لمناقشة أحدث الاتجاهات في الذكاء الاصطناعي والأمن السيبراني والحوسبة السحابية.',
};
