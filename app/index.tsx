// import { Welcome } from '../components/Welcome';

// export default function HomeScreen() {
//   return <Welcome onStart={() => console.log('Quiz started!')} />;
// }
// import { Redirect } from 'expo-router';

// export default function Index() {
//   return <Redirect href="/dashboard" />;
// }
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/dashboard" />;
}

