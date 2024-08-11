import React, { useState } from "react";

function HamburgerMenu({ onClick, isSidebarOpen }: { onClick: () => void; isSidebarOpen: boolean }) {
  return (
    <div className="container-menu">
      <input
        type="checkbox"
        id="checkbox1"
        className="checkbox1 visuallyHidden"
        onClick={onClick}
      />
      <label htmlFor="checkbox1">
        <div className={`hamburger hamburger1 ${isSidebarOpen ? 'active' : ''} cursor-pointer`}>
          <span className="bar bar1"></span>
          <span className="bar bar2"></span>
          <span className="bar bar3"></span>
          <span className="bar bar4"></span>
        </div>
      </label>
    </div>
  );
}

export default HamburgerMenu;