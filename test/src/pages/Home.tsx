import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonButton onClick={() => history.push('/home/data')}>
          Go to Data Table
        </IonButton>
        <IonButton onClick={() => history.push('/home/add')}>
          Go to Add Data
        </IonButton>
        <IonButton onClick={() => history.push('/home/view/1')}>
          Go to View Detail
        </IonButton>
        <IonButton onClick={() => history.push('/home/edit/1')}>
          Go to Edit Data
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;