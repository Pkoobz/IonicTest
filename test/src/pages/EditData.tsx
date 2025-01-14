import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption} from '@ionic/react';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Transaction, Status } from '../types';
import { useHistory, useParams } from 'react-router';

const EditDataPage: React.FC = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;

    try {
      const transactionRef = doc(db, 'transactions', id);
      await updateDoc(transactionRef, {
        ...transaction,
        updateOn: new Date().toISOString(),
      });
      history.push('/home/data');
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  if (!transaction) return <div>Loading...</div>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Transaction</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={handleSubmit} className="p-4">
          <IonItem>
            <IonLabel position="floating">Product ID</IonLabel>
            <IonInput
              value={transaction.productID}
              onIonChange={e => setTransaction({...transaction, productID: e.detail.value!})}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Product Name</IonLabel>
            <IonInput
              value={transaction.productName}
              onIonChange={e => setTransaction({...transaction, productName: e.detail.value!})}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Amount</IonLabel>
            <IonInput
              type="number"
              value={transaction.amount}
              onIonChange={e => setTransaction({...transaction, amount: e.detail.value!})}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Customer Name</IonLabel>
            <IonInput
              value={transaction.customerName}
              onIonChange={e => setTransaction({...transaction, customerName: e.detail.value!})}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel>Status</IonLabel>
            <IonSelect
              value={transaction.status}
              onIonChange={e => setTransaction({...transaction, status: e.detail.value})}
            >
              {statuses.map((status) => (
                <IonSelectOption key={status.id} value={status.id}>
                  {status.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <div className="mt-4">
            <IonButton type="submit">Update Transaction</IonButton>
            <IonButton onClick={() => history.push('/home/data')} color="medium">
              Cancel
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default EditDataPage;