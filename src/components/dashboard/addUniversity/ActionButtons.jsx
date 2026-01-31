import React from "react";

export default function ActionButtons({ onSubmit, onReset, loading }) {
  return (
    <>
      <button 
        onClick={onReset}
        disabled={loading}
        className="bg-card-dark text-text-subtle hover:text-white px-8 py-2.5 rounded-lg font-bold text-sm border border-border-dark hover:border-text-subtle disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Reset
      </button>
      <button 
        onClick={onSubmit}
        disabled={loading}
        className="bg-primary text-background-dark hover:bg-primary/80 px-8 py-2.5 rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Adding..." : "Add University"}
      </button>
    </>
  );
}
