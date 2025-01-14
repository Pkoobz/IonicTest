import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption} from '@ionic/react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Status } from '../types';
import { useHistory } from 'react-router';

const AddDataPage: React.FC = () => {
  const [formData, setFormData] = useState({
    productID: '',
    productName: '',
    amount: '',
    customerName: '',
    status: 0,
  });
  const [statuses, setStatuses] = useState<Status[]>([]);
  const history = useHistory();

  useEffect(() => {
    const fetchStatuses = async () => {
      const statusesRef = collection(db, 'statuses');
      const statusSnap = await getDocs(statusesRef);
      const statusData: Status[] = [];
      statusSnap.forEach((doc) => {
        statusData.push(doc.data() as Status);
      });
      setStatuses(statusData);
    };

    fetchStatuses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const transactionsRef = collection(db, 'transactions');
      await addDoc(transactionsRef, {
        ...formData,
        id: Date.now(),
        transactionDate: new Date().toISOString(),
        createBy: 'system',
        createOn: new Date().toISOString(),
      });
      history.push('/home/data');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add New Transaction</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={handleSubmit} className="p-4">
          <IonItem>
            <IonLabel position="floating">Product ID</IonLabel>
            <IonInput
              value={formData.productID}
              onIonChange={e => setFormData({...formData, productID: e.detail.value!})}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Product Name</IonLabel>
            <IonInput
              value={formData.productName}
              onIonChange={e => setFormData({...formData, productName: e.detail.value!})}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Amount</IonLabel>
            <IonInput
              type="number"
              value={formData.amount}
              onIonChange={e => setFormData({...formData, amount: e.detail.value!})}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Customer Name</IonLabel>
            <IonInput
              value={formData.customerName}
              onIonChange={e => setFormData({...formData, customerName: e.detail.value!})}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel>Status</IonLabel>
            <IonSelect
              value={formData.status}
              onIonChange={e => setFormData({...formData, status: e.detail.value})}
            >
              {statuses.map((status) => (
                <IonSelectOption key={status.id} value={status.id}>
                  {status.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <div className="mt-4">
            <IonButton type="submit">Save Transaction</IonButton>
            <IonButton onClick={() => history.push('/home/data')} color="medium">
              Cancel
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default AddDataPage;