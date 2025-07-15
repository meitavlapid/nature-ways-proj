import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import api from "../src/services/api";
import "../css/Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    autoplay: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: () => {
      const videos = document.querySelectorAll(".video-slide video");
      videos.forEach((video) => {
        if (!video.paused) {
          video.pause();
          video.currentTime = 0;
        }
      });
    },
  };

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const videoRefs = useRef([]);

  useEffect(() => {
    api
      .get("/api/images")
      .then((res) => setImages(res.data))
      .catch((err) => console.error("שגיאה בטעינת תמונות:", err));
  }, []);

  useEffect(() => {
    api
      .get("/api/videos")
      .then((res) => setVideos(res.data))
      .catch((err) => console.error("שגיאה בטעינת סרטונים:", err));
  }, []);

  const getImageUrl = (key) => {
    const image = images.find((img) => img.key === key);
    return image ? image.url : "";
  };

  return (
    <div className="home">
      {getImageUrl("home") && (
        <img
          src={getImageUrl("home")}
          alt="תמונה ראשית"
          className="main-image"
        />
      )}
      <div className="image-row">
        {getImageUrl("nutri") && (
          <div className="flip-card">
            <div className="flip-inner">
              <div className="flip-front">
                <img src={getImageUrl("nutri")} alt="תמונה 2" />
              </div>
              <div className="flip-back">
                <span className="flip-text-right">
                  נוטריקוסמטיקה (Nutricosmetics) היא גישה חדשנית המתבססת על
                  מחקרים מדעיים המוכיחים כי עור בריא, מוצק וקורן מתחיל מבפנים.
                  <br />
                  <Link to="/articles/6866cf5ef6f004617a06de80">
                    
                    למאמר המלא
                  </Link>
                </span>
              </div>
            </div>
          </div>
        )}
        {getImageUrl("dermo") && (
          <div className="flip-card">
            <div className="flip-inner">
              <div className="flip-front">
                <img src={getImageUrl("dermo")} alt="תמונה 3" />
              </div>
              <div className="flip-back">
                <span className="flip-text-left">
                  דרמו-קוסמטיקה (Dermocosmetics) היא גישה מדעית־טיפולית לחידוש
                  העור, מוצרים דרמוקוסמטיים אינם מסתפקים בשיפור זמני של מראה
                  העור – אלא משפיעים על מנגנונים ביולוגיים עמוקים, ומיועדים
                  לטיפול במגוון בעיות.
                  <br />
                  <Link to="/articles/6866d132f6f004617a06debd">
                    למאמר המלא
                  </Link>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="text-container">
        <p>עם הזמן הצטברו לא רק מוצרים – גם סיפורים.</p>
        <p>אספנו בשבילכם רגעים אמיתיים מהשטח ובחרנו לשתף אתכם בכמה מהם</p>
        <p>
          סרטונים אותנטיים שממחישים איך נייצ'ר וויז משתלבת ביום-יום של קליניקות,
          מטפלים ומטופלים.
        </p>

        <div className="video-wrapper">
          {videos.length > 0 && (
            <div className="video-carousel">
              <Slider {...settings}>
                {videos.map((video, index) => (
                  <div className="video-slide" key={video._id}>
                    <video
                      controls
                      src={video.url}
                      width="100%"
                      height="400"
                      ref={(el) => (videoRefs.current[index] = el)}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
