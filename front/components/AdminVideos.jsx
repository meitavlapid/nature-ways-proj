import React, { useEffect, useState } from "react";
import { useUser } from "../hooks/UserContext";
import api from "../src/services/api";
import "../css/AdminVideos.css";

function AdminVideos() {
  const { user } = useUser();
  const [videos, setVideos] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await api.get("/api/videos");
      setVideos(res.data);
    } catch (err) {
      console.error("שגיאה בטעינת סרטונים:", err.message);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      await api.post("/api/videos", formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setVideoFile(null);
      fetchVideos();
    } catch (err) {
      console.error("שגיאה בהעלאת וידאו:", err.message);
      alert("שגיאה בהעלאת וידאו");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("למחוק את הסרטון?")) return;
    try {
      await api.delete(`/api/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      fetchVideos();
    } catch (err) {
      console.error("שגיאה במחיקת וידאו:", err.message);
    }
  };

  return (
    <div className="container" dir="rtl">
      <h2 >ניהול סרטונים</h2>

      <div >
        <label htmlFor="videoFile" >
          העלאת סרטון
        </label>
        <input
          type="file"
          accept="video/*"
          className="form-control"
          onChange={(e) => setVideoFile(e.target.files[0])}
        />

        <button
         
          onClick={handleUpload}
          disabled={uploading || !videoFile}
        >
          {uploading ? "מעלה..." : " הוסף וידאו"}
        </button>
      </div>

      <div>
        {videos.map((video) => (
          <div  key={video._id}>
            <div className="card">
              <div className="card-body">
                <video src={video.url} controls width="100%" height="240" />
                <button
                 
                  onClick={() => handleDelete(video._id)}
                >
                  מחק
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminVideos;
