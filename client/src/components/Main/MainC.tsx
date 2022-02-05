import React from "react";
import Slider from "react-slick";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};
function MainC() {
  return (
    <Carousel showThumbs={false} {...settings}>
      <div>
        <img src="carossel/1.jpg" />
        <p className="legend">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
          architecto amet ratione molestias adipisci dolor error delectus
          recusandae rem earum, commodi dolores ipsa, labore voluptates. Atque
          reprehenderit deleniti eos ipsa?
        </p>
      </div>
      <div>
        <img src="carossel/2.jpg" />
        <p className="legend">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
          architecto amet ratione molestias adipisci dolor error delectus
          recusandae rem earum, commodi dolores ipsa, labore voluptates. Atque
          reprehenderit deleniti eos ipsa?
        </p>
      </div>
      <div>
        <img src="carossel/3.jpg" />
        <p className="legend">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
          architecto amet ratione molestias adipisci dolor error delectus
          recusandae rem earum, commodi dolores ipsa, labore voluptates. Atque
          reprehenderit deleniti eos ipsa?
        </p>
      </div>
      <div>
        <img src="carossel/4.jpg" />
        <p className="legend">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
          architecto amet ratione molestias adipisci dolor error delectus
          recusandae rem earum, commodi dolores ipsa, labore voluptates. Atque
          reprehenderit deleniti eos ipsa?
        </p>
      </div>
      <div>
        <img src="carossel/5.jpg" />
        <p className="legend">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
          architecto amet ratione molestias adipisci dolor error delectus
          recusandae rem earum, commodi dolores ipsa, labore voluptates. Atque
          reprehenderit deleniti eos ipsa?
        </p>
      </div>
      <div>
        <img src="carossel/7.jpg" />
        <p className="legend">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
          architecto amet ratione molestias adipisci dolor error delectus
          recusandae rem earum, commodi dolores ipsa, labore voluptates. Atque
          reprehenderit deleniti eos ipsa?
        </p>
      </div>
    </Carousel>
  );
}

export default MainC;
