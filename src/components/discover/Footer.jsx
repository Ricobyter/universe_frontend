import { LiaUniversitySolid } from "react-icons/lia";

export default function Footer() {
  return (
    <footer className="text-white border-t border-dark-green mt-32 py-8 font-inter">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <div className="flex items-center gap-2 text-text-light">
            <div className="size-5 text-light-green">
<LiaUniversitySolid />
            </div>
            <h2 className="text-base font-bricolage font-bold">Universe</h2>
          </div>
          <p className="text-light-gray text-xs">
            © 2025 Universe. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-light-gray">
          <a
            className="text-text-muted hover:text-primary text-xs transition-colors"
            href="#"
          >
            About Us
          </a>
          <a
            className="text-text-muted hover:text-primary text-xs transition-colors"
            href="#"
          >
            Contact
          </a>
          <a
            className="text-text-muted hover:text-primary text-xs transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-text-muted hover:text-primary text-xs transition-colors"
            href="#"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
