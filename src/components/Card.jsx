// src/components/Card.jsx
export default function Card({ count, title, iconClass, className }) {
  return (
    <div className={`col-xl-3 col-sm-6 col-12 d-flex`}>
      <div className={`dash-count ${className}`}>
        <div className="dash-counts">
          <h4>{count}</h4>
          <h5>{title}</h5>
        </div>
        <div className="dash-imgs">
          <i data-feather={iconClass}></i>
        </div>
      </div>
    </div>
  );
}
