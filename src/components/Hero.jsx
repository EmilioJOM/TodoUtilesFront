import "./componentsStyles/Hero.css";
import {setFilterCategory} from "../redux/categorySlice.js";
import { useDispatch } from "react-redux";

export default function Hero() {
   
  const dispatch=useDispatch()

  return (
    <section className="hero-container">
      <div className="hero-content">
        <h1>
          Todo para tu <span className="highlight">oficina</span> y{" "}
          <span className="highlight">escuela</span> en un solo lugar.
        </h1>
        <p>
          Encuentra los mejores útiles, con la mejor calidad y al mejor precio.{" "}
          <br />
          ¡Explora nuestras categorías!
        </p>

       {<a
        onClick={()=>dispatch(setFilterCategory(""))} 
        href="#/search" className="hero-button">
          Ver productos
        </a>}

      </div>

      <div className="hero-image">
        <img
          src="/cuadernos.png"
          alt="Útiles escolares y de oficina"
        />
      </div>
    </section>
  );
}
