import React from "react";

export default function TopNavBar() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark bg-background-dark/80 px-10 py-3 backdrop-blur-md">
      <label className="relative flex flex-col h-10! w-full max-w-sm">
        <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
          <div className="text-text-subtle flex border-none bg-card-dark items-center justify-center pl-4 rounded-l-lg border-r-0">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-card-dark h-full placeholder:text-text-subtle px-4 pl-2 text-base font-normal leading-normal"
            placeholder="Search anything..."
          />
        </div>
      </label>
      <div className="flex flex-1 justify-end gap-4 items-center">
        <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-card-dark text-text-subtle hover:text-white hover:bg-primary/20">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAoIAX3PLWozQ21-MJPFlP3XR0X07qcBMuFZBgEWD6Iq-GeVg-dOr0v0P6MMnwynK-6PZsx5pgUvmPn5vgwoT7anWUmnyu_PiBAc7IG3q60uIcPRp2XHQzpWUNhkeqRNhrY4Aospc39bMaMGZG6fjVEJI_0JygWSYhMqFdPM9kAGEe2jUhoI_nI9Bd1pYoUXzuUe7zlRc1fySdAb3rw62UvUpTtgGcYqg2e9VQG3dGvbqjXI8U8OWreTOBaixSukykfMgtiLDp6Bw')" }}
          alt="Admin user avatar"
        ></div>
      </div>
    </header>
  );
}
