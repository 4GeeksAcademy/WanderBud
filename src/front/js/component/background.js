import React from 'react';
import "../../styles/background.css"

const Background = () => {
    return (
        <div className="background">
            <div className="mountains">
                {/* Puedes agregar más divs con la clase "peak" para crear más picos */}
                <div className="peak peak1"></div>
                <div className="peak peak2"></div>
                <div className="peak peak3"></div>
                <div className="peak peak4"></div>
            </div>
            <div className="moon"></div>
        </div>
    );
};

export default Background;
