export interface Product {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  price: string;
  image: string;
}

export const categories = [
  { id: 'all', name: 'All Catch', active: false },
  { id: 'fresh', name: 'Fresh Fish', active: true },
  { id: 'shellfish', name: 'Shellfish & Crustacean', active: false },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Garoupa...',
    subtitle: '1.2 kg avg • Whole',
    tag: 'Docked Today',
    price: '14.500 AOA',
    image: '/imagem do projecto/Margin.png',
  },
  {
    id: '2',
    name: 'Camarão Tigre',
    subtitle: '1.0 kg • Raw Unpeeled',
    tag: 'Flash Chilled',
    price: '22.000 AOA',
    image: '/imagem do projecto/Margin(5).png',
  },
  {
    id: '3',
    name: 'Corvina Fresca',
    subtitle: '2.5 kg • Scaled & Gutted',
    tag: 'Wild Caught',
    price: '9.800 AOA',
    image: '/imagem do projecto/Margin(10).png',
  },
  {
    id: '4',
    name: 'Lagosta da Costa',
    subtitle: '800 g • Ocean Tank',
    tag: 'Live Catch',
    price: '35.000 AOA',
    image: '/imagem do projecto/Margin(11).png',
  },
  {
    id: '5',
    name: 'Peixe Espada',
    subtitle: '1.5 kg • Fillet or Steaks',
    tag: 'Wild Caught',
    price: '11.200 AOA',
    image: '/imagem do projecto/Margin(12).png',
  },
  {
    id: '6',
    name: 'Choco Fresco',
    subtitle: '1.0 kg • Cleaned Ink-In',
    tag: 'Fresh In',
    price: '8.400 AOA',
    image: '/imagem do projecto/Margin(13).png',
  },
];