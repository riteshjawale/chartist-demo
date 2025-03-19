import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase'; // Import Firebase
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './AdminPanel.css';

function AdminPanel({ leagueData, setLeagueData, applications, setApplications }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [acceptedApplications, setAcceptedApplications] = useState([]);
  const navigate = useNavigate();

  // Load accepted applications from Firestore on component mount
  useEffect(() => {
    const fetchAcceptedApplications = async () => {
      const querySnapshot = await getDocs(collection(db, 'acceptedApplications'));
      const apps = [];
      querySnapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() });
      });
      setAcceptedApplications(apps);
    };
    fetchAcceptedApplications();
  }, []);

  // Save accepted application to Firestore
  const saveAcceptedApplication = async (application) => {
    try {
      const docRef = await addDoc(collection(db, 'acceptedApplications'), application);
      console.log('Application saved with ID: ', docRef.id);
    } catch (error) {
      console.error('Error saving application: ', error);
    }
  };

  // Delete accepted application from Firestore
  const deleteAcceptedApplication = async (id) => {
    try {
      await deleteDoc(doc(db, 'acceptedApplications', id));
      setAcceptedApplications(acceptedApplications.filter((app) => app.id !== id));
      console.log('Application deleted with ID: ', id);
    } catch (error) {
      console.error('Error deleting application: ', error);
    }
  };

  const handleLogout = () => {
    navigate('/admin/login');
  };

  const updateLeagueData = (e) => {
    e.preventDefault();
    console.log('League data updated:', leagueData);
    alert('League data updated successfully!');
  };

  const handleApplicationStatus = async (id, status) => {
    if (status === 'approved') {
      // Find the application to approve
      const applicationToApprove = applications.find((app) => app.id === id);
      if (applicationToApprove) {
        // Add the application to the acceptedApplications state and Firestore
        const newAcceptedApp = {
          ...applicationToApprove,
          league: leagueData.currentLeague.startDate,
        };
        setAcceptedApplications([...acceptedApplications, newAcceptedApp]);
        await saveAcceptedApplication(newAcceptedApp);
      }
    }

    // Update the application status in the applications state
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status } : app
      )
    );
  };

  const handleUpdateTrader = (leagueType, rank, field, value) => {
    // Update the trader's data in the leagueData state
    const updatedTraders = leagueData[leagueType].traders.map((trader) =>
      trader.rank === rank ? { ...trader, [field]: value } : trader
    );

    setLeagueData({
      ...leagueData,
      [leagueType]: {
        ...leagueData[leagueType],
        traders: updatedTraders,
      },
    });
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="admin-content">
        <div className="league-management">
          <h2>League Management</h2>
          <form onSubmit={updateLeagueData}>
            <div className="form-group">
              <label>Current League Start Date</label>
              <input
                type="date"
                value={leagueData.currentLeague.startDate}
                onChange={(e) =>
                  setLeagueData({
                    ...leagueData,
                    currentLeague: {
                      ...leagueData.currentLeague,
                      startDate: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Next League Start Date</label>
              <input
                type="date"
                value={leagueData.currentLeague.nextLeagueStart}
                onChange={(e) =>
                  setLeagueData({
                    ...leagueData,
                    currentLeague: {
                      ...leagueData.currentLeague,
                      nextLeagueStart: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Current Participants</label>
              <input
                type="number"
                value={leagueData.currentLeague.participants}
                onChange={(e) =>
                  setLeagueData({
                    ...leagueData,
                    currentLeague: {
                      ...leagueData.currentLeague,
                      participants: parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
            <button type="submit" className="update-btn">
              Update League Dates
            </button>
          </form>
        </div>

        <div className="applications">
          <h2>League Applications</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Image</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.name}</td>
                  <td>{app.mobile}</td>
                  <td>
                    {app.image && (
                      <img
                        src={URL.createObjectURL(app.image)}
                        alt="Trading Screenshot"
                        width="50"
                        onClick={() => openImageModal(app.image)}
                        style={{ cursor: 'pointer' }}
                      />
                    )}
                  </td>
                  <td>{app.status}</td>
                  <td>
                    <button
                      onClick={() => handleApplicationStatus(app.id, 'approved')}
                      className="action-btn approve"
                      disabled={app.status === 'approved'}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApplicationStatus(app.id, 'rejected')}
                      className="action-btn reject"
                      disabled={app.status === 'rejected'}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="accepted-applications">
          <h2>Accepted Applications</h2>
          <table>
            <thead>
              <tr>
                <th>League</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {acceptedApplications.map((app) => (
                <tr key={app.id}>
                  <td>{app.league}</td>
                  <td>{app.name}</td>
                  <td>{app.mobile}</td>
                  <td>
                    {app.image && (
                      <img
                        src={URL.createObjectURL(app.image)}
                        alt="Trading Screenshot"
                        width="50"
                        onClick={() => openImageModal(app.image)}
                        style={{ cursor: 'pointer' }}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => deleteAcceptedApplication(app.id)}
                      className="action-btn delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="update-traders">
          <h2>Update Top Traders</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Trades</th>
                <th>ROI</th>
              </tr>
            </thead>
            <tbody className='traders-table-modified'>
              {leagueData.currentLeague.traders.map((trader) => (
                <tr key={trader.rank}>
                  <td>{trader.rank}</td>
                  <td>
                    <input
                      type="text"
                      value={trader.name}
                      onChange={(e) =>
                        handleUpdateTrader('currentLeague', trader.rank, 'name', e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={trader.trades}
                      onChange={(e) =>
                        handleUpdateTrader('currentLeague', trader.rank, 'trades', parseInt(e.target.value))
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={trader.roi}
                      onChange={(e) =>
                        handleUpdateTrader('currentLeague', trader.rank, 'roi', parseFloat(e.target.value))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="modal-content">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Enlarged Trading Screenshot"
              style={{ maxWidth: '90%', maxHeight: '90%' }}
            />
            <button className="close-modal-btn" onClick={closeImageModal}>
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;