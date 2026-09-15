import axios from "axios";
import * as faceapi from "@vladmandic/face-api";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://localhost:8080/api/teachers";
const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";

const FaceCapture = ({ enrollment = false }) => {
  const { classId, studentId } = useParams();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [modelsReady, setModelsReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Loading face models...");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

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
        setMessage("Camera ready. Center one face in the frame.");
      } catch (cameraError) {
        setError(cameraError.message || "Unable to start the camera.");
        setMessage("");
      }
    };

    startCamera();

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const captureDescriptor = async () => {
    if (!modelsReady || !videoRef.current) {
      return null;
    }

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    return detection?.descriptor ? Array.from(detection.descriptor) : null;
  };

  const handleCapture = async () => {
    setBusy(true);
    setError("");
    setMessage("Looking for a face...");

    try {
      const descriptor = await captureDescriptor();
      if (!descriptor) {
        throw new Error("No clear face found. Move closer and try again.");
      }

      if (enrollment) {
        await axios.put(
          `${API_URL}/student/${studentId}/face-descriptor`,
          { faceDescriptor: descriptor },
          { withCredentials: true }
        );
        setMessage("Face enrolled successfully.");
      } else {
        const response = await axios.post(
          `${API_URL}/markAttendanceByFace/${classId}`,
          { faceDescriptor: descriptor },
          { withCredentials: true }
        );
        const { name, rollNumber } = response.data.student;
        setMessage(`Attendance marked for ${name} (${rollNumber}).`);
      }
    } catch (captureError) {
      setError(captureError.response?.data?.message || captureError.message);
      setMessage("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main>
      <Link to={enrollment ? "/create-class" : "/dashboard"}>Back</Link>
      <h1>{enrollment ? "Enroll student face" : "Mark attendance"}</h1>
      <video ref={videoRef} autoPlay muted playsInline width="640" height="480" />
      <div>
        <button type="button" onClick={handleCapture} disabled={!modelsReady || busy}>
          {busy ? "Capturing..." : enrollment ? "Capture and save face" : "Capture and mark attendance"}
        </button>
      </div>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
    </main>
  );
};

export const EnrollFace = () => <FaceCapture enrollment />;
export default FaceCapture;
