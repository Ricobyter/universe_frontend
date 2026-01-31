import React from "react";

export default function Breadcrumbs() {
  return (
    <div className="flex flex-wrap gap-2 mb-4 text-light-gray">
      <a href="#" className="text-text-subtle hover:text-primary text-base font-medium leading-normal">
        Dashboard
      </a>
      <span className="text-text-subtle text-base font-medium leading-normal">/</span>
      <a href="#" className="text-text-subtle hover:text-primary text-base font-medium leading-normal">
        Universities
      </a>
      <span className="text-text-subtle text-base font-medium leading-normal">/</span>
      <span className="text-light-green text-base font-medium leading-normal">Add University</span>
    </div>
  );
}
