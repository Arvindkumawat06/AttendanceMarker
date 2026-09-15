import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const AttendanceHistory = () => {
  const { classId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/teachers/getAttendanceHistory/${classId}`, {
        withCredentials: true,
      })
      .then((response) => setSessions(response.data.sessions))
      .catch((requestError) => {
        setError(requestError.response?.data?.message || "Unable to load attendance history.");
      })
      .finally(() => setLoading(false));
  }, [classId]);

  return (
    <main>
      <Link to="/create-class">Back to classes</Link>
      <h1>Attendance history</h1>

      {loading && <p>Loading attendance history...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && sessions.length === 0 && (
        <p>No attendance has been marked for this class yet.</p>
      )}

      {sessions.map((session) => {
        const presentCount = session.records.filter((record) => record.status === "Present").length;
        const absentCount = session.records.filter((record) => record.status === "Absent").length;

        return (
          <section key={session._id}>
            <h2>{new Date(session.date).toLocaleDateString()}</h2>
            <p>Present: {presentCount} | Absent: {absentCount}</p>
            <ul>
              {session.records.map((record) => (
                <li key={record._id || record.studentId?._id}>
                  {record.studentId?.name || "Removed student"} ({record.studentId?.rollNumber || "-"})
                  {" - "}{record.status} at {new Date(record.timestamp).toLocaleTimeString()}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
};

export default AttendanceHistory;
