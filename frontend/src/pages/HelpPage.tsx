import HelpHero from "../widgets/Help/HelpHero";
import HelpQuestionForm from "../widgets/Help/HelpQuestionForm";
import HelpQuestionsView from "../widgets/Help/HelpQuestionsView";
import Footer from "../widgets/Footer";
import NavBar from "../widgets/NavBar";

export default function HelpPage() {
  return (
    <>
    <NavBar />
    <main>
      <HelpHero />
      <HelpQuestionForm />
      <HelpQuestionsView />
    </main>
    <Footer />
   </>
  );
}
