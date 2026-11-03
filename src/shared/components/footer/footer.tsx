import { FooterLogo } from "./footer-logo";
import { FooterLinks } from "./footer-links";
import SubscritionForm from "./subscrition-form";


export function Footer() {

  return (
    <footer className="bg-bg-inverse text-zinc-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-4">
          {/* Left Section - Logo & Copyright */}
          <FooterLogo />

          {/* Middle Section - Discover Links */}
          <FooterLinks />


          {/* Right Section - Newsletter */}
          <SubscritionForm />
        </div>
      </div>
    </footer>
  );
}
