import { init } from '@paralleldrive/cuid2';

const createId = init({
    length: 24,
});

const generateCuid = () => createId();

export default generateCuid;
