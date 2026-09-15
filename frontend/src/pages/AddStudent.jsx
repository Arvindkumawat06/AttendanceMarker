import axios from "axios";
import * as faceapi from "@vladmandic/face-api";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://localhost:8080/api/teachers";
const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";

const AddStudent = () => {
  const { classId } = useParams();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [modelsReady, setModelsReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("Loading camera and face models...");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    axios
      .get(`${API_URL}/getAllStudents/${classId}`, { withCredentials: true })
      .then((response) => setStudents(response.data.students))
      .catch(() => setError("Unable to load students."));

    const startCamera = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        setModelsReady(true);
        setMessage("Camera ready. Enter details, then capture the student's face.");
      } catch (cameraError) {
        setError(cameraError.message || "Camera permission is required to add a student.");
        setMessage("");
      }
    };

    startCamera();

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [classId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!studentName.trim() || !rollNumber.trim()) {
      setError("Enter the student's name and roll number.");
      return;
    }

    if (!modelsReady || !videoRef.current) {
      setError("The camera is not ready yet.");
      return;
    }

    setSubmitting(true);
    setMessage("Capturing face...");

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection?.descriptor) {
        throw new Error("No clear face found. Center one face in the camera and try again.");
      }

      const response = await axios.post(
        `${API_URL}/addStudent/${classId}`,
        {
          name: studentName.trim(),
          rollNumber: rollNumber.trim(),
          faceDescriptor: Array.from(detection.descriptor),
        },
        { withCredentials: true }
      );

      setStudents((currentStudents) => [...currentStudents, response.data.student]);
      setStudentName("");
      setRollNumber("");
      setMessage("Student added with face capture.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
      setMessage("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`${API_URL}/deleteStudent/${studentId}`, {
        withCredentials: true,
      });
      setStudents((currentStudents) => currentStudents.filter((student) => student._id !== studentId));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete student.");
    }
  };

  return (
    <main>
      <Link to="/create-class">Back to classes</Link>
      <h1>Students in class</h1>

      <section>
        <h2>Add student</h2>
        <video ref={videoRef} autoPlay muted playsInline width="480" height="360" />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Student name"
            value={studentName}
            onChange={(event) => setStudentName(event.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Roll number"
            value={rollNumber}
            onChange={(event) => setRollNumber(event.target.value)}
            required
          />
          <button type="submit" disabled={!modelsReady || submitting}>
            {submitting ? "Adding student..." : "Capture face and add student"}
          </button>
        </form>
        {message && <p role="status">{message}</p>}
        {error && <p role="alert">{error}</p>}
      </section>

      <section>
        <h2>Students</h2>
        {students.map((student) => (
          <div key={student._id}>
            <p>{student.name} - {student.rollNumber}</p>
            <Link to={`/enroll-face/${student._id}`}>Replace face</Link>
            <button type="button" onClick={() => handleDelete(student._id)}>Delete</button>
          </div>
        ))}
      </section>
    </main>
  );
};

export default AddStudent;