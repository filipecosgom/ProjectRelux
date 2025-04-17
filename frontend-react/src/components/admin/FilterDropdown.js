import React from "react";
import "./FilterDropdown.css";

const FilterDropdown = ({ selectedState, onStateChange, onClearFilter }) => {
  return (
    <div className="filter-dropdown">
      <select
        value={selectedState}
        onChange={(e) => onStateChange(e.target.value)}
        className="filter-select"
      >
        <option value="">Todos</option>
        <option value="DISPONIVEL">Disponível</option>
        <option value="COMPRADO">Comprado</option>
        <option value="RASCUNHO">Rascunho</option>
        <option value="RESERVADO">Reservado</option>
        <option value="APAGADO">Apagado</option>
      </select>
      <button onClick={onClearFilter} className="clear-filter-button">
        Limpar Filtro
      </button>
    </div>
  );
};

export default FilterDropdown;
