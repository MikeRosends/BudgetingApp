import React from "react";
import "./MainContainer.css";

export const MainContainer = () => {
  return (
    <div className="main-container">
      <div className="header">
        <p className="header-title">Miguel Rosendo</p>
        <p className="header-date">
          21<sup>st</sup> of november
        </p>
      </div>
      <div className="main-stats">
        <div className="individual-stat">
          <h2>45</h2>
          <p>In progress</p>
        </div>
        <div className="individual-stat">
          <h2>15</h2>
          <p>Upcoming</p>
        </div>
        <div className="individual-stat">
          <h2>60</h2>
          <p>Total projects</p>
        </div>
      </div>
      <div className="cards-container">
        <div className="card-row">
          <div className="card">
            <p>Account 1</p>
            <p className="card-amount">345 €</p>
            <button>
              <p >Check Movements</p>
            </button>
          </div>
          <div className="card">
            <p>Account 2</p>
            <p className="card-amount">345 €</p>
            <button>
              <p>Check Movements</p>
            </button>
          </div>
          <div className="card">
            <p>Account 3</p>
            <p className="card-amount">345 €</p>
            <button>
              <p>Check Movements</p>
            </button>
          </div>
        </div>
        <div className="card-row">
          <div className="card">
            <p>Account 4</p>
            <p className="card-amount">345 €</p>
            <button>
              <p>Check Movements</p>
            </button>
          </div>
          <div className="card">
            <p>Account 5</p>
            <p className="card-amount">345 €</p>
            <button>
              <p>Check Movements</p>
            </button>
          </div>
          <div className="card">
            <p>Account 6</p>
            <p className="card-amount">345 €</p>
            <button>
              <p>Check Movements</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
