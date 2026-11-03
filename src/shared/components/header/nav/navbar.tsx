import { NavMenu } from "./nav-menu";




export function Navbar() {

  return (
    <nav className="bg-bg-primary-saturated text-primary-foreground">
      <div className="container mx-auto px-4">
        <NavMenu />
      </div>
    </nav>
  );
}
