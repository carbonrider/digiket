import NodeCache from 'node-cache';
import { v4 as uuidv4 } from 'uuid';

const cache = new NodeCache({
  stdTTL: 0,
  useClones: false,
  deleteOnExpire: true,
  maxKeys: 100,
});

const initialData = [
  {
    uuid: uuidv4(),
    title: 'HEART',
    category: 'Rock',
    poster: 'https://prismic-images.tmol.io/ticketmaster-tm-global/7febb3f5-9adc-4ced-b266-030e402a62fc_EADP-Desktop-Header-heart.png?auto=compress,format&rect=0,0,2425,1023&w=1024&h=432',
  },
  {
    uuid: uuidv4(),
    title: 'Lauren Daigle',
    category: 'Religious',
    poster: 'https://prismic-images.tmol.io/ticketmaster-tm-global/599d64c7-10d4-429e-9556-20487e28e54a_EADP-Desktop-Header-Lauren+Daigle.jpg?auto=compress,format&rect=0,0,2425,1023&w=1024&h=432',
  }
];

initialData.forEach((concert) => {
  cache.set(concert.uuid, concert);
});

export default cache;