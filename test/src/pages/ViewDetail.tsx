import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonList, IonBackButton, IonButtons, IonBadge, IonCard, IonCardContent, IonSkeletonText} from '@ionic/react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Transaction, Status } from '../types';
import { useParams, useHistory } from 'react-router';

const ViewDetail: React.FC = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const transactionRef = doc(db, 'transactions', id);
        const transactionSnap = await getDoc(transactionRef);
        
        if (!transactionSnap.exists()) {
          throw new Error('Transaction not found');
        }

        const transactionData = transactionSnap.data() as Transaction;
        setTransaction({
          ...transactionData,
          docId: transactionSnap.id
        });

        const statusesRef = collection(db, 'statuses');
        const statusSnap = await getDocs(statusesRef);
        const statusData: Status[] = [];
        statusSnap.forEach((doc) => {
          statusData.push({ ...doc.data() as Status });
        });
        setStatuses(statusData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getStatusName = (statusId: number) => {
    return statuses.find(s => s.id === statusId)?.name || 'Unknown';
  };

  const getStatusColor = (statusId: number) => {
    const status = statuses.find(s => s.id === statusId);
    switch (status?.name.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'medium';
    }
  };

  if (loading) {
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
            {[...Array(6)].map((_, i) => (
              <IonCard key={i} className="mb-4">
                <IonCardContent>
                  <IonSkeletonText animated style={{ width: '60%' }} />
                  <IonSkeletonText animated style={{ width: '80%' }} />
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home/data" />
            </IonButtons>
            <IonTitle>Error</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="p-4">
            <IonCard color="danger">
              <IonCardContent>{error}</IonCardContent>
            </IonCard>
            <IonButton 
              expand="block" 
              onClick={() => history.push('/home/data')}
              className="mt-4"
            >
              Back to Transactions
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!transaction) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home/data" />
            </IonButtons>
            <IonTitle>Transaction Not Found</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="p-4">
            <IonCard>
              <IonCardContent>
                Transaction not found or has been deleted.
              </IonCardContent>
            </IonCard>
            <IonButton 
              expand="block" 
              onClick={() => history.push('/home/data')}
              className="mt-4"
            >
              Back to Transactions
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

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
          <IonCard>
            <IonCardContent>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Transaction #{transaction.id}</h2>
                <IonBadge color={getStatusColor(transaction.status)}>
                  {getStatusName(transaction.status)}
                </IonBadge>
              </div>

              <IonList>
                <IonItem>
                  <IonLabel>
                    <h2 className="font-medium text-gray-600">Product Details</h2>
                    <p className="text-lg">{transaction.productName}</p>
                    <p className="text-sm text-gray-500">ID: {transaction.productID}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h2 className="font-medium text-gray-600">Amount</h2>
                    <p className="text-lg">{transaction.amount}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h2 className="font-medium text-gray-600">Customer</h2>
                    <p className="text-lg">{transaction.customerName}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h2 className="font-medium text-gray-600">Transaction Date</h2>
                    <p className="text-lg">
                      {new Date(transaction.transactionDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h2 className="font-medium text-gray-600">Created By</h2>
                    <p className="text-lg">{transaction.createBy}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createOn).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          <div className="ion-padding">
            <IonButton type="submit" expand="block"
              onClick={() => history.push(`/home/data/edit/${id}`)}
              >
              Edit Transaction
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ViewDetail;