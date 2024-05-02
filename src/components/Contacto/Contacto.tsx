
import './Contacto.css'

export const Contacto = () => {
  return (
    <div>
      <div className="AboutUs">
        <article>
          <h3 style={{ textAlign: "center" }}>Trabajo practicas profesionales</h3>
        </article>
        <div className="integrantes-wrapper">
          <article>
            <img src="/Franco.png" alt="" />
            <div className="habilities">
              <h1>Habilidades:</h1>
              <span> Java </span>
              <span> Javascript </span>
              <span> Typescript </span>
              <span> React </span>
              <span> HTML </span>
              <span> CSS </span>
              <span> SCSS </span>
              <h1>Contacto:</h1>
              <span> franco.gonzalez.reale.276@gmail.com</span>
              <a href="http://www.linkedin.com/in/franco-gonzalez-reale/" target="_blank" rel="noopener noreferrer">www.linkedin.com/in/franco-gonzalez-reale/</a>
              <a href="https://github.com/francoGonzalez2706" target="_blank" rel="noopener noreferrer">https://github.com/francoGonzalez2706/</a>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};


