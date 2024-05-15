import React from "react";
import "./Spinner.css";

const Spinner = () => <><div className="spinner_overlay"></div><div className="loader"></div></>;

export function inlineSpinner(){
    const inline_spinner_element = document.createElement("p");
    inline_spinner_element.className = "inline_spinner loader";
    return inline_spinner_element
}

export default Spinner;