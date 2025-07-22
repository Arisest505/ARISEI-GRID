import AuthContainer from "../widgets/auth/AuthContainer";
import Footer from "../widgets/Footer";
import NavBar from "../widgets/NavBar";


export default function PlansPage() {
  return (
    <>
      <NavBar />
      <main>
        <AuthContainer />
      </main>
      <Footer />
    </>
  );
}
