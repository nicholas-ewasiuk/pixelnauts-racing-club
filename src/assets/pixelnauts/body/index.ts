import blue from './body-blue.png';
import holographic from './body-holographic.png';
import orca from './body-orca.png';
import pink from './body-pink.png';
import yellow from './body-yellow.png';

interface Body {
  blue: string,
  holographic: string,
  orca: string,
  pink: string,
  yellow: string
}

const body: Body = {
  blue,
  holographic,
  orca,
  pink,
  yellow
};

export default body;