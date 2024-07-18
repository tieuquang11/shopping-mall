import React, { useState, useEffect } from 'react';
import './Slideshow.css';

const Slideshow = () => {
    const [slideIndex, setSlideIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            showSlides();
        }, 2000);
        return () => clearInterval(interval);
    }, [slideIndex]);

    const showSlides = () => {
        const slides = document.getElementsByClassName("mySlides");
        const dots = document.getElementsByClassName("dot");

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        setSlideIndex((prevIndex) => {
            let newIndex = prevIndex + 1;
            if (newIndex > slides.length) {
                newIndex = 1;
            }
            for (let i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace(" active", "");
            }
            slides[newIndex - 1].style.display = "block";
            dots[newIndex - 1].className += " active";
            return newIndex;
        });
    };

    return (
        <div className="slideshow-container">
            <div className="mySlides fade">
                <div className="numbertext">1 / 3</div>
                <img src="/image/anh1.png" alt="Nature" style={{ width: '100%' }} />
                <div className="text"></div>
            </div>

            <div className="mySlides fade">
                <div className="numbertext">2 / 3</div>
                <img src="/image/anh2.png" alt="Snow" style={{ width: '100%' }} />
                <div className="text"></div>
            </div>

            <div className="mySlides fade">
                <div className="numbertext">3 / 3</div>
                <img src="/image/anh3.png" alt="Mountains" style={{ width: '100%' }} />
                <div className="text"></div>
            </div>

            <div style={{ textAlign: 'center' }}>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>
        </div>
    );
};

export default Slideshow;
