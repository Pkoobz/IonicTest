import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Testing</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonButton onClick={() => history.push('/home/data')}>
          Go to Data Table
        </IonButton>
        <IonButton onClick={() => history.push('/home/add')}>
          Go to Add Data
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;