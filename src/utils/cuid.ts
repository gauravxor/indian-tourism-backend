import { init } from '@paralleldrive/cuid2';

const createId = init({
    length: 26,
});

const generateCuid = () => createId();

export default generateCuid;
