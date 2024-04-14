import NodeCache from 'node-cache';
import { v4 as uuidv4 } from 'uuid';

const cache = new NodeCache({
  stdTTL: 0,
  useClones: false,
  deleteOnExpire: true,
  maxKeys: 100,
});


export default cache;