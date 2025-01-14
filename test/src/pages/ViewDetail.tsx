import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonList, IonBackButton, IonButtons} from '@ionic/react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Transaction, Status } from '../types';
import { useParams, useHistory } from 'react-router';

const ViewDetailPage: React.FC = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transaction
        const transactionRef = doc(db, 'transactions', id);
        const transactionSnap = await getDoc(transactionRef);
        if (transactionSnap.exists()) {
          setTransaction(transactionSnap.data() as Transaction);
        }

        // Fetch statuses
        const statusesRef = collection(db, 'statuses');
        const statusSnap = await getDocs(statusesRef);
        const statusData: Status[] = [];
        statusSnap.forEach((doc) => {
          statusData.push(doc.data() as Status);
        });
        setStatuses(statusData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  if (!transaction) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home/data" />
            </IonButtons>
            <IonTitle>Transaction Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="p-4">Loading...</div>
        </IonContent>
      </IonPage>
    );
  }

  const getStatusName = (statusId: number) => {
    return statuses.find(s => s.id === statusId)?.name || 'Unknown';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home/data" />
          </IonButtons>
          <IonTitle>Transaction Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="p-4">
          <IonList>
            <IonItem>
              <IonLabel>
                <h2>Transaction ID</h2>
                <p>{transaction.id}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Product ID</h2>
                <p>{transaction.productID}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Product Name</h2>
                <p>{transaction.productName}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Amount</h2>
                <p>{transaction.amount}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Customer Name</h2>
                <p>{transaction.customerName}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Status</h2>
                <p>{getStatusName(transaction.status)}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Transaction Date</h2>
                <p>{new Date(transaction.transactionDate).toLocaleString()}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Created By</h2>
                <p>{transaction.createBy}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Created On</h2>
                <p>{new Date(transaction.createOn).toLocaleString()}</p>
              </IonLabel>
            </IonItem>
          </IonList>

          <div className="p-4">
            <IonButton onClick={() => history.push(`/home/edit/${transaction.id}`)}>
              Edit Transaction
            </IonButton>
            <IonButton onClick={() => history.push('/home/data')} color="medium">
              Back to List
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ViewDetailPage;